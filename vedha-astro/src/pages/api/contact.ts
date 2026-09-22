import type { APIRoute } from "astro";
import { createContact } from "../../lib/db";
import {
  buildUserConfirmation,
  mailConfigured,
  mailDiagnostics,
  probeSmtpPort,
  sendContactMail,
} from "../../lib/mail";

export const prerender = false;

type Body = {
  type?: string;
  name?: string;
  email?: string;
  contact?: string;
  phone?: string;
  service?: string;
  category?: string;
  description?: string;
  message?: string;
  budget?: string;
  base?: string;
  addons?: string;
  totalAed?: string | number;
  notes?: string;
  deliveryEstimate?: string;
  deliveryPreference?: string;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidMobile = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

/** Safe status + SMTP shape (no secrets) for debugging deploys. */
export const GET: APIRoute = async () => {
  const diagnostics = mailDiagnostics();
  const probe = diagnostics.smtpConfigured
    ? await probeSmtpPort(4_000)
    : { reachable: false, error: "smtp not configured", ms: 0 };
  return json({ ok: true, ...diagnostics, smtpProbe: probe });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    let body: Body;
    try {
      body = (await request.json()) as Body;
    } catch {
      return json({ error: "Invalid request body." }, 400);
    }

    const type = String(body.type || "").trim();
    const name = String(body.name || "").trim();
    const service = String(body.service || "").trim();
    const category = String(body.category || "").trim();
    const description = String(body.description || body.message || "").trim();
    const budget = String(body.budget || "").trim();
    const base = String(body.base || "").trim();
    const addons = String(body.addons || "").trim();
    const totalAedRaw = body.totalAed;
    const totalAed =
      typeof totalAedRaw === "number"
        ? totalAedRaw
        : Number(String(totalAedRaw || "").replace(/[^\d.]/g, "")) || 0;
    const notes = String(body.notes || "").trim();
    const deliveryEstimate = String(body.deliveryEstimate || "").trim();
    const deliveryPreference = String(body.deliveryPreference || "").trim();
    const contactRaw = String(body.contact || "").trim();
    const phoneRaw = String(body.phone || "").trim();

    let email = String(body.email || "").trim();
    let phone = phoneRaw;

    if (contactRaw) {
      if (isEmail(contactRaw)) {
        email = contactRaw;
      } else {
        phone = contactRaw;
      }
    }

    const hasEmail = Boolean(email && isEmail(email));
    const hasPhone = Boolean(phone && isValidMobile(phone));

    if (type === "newsletter") {
      if (!hasEmail) {
        return json({ error: "A valid email is required." }, 400);
      }
    } else if (type === "lp-enquiry") {
      if (!hasEmail && !hasPhone) {
        return json({ error: "Email or mobile number is required." }, 400);
      }
      if (email && !hasEmail) {
        return json({ error: "Please enter a valid email address." }, 400);
      }
    } else if (!hasEmail) {
      return json({ error: "A valid email is required." }, 400);
    }

    const requiresMobile =
      type === "enquiry" || type === "service-enquiry" || type === "cost-estimate";
    if (requiresMobile && !hasPhone) {
      return json({ error: "Mobile number is required." }, 400);
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
        `Mobile: ${phone}`,
        `Category: ${category || "—"}`,
        `Service: ${service || "—"}`,
        "",
        "Message:",
        description,
        "",
        `Time: ${new Date().toISOString()}`,
      ].join("\n");
    } else if (type === "lp-enquiry") {
      if (!name || !description) {
        return json({ error: "Name and what you need are required." }, 400);
      }
      subject = `LP enquiry — Web Development Dubai`;
      text = [
        "New landing-page enquiry (Web Development Dubai).",
        "",
        `Name: ${name}`,
        `Email: ${hasEmail ? email : "—"}`,
        `Mobile / WhatsApp: ${hasPhone ? phone : "—"}`,
        `Service: ${service || "web-development"}`,
        `Budget: ${budget || "—"}`,
        "",
        "What they need:",
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
        `Mobile: ${phone}`,
        `Service type: ${service || "—"}`,
        "",
        "Description:",
        description,
        "",
        `Time: ${new Date().toISOString()}`,
      ].join("\n");
    } else if (type === "cost-estimate") {
      if (!name) {
        return json({ error: "Name is required." }, 400);
      }
      if (!base) {
        return json({ error: "Please select a base package before sending." }, 400);
      }
      const totalLabel = `AED ${Math.round(totalAed).toLocaleString("en-AE")}`;
      subject = `Cost estimate — ${base} — ${totalLabel}`;
      text = [
        "New cost estimator submission from the Vedha website.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Mobile: ${phone}`,
        `Base: ${base}`,
        `Modules: ${addons || "none"}`,
        `Total: ${totalLabel}`,
        `Estimated delivery: ${deliveryEstimate || "—"}`,
        `Preferred timing: ${deliveryPreference || "—"}`,
        "",
        "Breakdown:",
        description || "—",
        "",
        notes ? `Extra notes:\n${notes}` : "",
        `Time: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join("\n");
    } else {
      return json({ error: "Unknown form type." }, 400);
    }

    const savedPhone = hasPhone ? phone : phoneRaw;
    const savedEmail = hasEmail ? email : "";

    // Persist every enquiry / contact / newsletter / estimate into `contacts`.
    let submissionId: number;
    try {
      submissionId = await createContact({
        type,
        name,
        email: savedEmail,
        phone: savedPhone,
        service,
        category,
        description,
        budget,
        base,
        addons,
        totalAed: type === "cost-estimate" ? Math.round(totalAed) : null,
        notes,
        deliveryEstimate,
        deliveryPreference,
        payload: {
          type,
          name,
          email: savedEmail,
          phone: savedPhone,
          service,
          category,
          description,
          budget,
          base,
          addons,
          totalAed: type === "cost-estimate" ? Math.round(totalAed) : undefined,
          notes,
          deliveryEstimate,
          deliveryPreference,
        },
      });
    } catch (dbError) {
      console.error("Failed to save form submission:", dbError);
      const detail = dbError instanceof Error ? dbError.message : "Unknown database error";
      return json(
        {
          error: "Unable to save your enquiry right now. Please try again later.",
          detail: detail.slice(0, 500),
        },
        500
      );
    }

    const confirmationEmail = savedEmail;
    const confirmation = confirmationEmail
      ? buildUserConfirmation({ type, name, email: confirmationEmail })
      : {
          subject: "",
          text: "",
          message:
            "Thank you. We have received your request and will contact you on WhatsApp within one business day.",
        };

    // Email is best-effort after DB save — never lose the lead if SMTP fails.
    let mailSent = false;
    if (mailConfigured()) {
      try {
        await sendContactMail({
          subject: `[VEDHA] ${subject}`,
          text,
          replyTo: hasEmail ? email : undefined,
        });
        mailSent = true;

        if (confirmationEmail) {
          try {
            await sendContactMail({
              to: confirmationEmail,
              subject: confirmation.subject,
              text: confirmation.text,
              replyTo: "info@vedha.ae",
            });
          } catch (confirmError) {
            console.error("Failed to send user confirmation email:", confirmError);
          }
        }
      } catch (mailError) {
        console.error("Failed to send contact email (submission saved):", mailError, {
          submissionId,
          type,
        });
      }
    } else {
      console.warn("SMTP not configured — enquiry saved to database only.", {
        submissionId,
        type,
      });
    }

    return json({
      ok: true,
      message: confirmation.message,
      saved: true,
      id: submissionId,
      mailSent,
    });
  } catch (error) {
    console.error("Contact form handler failed:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    return json(
      {
        error: "Unable to process your enquiry right now. Please try again later.",
        detail: detail.slice(0, 500),
      },
      400
    );
  }
};
