import type { APIRoute } from "astro";
import { sendContactMail, smtpConfigured } from "../../lib/mail";

type Body = {
  type?: string;
  name?: string;
  email?: string;
  service?: string;
  category?: string;
  description?: string;
  message?: string;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const POST: APIRoute = async ({ request }) => {
  if (!smtpConfigured()) {
    return json(
      { error: "Email is not configured yet. Add SMTP settings to the environment." },
      503
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const type = String(body.type || "").trim();
  const email = String(body.email || "").trim();
  const name = String(body.name || "").trim();
  const service = String(body.service || "").trim();
  const category = String(body.category || "").trim();
  const description = String(body.description || body.message || "").trim();

  if (!email || !isEmail(email)) {
    return json({ error: "A valid email is required." }, 400);
  }

  let subject = "";
  let text = "";

  if (type === "newsletter") {
    subject = `Newsletter signup — ${email}`;
    text = [
      "New newsletter subscription from the Vedha website.",
      "",
      `Email: ${email}`,
      `Source: website form`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n");
  } else if (type === "service-enquiry") {
    if (!name || !description) {
      return json({ error: "Name and message are required." }, 400);
    }
    subject = `Service enquiry — ${service || "General"}${category ? ` (${category})` : ""}`;
    text = [
      "New service enquiry from the Vedha website.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Category: ${category || "—"}`,
      `Service: ${service || "—"}`,
      "",
      "Message:",
      description,
      "",
      `Time: ${new Date().toISOString()}`,
    ].join("\n");
  } else if (type === "enquiry") {
    if (!name || !description) {
      return json({ error: "Name and description are required." }, 400);
    }
    subject = `Contact enquiry — ${service || "General"}`;
    text = [
      "New contact enquiry from the Vedha website.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Service type: ${service || "—"}`,
      "",
      "Description:",
      description,
      "",
      `Time: ${new Date().toISOString()}`,
    ].join("\n");
  } else {
    return json({ error: "Unknown form type." }, 400);
  }

  try {
    await sendContactMail({
      subject: `[VEDHA] ${subject}`,
      text,
      replyTo: email,
    });
    return json({ ok: true });
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return json({ error: "Unable to send email right now. Please try again later." }, 502);
  }
};
