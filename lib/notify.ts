type QuestionNotifyPayload = {
  name: string;
  email: string;
  question: string;
};

/**
 * Optional email alert when a question is submitted.
 * Set RESEND_API_KEY + NOTIFY_EMAIL in the environment to enable.
 */
export async function notifyNewQuestion(
  payload: QuestionNotifyPayload,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from =
    process.env.NOTIFY_FROM_EMAIL || "Naveed Alam Site <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return;
  }

  const subject = `New question from ${payload.name}`;
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    "",
    payload.question,
  ].join("\n");

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject,
        text,
      }),
    });
  } catch {
    // Question is already saved — do not fail the request on notify errors.
  }
}
