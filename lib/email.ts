// Cloudflare Email Sending (Beta) — POST /accounts/{id}/email/sending/send
// DNS (SPF/DKIM/DMARC) is managed by Cloudflare on the callemily.eu domain.
// Quota: 200/day on beta.
//
// Returns success: true even when arrays are empty — that's the documented
// async-queue behaviour. Failures throw or come back with success: false.

const CF_ACCOUNT_ID = process.env.CF_ACCOUNT_ID
const CF_EMAIL_TOKEN = process.env.CF_EMAIL_TOKEN

export interface SendEmailInput {
  from: string
  to: string
  subject: string
  html: string
  text?: string
}

export interface SendEmailResult {
  ok: boolean
  to: string
  error?: string
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (!CF_ACCOUNT_ID || !CF_EMAIL_TOKEN) {
    return { ok: false, to: input.to, error: "CF_ACCOUNT_ID or CF_EMAIL_TOKEN not set" }
  }
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/email/sending/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_EMAIL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: input.from,
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text ?? stripHtml(input.html),
        }),
      }
    )
    const json = await res.json() as { success: boolean; errors?: { message: string }[] }
    if (!json.success) {
      return { ok: false, to: input.to, error: json.errors?.[0]?.message ?? "send failed" }
    }
    return { ok: true, to: input.to }
  } catch (err) {
    return { ok: false, to: input.to, error: err instanceof Error ? err.message : String(err) }
  }
}

function stripHtml(html: string): string {
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}
