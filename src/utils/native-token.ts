import { ARIO_TOKEN_ID } from "@/config/ario"
import { TokenInfo } from "@/services/token-api"

export const nativeTokenInfo: TokenInfo = {
  processId: ARIO_TOKEN_ID,
  denomination: 6,
  ticker: "ARIO",
  logo: "HxPogiCr43uxn4vKy4-SuSjVJpQi1i5YRvws6ucOGL4",
  name: "ARIO",
}

export const tokenMirrors: Record<string, string> = {}
