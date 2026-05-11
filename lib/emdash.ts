// EmDash headless CMS client
// Deploy EmDash (https://github.com/emdash-cms) and set EMDASH_URL + EMDASH_API_TOKEN to activate.
// When EMDASH_URL is not set, cms === null and all pages fall back to hardcoded content.
import { EmDashClient } from "emdash/client"

export const EMDASH_URL = process.env.EMDASH_URL
export const EMDASH_ENABLED = !!EMDASH_URL

export const cms = EMDASH_URL
  ? new EmDashClient({
      baseUrl: EMDASH_URL,
      token: process.env.EMDASH_API_TOKEN ?? "",
    })
  : null
