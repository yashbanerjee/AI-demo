import net from "node:net";
import tls from "node:tls";
import type { Socket } from "node:net";
import type { TLSSocket } from "node:tls";

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
  const secure =
    env("SMTP_SECURE", port === 465 ? "true" : "false").toLowerCase() ===
      "true" || port === 465;
  return {
    mailConfigured: mailConfigured(),
    smtpConfigured: smtpConfigured(),
    resendConfigured: resendConfigured(),
    smtpHost: env("SMTP_HOST") || null,
    smtpPort: smtpConfigured() ? port : null,
    smtpSecure: secure,
    smtpUserSet: Boolean(env("SMTP_USER")),
    smtpPassSet: Boolean(env("SMTP_PASS")),
    smtpFrom: env("SMTP_FROM") || env("SMTP_USER") || null,
    contactTo: env("CONTACT_TO", "info@vedha.ae"),
    railway: Boolean(
      process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID
    ),
    transport: resendConfigured() ? "resend" : smtpConfigured() ? "smtp-direct" : null,
  };
}

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

    if (secure) {
      const socket = tls.connect(
        { host, port, servername: host, timeout: timeoutMs },
        () => {
          socket.end();
          finish(true);
        }
      );
      socket.on("error", (err) => finish(false, err.message));
      socket.on("timeout", () => {
        socket.destroy();
        finish(false, "TLS connect timeout");
      });
      return;
    }

    const socket = net.connect({ host, port }, () => {
      socket.end();
      finish(true);
    });
    socket.setTimeout(timeoutMs);
    socket.on("error", (err) => finish(false, err.message));
    socket.on("timeout", () => {
      socket.destroy();
      finish(false, "TCP connect timeout");
    });
  });
}

export type MailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

function extractAddress(value: string): string {
  const match = value.match(/<([^>]+)>/);
  return (match ? match[1] : value).trim();
}

function encodeSubject(subject: string): string {
  if (/^[\x20-\x7E]*$/.test(subject)) return subject;
  return `=?UTF-8?B?${Buffer.from(subject, "utf8").toString("base64")}?=`;
}

type SmtpSocket = Socket | TLSSocket;

class SmtpSession {
  private buffer = "";
  private closed = false;

  constructor(readonly socket: SmtpSocket) {
    this.socket.setEncoding("utf8");
    this.socket.on("data", (chunk: string | Buffer) => {
      this.buffer += String(chunk);
    });
    this.socket.on("close", () => {
      this.closed = true;
    });
  }

  private writeLine(line: string) {
    if (this.closed) throw new Error("SMTP connection closed");
    this.socket.write(`${line}\r\n`);
  }

  private readResponse(timeoutMs: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        const chunks: string[] = [];
        let offset = 0;
        while (true) {
          const next = this.buffer.indexOf("\r\n", offset);
          if (next === -1) break;
          const line = this.buffer.slice(offset, next);
          chunks.push(line);
          offset = next + 2;
          if (/^\d{3} /.test(line)) {
            this.buffer = this.buffer.slice(offset);
            resolve(chunks.join("\r\n"));
            return;
          }
        }
        if (this.closed) {
          reject(new Error(`SMTP closed early. Buffer: ${this.buffer.slice(0, 200)}`));
          return;
        }
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`SMTP response timeout. Buffer: ${this.buffer.slice(0, 200)}`));
          return;
        }
        setTimeout(tick, 15);
      };
      tick();
    });
  }

  async command(ok: string | string[], line?: string, timeoutMs = 12_000) {
    if (line !== undefined) this.writeLine(line);
    const response = await this.readResponse(timeoutMs);
    const allowed = Array.isArray(ok) ? ok : [ok];
    if (!allowed.some((code) => response.startsWith(code))) {
      throw new Error(
        `SMTP error${line ? ` for "${line.split(" ")[0]}"` : ""}: ${response}`
      );
    }
    return response;
  }

  destroy() {
    try {
      this.socket.destroy();
    } catch {
      /* ignore */
    }
  }
}

function openSocket(): Promise<SmtpSession> {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT", "587") || "587");
  const secure =
    env("SMTP_SECURE", port === 465 ? "true" : "false").toLowerCase() ===
      "true" || port === 465;
  const rejectUnauthorized =
    env("SMTP_TLS_REJECT_UNAUTHORIZED", "true").toLowerCase() !== "false";

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`SMTP connect timeout to ${host}:${port}`));
    }, 10_000);

    const fail = (err: Error) => {
      clearTimeout(timer);
      reject(err);
    };

    if (secure) {
      // Attach readers immediately so the 220 banner is never missed.
      const socket = tls.connect({
        host,
        port,
        servername: host,
        rejectUnauthorized,
      });
      const session = new SmtpSession(socket);
      socket.once("secureConnect", () => {
        session
          .command("220")
          .then(() => {
            clearTimeout(timer);
            resolve(session);
          })
          .catch(fail);
      });
      socket.on("error", fail);
      return;
    }

    // Plain connection + STARTTLS (port 587)
    const socket = net.connect({ host, port });
    const bootstrap = new SmtpSession(socket);
    socket.once("connect", () => {
      bootstrap
        .command("220")
        .then(() => bootstrap.command("250", `EHLO vedha.ae`))
        .then(() => bootstrap.command("220", "STARTTLS"))
        .then(
          () =>
            new Promise<SmtpSession>((res, rej) => {
              const secureSocket = tls.connect({
                socket,
                servername: host,
                rejectUnauthorized,
              });
              const session = new SmtpSession(secureSocket);
              secureSocket.once("secureConnect", () => res(session));
              secureSocket.on("error", rej);
            })
        )
        .then((session) => {
          clearTimeout(timer);
          resolve(session);
        })
        .catch(fail);
    });
    socket.on("error", fail);
  });
}

async function sendViaSmtpDirect(payload: MailPayload) {
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");
  const to = env("CONTACT_TO", "info@vedha.ae");
  const fromHeader = env("SMTP_FROM", user);
  const fromAddr = extractAddress(fromHeader);

  if (!user || !pass || !fromAddr) {
    throw new Error("SMTP_USER, SMTP_PASS, and SMTP_FROM/SMTP_USER are required.");
  }

  const smtp = await openSocket();

  try {
    // Banner already consumed during connect for both 465 and STARTTLS.
    await smtp.command("250", "EHLO vedha.ae");
    await smtp.command("334", "AUTH LOGIN");
    await smtp.command("334", Buffer.from(user, "utf8").toString("base64"));
    await smtp.command("235", Buffer.from(pass, "utf8").toString("base64"));
    await smtp.command("250", `MAIL FROM:<${fromAddr}>`);
    await smtp.command("250", `RCPT TO:<${extractAddress(to)}>`);
    await smtp.command("354", "DATA");

    const body = payload.text.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
    const headers = [
      `From: ${fromHeader}`,
      `To: ${to}`,
      payload.replyTo ? `Reply-To: ${payload.replyTo}` : null,
      `Subject: ${encodeSubject(payload.subject)}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "",
      body,
      ".",
    ]
      .filter((line): line is string => line !== null)
      .join("\r\n");

    smtp.socket.write(`${headers}\r\n`);
    await smtp.command("250");
    await smtp.command("221", "QUIT").catch(() => undefined);
  } finally {
    smtp.destroy();
  }
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

export async function sendContactMail(payload: MailPayload) {
  if (resendConfigured()) {
    await sendViaResend(payload);
    return;
  }
  if (smtpConfigured()) {
    await sendViaSmtpDirect(payload);
    return;
  }
  throw new Error(
    "Email is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS (and optionally SMTP_FROM, CONTACT_TO)."
  );
}
