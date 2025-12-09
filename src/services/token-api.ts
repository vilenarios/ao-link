import { nativeTokenInfo } from "../utils/native-token"
import { tokenCu } from "@/settings"

export type TokenInfo = {
  processId: string
  denomination: number
  ticker: string
  logo: string
  name: string
}

export type TokenHolder = {
  rank: number
  entityId: string
  balance: number
}

export async function getBalance(entityId: string, tokenV2 = true): Promise<number | null> {
  const result = await tokenCu.dryrun({
    process: nativeTokenInfo.processId,
    data: "",
    tags: [
      { name: "Action", value: "Balance" },
      { name: tokenV2 ? "Recipient" : "Target", value: entityId },
    ],
  })

  try {
    if (result.Messages.length === 0) throw new Error("No response from (get) Balance")
    const message = result.Messages[0]
    const balance = message.Data || message.Tags?.find((tag: any) => tag.name === "Balance")?.value
    const balanceNumber = parseFloat(balance)
    if (isNaN(balanceNumber)) return parseFloat(JSON.parse(balance))
    return balanceNumber
  } catch (err) {
    console.error(err)
    if (tokenV2) return getBalance(entityId, false)
  }

  return null
}

type BalanceMap = {
  [key: string]: string | number
}

export async function getTokenHolders(): Promise<TokenHolder[]> {
  const result = await tokenCu.dryrun({
    process: nativeTokenInfo.processId,
    data: "",
    tags: [{ name: "Action", value: "Balances" }],
  })

  try {
    if (result.Messages.length === 0) throw new Error("No response from (get) Balances")
    const balanceMap = JSON.parse(result.Messages[0].Data) as BalanceMap
    const tokenHolders = Object.keys(balanceMap)
      .filter((entityId) => balanceMap[entityId] !== "0" && balanceMap[entityId] !== 0)
      .sort((a, b) => Number(balanceMap[b]) - Number(balanceMap[a]))
      .map((entityId, index) => ({
        rank: index + 1,
        entityId,
        balance: Number(balanceMap[entityId]) / 10 ** nativeTokenInfo.denomination,
      }))

    return tokenHolders
  } catch (err) {
    console.error(err)
  }

  return []
}
