export function wait(time: number): Promise<null> {
  return new Promise((resolve) => setTimeout(() => resolve(null), time))
}

export function timeout(time: number) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), time))
}

/**
 * Returns if this is a valid arweave id (43 base64url characters)
 */
export const isArweaveId = (addr: string) => /^[a-z0-9_-]{43}$/i.test(addr)

/**
 * Returns if this is a valid Ethereum address (0x followed by 40 hex characters)
 */
export const isEthereumAddress = (addr: string) => /^0x[a-f0-9]{40}$/i.test(addr)

/**
 * Returns if this is a valid entity ID (either Arweave ID or Ethereum address)
 * Both can be used as owners/recipients in AO transactions
 */
export const isValidEntityId = (addr: string) => isArweaveId(addr) || isEthereumAddress(addr)

export const isBrowser = typeof window !== "undefined"
export const isStaging = isBrowser && window.location.toString().includes("staging")
export const isDevelopment = isBrowser && window.location.toString().includes("localhost")
