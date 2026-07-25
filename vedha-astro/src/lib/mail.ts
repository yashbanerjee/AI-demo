import nodemailer from "nodemailer";

const requiredSmtp = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;

/** Runtime env only — Vite inlines import.meta.env at build time and strips custom keys. */
function env(key: string, fallback = ""): string {
  return String(process.env[key] ?? fallback).trim();
}

export function smtpConfigured(): boolean {
  return requiredSmtp.every((key) => Boolean(env(key)));
}

export function resendConfigured(): boolean {
  return Boolean(env("RESEND_API_KEY"));
}

export function mailConfigured(): boolean {
  return smtpConfigured() || resendConfigured();
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
    // Keep well under Railway/Cloudflare edge timeouts so the API can return JSON.
    connectionTimeout: 4_000,
    greetingTimeout: 4_000,
    socketTimeout: 8_000,
    tls: {
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
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend failed (${res.status}): ${detail.slice(0, 300)}`);
  }
}

async function sendViaSmtp(payload: MailPayload) {
  const to = env("CONTACT_TO", "info@vedha.ae");
  const from = env("SMTP_FROM", env("SMTP_USER"));
  const transport = createTransport();

  await transport.sendMail({
    from,
    to,
    replyTo: payload.replyTo || undefined,
    subject: payload.subject,
    text: payload.text,
  });
}

export async function sendContactMail(payload: MailPayload) {
  // Prefer Resend (HTTP) when available — outbound SMTP is often blocked on PaaS hosts.
  if (resendConfigured()) {
    await sendViaResend(payload);
    return;
  }
  if (smtpConfigured()) {
    await sendViaSmtp(payload);
    return;
  }
  throw new Error(
    "Email is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS."
  );
}
