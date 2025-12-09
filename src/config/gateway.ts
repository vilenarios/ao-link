export const GATEWAY_GRAPHQL = "https://ao-search-gateway.goldsky.com/graphql"

// Base64url alphabet and Base32 alphabet for sandbox subdomain conversion
const B64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
const B32_ALPHABET = "abcdefghijklmnopqrstuvwxyz234567"

/**
 * Convert a base64url string to a Uint8Array
 */
function fromB64Url(b64url: string): Uint8Array {
  const padding = (4 - (b64url.length % 4)) % 4
  const b64 = b64url + "=".repeat(padding)
  const bytes: number[] = []

  for (let i = 0; i < b64.length; i += 4) {
    const c1 = B64_ALPHABET.indexOf(b64[i])
    const c2 = B64_ALPHABET.indexOf(b64[i + 1])
    const c3 = b64[i + 2] === "=" ? 0 : B64_ALPHABET.indexOf(b64[i + 2])
    const c4 = b64[i + 3] === "=" ? 0 : B64_ALPHABET.indexOf(b64[i + 3])

    bytes.push((c1 << 2) | (c2 >> 4))
    if (b64[i + 2] !== "=") bytes.push(((c2 & 15) << 4) | (c3 >> 2))
    if (b64[i + 3] !== "=") bytes.push(((c3 & 3) << 6) | c4)
  }

  return new Uint8Array(bytes)
}

/**
 * Convert a Uint8Array to a base32 string (lowercase, no padding)
 */
function toB32(bytes: Uint8Array): string {
  let result = ""
  let bits = 0
  let value = 0

  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8

    while (bits >= 5) {
      result += B32_ALPHABET[(value >> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    result += B32_ALPHABET[(value << (5 - bits)) & 31]
  }

  return result
}

/**
 * Convert an Arweave transaction ID to its sandbox subdomain format
 * Example: "5CXiXTTcYsvmzGZKz_bHgi_v3propbsj18xM6tEk1zU" -> "4qs6exju3rrmxzwmmzfm75whqix67xu25cs3wi6xzrgovuje242q"
 */
export function txIdToSandboxSubdomain(txId: string): string {
  return toB32(fromB64Url(txId))
}

/**
 * Detect the current gateway based on window.location
 * Returns the gateway domain to use for data fetching
 */
function detectGateway(): string {
  if (typeof window === "undefined") {
    return "ar.io" // Default for SSR
  }

  const hostname = window.location.hostname

  // If running locally, use ar.io
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "ar.io"
  }

  // Extract the gateway from the current hostname
  // e.g., scan.ar.io -> ar.io, scan.arweave.net -> arweave.net
  const parts = hostname.split(".")
  if (parts.length >= 2) {
    // Take the last two parts (e.g., "ar.io" or "arweave.net")
    return parts.slice(-2).join(".")
  }

  // Fallback to ar.io
  return "ar.io"
}

// The detected gateway domain
export const GATEWAY_DOMAIN = detectGateway()

// Legacy export for backward compatibility (without sandbox)
export const GATEWAY_DATA = `https://${GATEWAY_DOMAIN}`

/**
 * Get the URL for fetching transaction data using sandbox subdomain
 * Format: https://{sandboxSubdomain}.{gateway}/{txId}
 * This is faster than using the path-based approach
 */
export function getTxDataUrl(txId: string): string {
  const subdomain = txIdToSandboxSubdomain(txId)
  return `https://${subdomain}.${GATEWAY_DOMAIN}/${txId}`
}

/**
 * Get the URL for fetching any Arweave resource by path
 * Use this for non-transaction resources or when sandbox isn't needed
 */
export function getGatewayUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${GATEWAY_DATA}/${cleanPath}`
}
