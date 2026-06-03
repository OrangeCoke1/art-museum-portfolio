export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body || {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const to = email.trim();

  if (!process.env.RESEND_API_KEY) {
    console.error("Subscribe API error: RESEND_API_KEY is not set");
    return res.status(503).json({
      error: "Email service is not configured",
      code: "missing_api_key",
    });
  }

  const from =
    process.env.RESEND_FROM || "Gallery Walk <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject: "Your Gallery Walk artwork recommendation",
        html: `
          <div style="font-family: Georgia, serif; color: #1a1a1a; line-height: 1.7;">
            <h1 style="color:#3b5fb9;">Thank you for subscribing to Gallery Walk.</h1>
            <p>This week's artwork recommendation:</p>
            <h2>Wanderer above the Sea of Fog</h2>
            <p><strong>Caspar David Friedrich</strong></p>
            <p>
              A quiet image about distance, atmosphere, and the act of slow looking.
            </p>
            <p style="margin-top:32px;">Gallery Walk</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const payload = await response.json();
        detail =
          payload?.message ||
          payload?.error ||
          (Array.isArray(payload?.errors)
            ? payload.errors.map((item) => item.message).join("; ")
            : "");
      } catch {
        detail = await response.text();
      }

      console.error("Resend error:", detail || response.status);

      return res.status(502).json({
        error: "Failed to send email",
        code: "resend_rejected",
        detail:
          detail ||
          "Resend rejected the request. Verify RESEND_FROM and domain settings.",
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return res.status(500).json({
      error: "Failed to send email",
      code: "server_error",
    });
  }
}
