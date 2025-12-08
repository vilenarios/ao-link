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

/**
 * Converts a hex string to a Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex
  const bytes = new Uint8Array(cleanHex.length / 2)
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16)
  }
  return bytes
}

/**
 * Converts a Uint8Array to base64url string
 */
function bytesToBase64Url(bytes: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...bytes))
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/**
 * Normalizes an Ethereum address to Arweave-compatible format for GraphQL owner queries.
 *
 * When querying GraphQL for transactions by `owners`, Ethereum addresses need to be
 * normalized to a 43-character base64url representation of the sha256 hash of the
 * public key. This is done to prevent errors in systems that expect Arweave-format addresses.
 *
 * Note: For ArNS lookups, use the original Ethereum address (no normalization needed).
 */
export async function normalizeAddressForOwner(addr: string): Promise<string> {
  if (isArweaveId(addr)) {
    return addr
  }

  if (isEthereumAddress(addr)) {
    // Convert Ethereum address to bytes and hash with SHA-256
    const addressBytes = hexToBytes(addr)
    const hashBuffer = await crypto.subtle.digest("SHA-256", addressBytes)
    const hashBytes = new Uint8Array(hashBuffer)
    return bytesToBase64Url(hashBytes)
  }

  return addr
}

export const isBrowser = typeof window !== "undefined"
export const isStaging = isBrowser && window.location.toString().includes("staging")
export const isDevelopment = isBrowser && window.location.toString().includes("localhost")
