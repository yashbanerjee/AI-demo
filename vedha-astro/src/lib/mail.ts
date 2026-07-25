import nodemailer from "nodemailer";

const requiredSmtp = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;

/** Runtime env only — Vite inlines import.meta.env at build time and strips custom keys. */
function env(key: string, fallback = ""): string {
  return String(process.env[key] ?? fallback).trim();
}

function onRailway(): boolean {
  return Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID);
}

/** SMTP hangs on Railway Hobby (ports blocked). Opt in with ALLOW_SMTP=true on Pro. */
function smtpAllowed(): boolean {
  if (env("ALLOW_SMTP").toLowerCase() === "true") return true;
  if (env("ALLOW_SMTP").toLowerCase() === "false") return false;
  return !onRailway();
}

export function smtpConfigured(): boolean {
  return requiredSmtp.every((key) => Boolean(env(key)));
}

export function resendConfigured(): boolean {
  return Boolean(env("RESEND_API_KEY"));
}

export function mailConfigured(): boolean {
  return resendConfigured() || (smtpAllowed() && smtpConfigured());
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
  if (resendConfigured()) {
    await sendViaResend(payload);
    return;
  }
  if (smtpAllowed() && smtpConfigured()) {
    await sendViaSmtp(payload);
    return;
  }
  if (onRailway() && smtpConfigured() && !resendConfigured()) {
    throw new Error(
      "Railway blocks outbound SMTP on Hobby. Set RESEND_API_KEY, or set ALLOW_SMTP=true on a Pro plan."
    );
  }
  throw new Error(
    "Email is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS."
  );
}
