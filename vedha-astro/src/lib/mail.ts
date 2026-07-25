import net from "node:net";
import tls from "node:tls";
import nodemailer from "nodemailer";

const requiredSmtp = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;

/** Runtime env only — Vite inlines import.meta.env at build time and strips custom keys. */
function env(key: string, fallback = ""): string {
  let value = String(process.env[key] ?? fallback).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

export function smtpConfigured(): boolean {
  return requiredSmtp.every((key) => Boolean(env(key)));
}

export function resendConfigured(): boolean {
  return Boolean(env("RESEND_API_KEY"));
}

export function mailConfigured(): boolean {
  return resendConfigured() || smtpConfigured();
}

export function mailDiagnostics() {
  const port = Number(env("SMTP_PORT", "587") || "587");
  return {
    mailConfigured: mailConfigured(),
    smtpConfigured: smtpConfigured(),
    resendConfigured: resendConfigured(),
    smtpHost: env("SMTP_HOST") || null,
    smtpPort: smtpConfigured() ? port : null,
    smtpSecure:
      env("SMTP_SECURE", port === 465 ? "true" : "false").toLowerCase() ===
        "true" || port === 465,
    smtpUserSet: Boolean(env("SMTP_USER")),
    smtpPassSet: Boolean(env("SMTP_PASS")),
    smtpFrom: env("SMTP_FROM") || env("SMTP_USER") || null,
    contactTo: env("CONTACT_TO", "info@vedha.ae"),
    railway: Boolean(
      process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID
    ),
  };
}

/** TCP/TLS reachability check — does not authenticate. */
export function probeSmtpPort(timeoutMs = 4_000): Promise<{
  reachable: boolean;
  error?: string;
  ms: number;
}> {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT", "587") || "587");
  const secure =
    env("SMTP_SECURE", port === 465 ? "true" : "false").toLowerCase() ===
      "true" || port === 465;

  if (!host) {
    return Promise.resolve({ reachable: false, error: "SMTP_HOST missing", ms: 0 });
  }

  const started = Date.now();

  return new Promise((resolve) => {
    const finish = (reachable: boolean, error?: string) => {
      resolve({ reachable, error, ms: Date.now() - started });
    };

    const onConnect = (socket: { end: () => void; destroy: () => void }) => {
      socket.end();
      finish(true);
    };

    const onFail = (err: Error) => finish(false, err.message);

    if (secure) {
      const socket = tls.connect(
        { host, port, servername: host, timeout: timeoutMs },
        () => onConnect(socket)
      );
      socket.on("error", onFail);
      socket.on("timeout", () => {
        socket.destroy();
        finish(false, "TLS connect timeout");
      });
    } else {
      const socket = net.connect({ host, port }, () => onConnect(socket));
      socket.setTimeout(timeoutMs);
      socket.on("error", onFail);
      socket.on("timeout", () => {
        socket.destroy();
        finish(false, "TCP connect timeout");
      });
    }
  });
}

function createTransport() {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT", "587") || "587");
  const secure =
    env("SMTP_SECURE", port === 465 ? "true" : "false").toLowerCase() ===
      "true" || port === 465;
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    requireTLS: !secure && (port === 587 || port === 25),
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    tls: {
      servername: host,
      rejectUnauthorized:
        env("SMTP_TLS_REJECT_UNAUTHORIZED", "true").toLowerCase() !== "false",
    },
  });
}

export type MailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(
        new Error(
          `${label} timed out after ${ms}ms (host=${env("SMTP_HOST")}:${env("SMTP_PORT", "587")}). If this persists on Railway Pro, redeploy once, or try SMTP_PORT=587 with SMTP_SECURE=false.`
        )
      );
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function sendViaResend(payload: MailPayload) {
  const apiKey = env("RESEND_API_KEY");
  const to = env("CONTACT_TO", "info@vedha.ae");
  const from = env("SMTP_FROM", "Vedha Website <onboarding@resend.dev>");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.replyTo || undefined,
      subject: payload.subject,
      text: payload.text,
    }),
    signal: AbortSignal.timeout(12_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend failed (${res.status}): ${detail.slice(0, 300)}`);
  }
}

async function sendViaSmtp(payload: MailPayload) {
  const to = env("CONTACT_TO", "info@vedha.ae");
  const from = env("SMTP_FROM", env("SMTP_USER"));
  if (!from) {
    throw new Error("SMTP_FROM (or SMTP_USER) is required as the From address.");
  }

  const transport = createTransport();
  try {
    await withTimeout(
      transport.sendMail({
        from,
        to,
        replyTo: payload.replyTo || undefined,
        subject: payload.subject,
        text: payload.text,
      }),
      18_000,
      "SMTP send"
    );
  } finally {
    transport.close();
  }
}

export async function sendContactMail(payload: MailPayload) {
  if (resendConfigured()) {
    await sendViaResend(payload);
    return;
  }
  if (smtpConfigured()) {
    await sendViaSmtp(payload);
    return;
  }
  throw new Error(
    "Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS (and optionally SMTP_FROM, CONTACT_TO)."
  );
}
