/**
 * POST /api/submit-form — Lead form submission handler
 *
 * Flow (all steps run in parallel):
 *  1. FluentForms  — save submission to WP form on cms.callemily.eu (form ID 1)
 *  2. FluentCRM    — create/update subscriber (tagged "callemily-eu")
 *  3. Telegram     — instant notification to EU sales chat
 *  4. Email notify — lead details to hello@callemily.eu
 *  5. Auto-reply   — branded HTML email to customer (if email provided)
 *
 * SendGrid-compatible relay: 127.0.0.1:8025 on prod server.
 * TG_BOT_TOKEN and TG_CHAT_ID come from .env.
 */
import { NextResponse } from "next/server"

const WP_URL = process.env.CMS_URL || "https://cms.callemily.eu"
const WP_AUTH = Buffer.from(process.env.CMS_AUTH || "").toString("base64")
const FLUENT_FORM_ID = 1

const SENDGRID_API_URL = process.env.SENDGRID_API_URL || "http://127.0.0.1:8025"
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ""
const EMAIL_FROM = "no-reply@callemily.eu"
const EMAIL_FROM_NAME = "CallEmily"
const NOTIFY_EMAILS = (process.env.NOTIFY_EMAILS || "hello@callemily.eu").split(",")

async function submitToFluentForms(data: Record<string, string>) {
  await fetch(`${WP_URL}/wp-json/fluentform/v1/forms/${FLUENT_FORM_ID}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${WP_AUTH}` },
    body: JSON.stringify({ data }),
  }).catch(() => {})
}

async function addToFluentCRM(data: { name: string; phone: string; email?: string; company?: string }) {
  const [firstName, ...rest] = data.name.split(" ")
  const lastName = rest.join(" ")

  await fetch(`${WP_URL}/wp-json/fluent-crm/v2/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${WP_AUTH}` },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName || undefined,
      email: data.email || `${data.phone.replace(/\D/g, "")}@phone.local`,
      phone: data.phone,
      status: "subscribed",
      lists: [1],
      tags: [1, "callemily"],
      custom_values: {
        company: data.company || "",
        source: "callemily.eu",
      },
    }),
  }).catch(() => {})
}

async function sendTelegram(data: { name: string; phone: string; email?: string; company?: string; source?: string }) {
  const tgToken = process.env.TG_BOT_TOKEN
  const tgChat = process.env.TG_CHAT_ID
  if (!tgToken || !tgChat) return

  const lines = [
    `🔔 <b>New demo request — callemily.eu</b>`,
    ``,
    `👤 ${data.name}`,
    `📱 ${data.phone}`,
    data.email ? `📧 ${data.email}` : null,
    data.company ? `🏢 ${data.company}` : null,
    data.source ? `📍 Source: ${data.source}` : null,
  ].filter(Boolean).join("\n")

  await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: tgChat, text: lines, parse_mode: "HTML" }),
  }).catch(() => {})
}

async function sendEmailNotification(data: { name: string; phone: string; email?: string; company?: string }) {
  const date = new Date().toLocaleString("en-GB", { timeZone: "Europe/Lisbon" })
  const subject = `New lead from callemily.eu — ${data.name}`

  const htmlBody = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <h2 style="font-size:18px;margin-bottom:16px;">New lead from callemily.eu:</h2>
  <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
    <tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top;white-space:nowrap;">Name:</td><td style="padding:6px 0;">${data.name}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top;white-space:nowrap;">Phone:</td><td style="padding:6px 0;"><a href="tel:${data.phone}" style="color:#E85D2C;">${data.phone}</a></td></tr>
    ${data.email ? `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top;white-space:nowrap;">Email:</td><td style="padding:6px 0;"><a href="mailto:${data.email}" style="color:#E85D2C;">${data.email}</a></td></tr>` : ""}
    ${data.company ? `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;vertical-align:top;white-space:nowrap;">Company:</td><td style="padding:6px 0;">${data.company}</td></tr>` : ""}
  </table>
  <p style="font-size:13px;color:#666;margin:4px 0;">Date: ${date}</p>
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0;">
  <p style="font-size:12px;color:#999;">Submitted via the form at callemily.eu.</p>
</div>`

  await fetch(`${SENDGRID_API_URL}/v3/mail/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SENDGRID_API_KEY}` },
    body: JSON.stringify({
      personalizations: NOTIFY_EMAILS.map((email) => ({ to: [{ email }] })),
      from: { email: EMAIL_FROM, name: EMAIL_FROM_NAME },
      subject,
      content: [{ type: "text/html", value: htmlBody }],
    }),
  }).catch(() => {})
}

async function sendAutoReply(data: { name: string; email: string }) {
  const firstName = data.name.split(" ")[0]

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank you — CallEmily</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FAF7F2;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">
        <!-- HERO -->
        <tr>
          <td style="background-color:#E85D2C;padding:48px 48px 44px;border-radius:20px 20px 0 0;text-align:center;">
            <div style="width:64px;height:64px;background:rgba(255,255,255,.15);border-radius:50%;margin:0 auto 24px;display:table-cell;text-align:center;vertical-align:middle;">
              <span style="font-size:28px;color:#fff;">✓</span>
            </div>
            <h1 style="margin:0 0 14px;font-size:26px;font-weight:900;line-height:1.2;color:#fff;">Thank you for reaching out!</h1>
            <p style="margin:0;font-size:16px;line-height:1.6;color:rgba(255,255,255,.85);">Your request has been received. We'll be in touch within 15 minutes.</p>
          </td>
        </tr>
        <!-- CONTENT -->
        <tr>
          <td style="background-color:#fff;padding:40px 48px;border-radius:0 0 20px 20px;">
            <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#1A1410;">${firstName ? `Hi ${firstName}!` : "Hello!"}</p>
            <p style="margin:0 0 32px;font-size:16px;line-height:1.7;color:#1A1410;">We've received your request and will call you back on the number you provided shortly.</p>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="background-color:#FAF7F2;border-radius:10px;padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:12px;color:#9B8B7E;">Email</p>
                  <a href="mailto:hello@callemily.eu" style="font-size:15px;font-weight:700;color:#E85D2C;text-decoration:none;">hello@callemily.eu</a>
                </td>
              </tr>
            </table>
            <hr style="border:none;border-top:1px solid #F0EBE3;margin:28px 0 24px;">
            <p style="margin:0 0 4px;font-size:16px;line-height:1.6;color:#1A1410;">Best regards,</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#E85D2C;">CallEmily Team</p>
          </td>
        </tr>
        <!-- FOOTER -->
        <tr>
          <td style="padding:24px 16px 8px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#9B8B7E;">You received this email because you submitted a request at callemily.eu.</p>
            <p style="margin:0;font-size:12px;color:#C4B8A8;">© 2026 CallEmily. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  await fetch(`${SENDGRID_API_URL}/v3/mail/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${SENDGRID_API_KEY}` },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: data.email }] }],
      from: { email: EMAIL_FROM, name: EMAIL_FROM_NAME },
      reply_to: { email: "hello@callemily.eu", name: "CallEmily" },
      subject: "Thank you for your request — CallEmily",
      content: [{ type: "text/html", value: html }],
    }),
  }).catch(() => {})
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, restaurant, company, source } = body

    if (!name) {
      return NextResponse.json({ success: false, message: "Please provide your name" }, { status: 400 })
    }
    if (!phone && !email) {
      return NextResponse.json({ success: false, message: "Please provide a phone number or email" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid email format" }, { status: 400 })
    }

    const companyName = restaurant || company || ""
    const data = { name, phone, email, company: companyName, source: source || "" }

    await Promise.all([
      submitToFluentForms({ name, phone, email: email || "", company: companyName }),
      addToFluentCRM(data),
      sendTelegram(data),
      sendEmailNotification(data),
      email ? sendAutoReply({ name, email }) : Promise.resolve(),
    ])

    return NextResponse.json({ success: true, message: "Your request has been submitted successfully" })
  } catch (error) {
    console.error("Error processing form submission:", error)
    return NextResponse.json({ success: false, message: "An error occurred while submitting your request" }, { status: 500 })
  }
}
