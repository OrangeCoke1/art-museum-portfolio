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
    return res.status(500).json({ error: "Failed to send email" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Gallery Walk <onboarding@resend.dev>",
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
      const errorText = await response.text();
      console.error("Resend error:", errorText);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
