import { connect } from "@permaweb/aoconnect/browser"

import { ARIO_TOKEN_ID } from "./config/ario"
import { arIoCu } from "./services/arns-api"

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const tokenCUs: Record<string, any> = {
  [ARIO_TOKEN_ID]: arIoCu,
}

export const defaultCu = connect({
  MODE: "legacy",
})

export function getTokenCu(tokenId: string) {
  return tokenCUs[tokenId] || defaultCu
}
