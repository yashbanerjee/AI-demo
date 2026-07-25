import nodemailer from "nodemailer";

const requiredSmtp = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;

/** Runtime env only — Vite inlines import.meta.env at build time and strips custom keys. */
function env(key: string, fallback = ""): string {
  let value = String(process.env[key] ?? fallback).trim();
  // Railway/dotenv often stores values with wrapping quotes.
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
      env("SMTP_SECURE", "false").toLowerCase() === "true" || port === 465,
    smtpUserSet: Boolean(env("SMTP_USER")),
    smtpPassSet: Boolean(env("SMTP_PASS")),
    smtpFrom: env("SMTP_FROM") || env("SMTP_USER") || null,
    contactTo: env("CONTACT_TO", "info@vedha.ae"),
    railway: Boolean(
      process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID
    ),
  };
}

function createTransport() {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT", "587") || "587");
  const secure =
    env("SMTP_SECURE", "false").toLowerCase() === "true" || port === 465;
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
    // Port 587 expects STARTTLS; without this some hosts hang or reject.
    requireTLS: !secure && port === 587,
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 20_000,
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
          `${label} timed out after ${ms}ms. Check SMTP_HOST/SMTP_PORT reachability from Railway (Pro may need a redeploy after upgrade).`
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
      25_000,
      "SMTP send"
    );
  } finally {
    transport.close();
  }
}

export async function sendContactMail(payload: MailPayload) {
  // Prefer Resend only when explicitly configured; otherwise use SMTP.
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
