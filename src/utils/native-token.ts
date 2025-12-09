import { ARIO_TOKEN_ID } from "@/config/ario"
import { TokenInfo } from "@/services/token-api"

export const nativeTokenInfo: TokenInfo = {
  processId: ARIO_TOKEN_ID,
  denomination: 6,
  ticker: "ARIO",
  logo: "/icon48.png",
  name: "ARIO",
}

/**
 * Returns the full URL for a token logo.
 * If the logo starts with "/" or "http", it's used as-is.
 * Otherwise, it's treated as an Arweave transaction ID.
 */
export function getTokenLogoUrl(logo: string): string {
  if (logo.startsWith("/") || logo.startsWith("http")) {
    return logo
  }
  return `https://arweave.net/${logo}`
}
