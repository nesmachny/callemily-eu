import type { CRMAdapter } from "./types"
import { AmoCRMAdapter } from "./adapters/amocrm"
import { getServerEnv } from "@/lib/env-utils"

export function getCRMAdapter(type: string): CRMAdapter {
  switch (type.toLowerCase()) {
    case "amocrm":
      return new AmoCRMAdapter(getServerEnv("AMOCRM_API_URL") || "", getServerEnv("AMOCRM_API_KEY") || "")
    default:
      throw new Error(`Unsupported CRM type: ${type}`)
  }
}
