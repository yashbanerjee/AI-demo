import nodemailer from "nodemailer";

const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const;

function env(key: string, fallback = ""): string {
  return String(
    process.env[key] ??
      (import.meta.env as Record<string, string | undefined>)[key] ??
      fallback
  );
}

export function smtpConfigured(): boolean {
  return required.every((key) => Boolean(env(key)));
}

function createTransport() {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT", "587"));
  const secure =
    env("SMTP_SECURE", "false") === "true" || port === 465;
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
  });
}

export type MailPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendContactMail(payload: MailPayload) {
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
