export async function GET() {
  const content = `# CallEmily
> AI voice assistant for restaurants, clinics and car dealerships — answers calls and books reservations 24/7.

## About
CallEmily is an AI voice assistant that automatically handles inbound calls, takes table reservations, books patient appointments and passes leads to your CRM. Average client saves 40+ minutes of staff time per day and increases call conversion by 20–30%.

## Key Features
- 24/7 call handling — reservations and bookings without human involvement
- Integrations with iiko, R-Keeper, medical information systems (MIS), HubSpot, Salesforce, amoCRM
- Live call transfer with a brief summary of the conversation
- Unlimited parallel calls
- Customisable voice and conversation script for your brand
- Call analytics and performance reports

## Industry Solutions
- **Restaurants & Cafés**: table reservations, pre-orders, event information
- **Clinics & Medical Centres**: appointment booking, visit confirmation, FAQ handling
- **Car Dealerships**: test-drive and service bookings, lead qualification

## Pricing
- **Starter**: from €49/mo — up to 300 calls, 1 voice scenario
- **Business**: from €99/mo — up to 1,000 calls, 3 scenarios, CRM integrations
- **Pro**: from €199/mo — unlimited calls, priority support, custom voice
- All plans include a 14-day free trial, no credit card required

## Contact
- Website: https://callemily.eu
- Email: hello@callemily.eu
- Blog: https://callemily.eu/en/blog

## Technical
- Powered by WiFly technology (established 2009)
- Onboarding time: 1–2 business days
- SLA: 99.9% uptime
- GDPR-compliant data processing
`

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
