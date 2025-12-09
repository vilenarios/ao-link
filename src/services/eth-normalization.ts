import { gql } from "urql"

import { goldsky } from "./graphql-client"
import { isEthereumAddress } from "@/utils/utils"

/**
 * ETH Address Normalization Service
 *
 * When an ETH user interacts with AO, their ETH address (0x...) gets normalized
 * to an Arweave-style address derived from their public key. GraphQL queries
 * using `recipients:` filter need this normalized address, not the original ETH address.
 *
 * Discovery process:
 * 1. Find any Credit-Notice with Sender tag = ETH address
 * 2. Get the Pushed-For ID from that notice
 * 3. Query that transaction to get owner.address (the normalized key)
 */

// Cache for normalized addresses: ETH address -> normalized Arweave address
const normalizedAddressCache = new Map<string, string>()

// Cache for failed lookups to avoid repeated queries
const failedLookupCache = new Set<string>()

// Query to find a Credit-Notice where the ETH address is the Sender (they sent tokens)
// Try both original case and lowercase
const creditNoticeBySenderQuery = gql`
  query ($ethAddress: String!, $ethAddressLower: String!) {
    transactions(
      first: 1
      tags: [
        { name: "Action", values: ["Credit-Notice"] }
        { name: "Sender", values: [$ethAddress, $ethAddressLower] }
        { name: "Data-Protocol", values: ["ao"] }
      ]
    ) {
      edges {
        node {
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`

// Query to find a Debit-Notice where the ETH address is the Recipient (they received tokens)
// When someone sends tokens TO an ETH user, the sender gets a Debit-Notice with Recipient tag = ETH address
// Try both original case and lowercase
const debitNoticeByRecipientQuery = gql`
  query ($ethAddress: String!, $ethAddressLower: String!) {
    transactions(
      first: 1
      tags: [
        { name: "Action", values: ["Debit-Notice"] }
        { name: "Recipient", values: [$ethAddress, $ethAddressLower] }
        { name: "Data-Protocol", values: ["ao"] }
      ]
    ) {
      edges {
        node {
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`

// Query to get transaction details including owner address
const transactionOwnerQuery = gql`
  query ($id: ID!) {
    transactions(ids: [$id]) {
      edges {
        node {
          id
          owner {
            address
          }
        }
      }
    }
  }
`

// Query to find a Credit-Notice that was Pushed-For a specific Transfer
// The Credit-Notice's recipient field will be the normalized ETH address
const creditNoticeForTransferQuery = gql`
  query ($transferId: String!) {
    transactions(
      first: 1
      tags: [
        { name: "Action", values: ["Credit-Notice"] }
        { name: "Pushed-For", values: [$transferId] }
        { name: "Data-Protocol", values: ["ao"] }
      ]
    ) {
      edges {
        node {
          id
          recipient
          tags {
            name
            value
          }
        }
      }
    }
  }
`

interface TransactionEdge {
  node: {
    id: string
    recipient?: string
    tags: { name: string; value: string }[]
    owner?: { address: string }
  }
}

interface TransactionsResponse {
  transactions: {
    edges: TransactionEdge[]
  }
}

/**
 * Resolves an ETH address to its normalized Arweave address.
 * Returns the original address if:
 * - It's not an ETH address
 * - No transactions found for the ETH address
 * - Lookup fails
 *
 * Results are cached to avoid repeated lookups.
 */
export async function resolveEthToNormalizedAddress(address: string): Promise<string> {
  // Not an ETH address, return as-is
  if (!isEthereumAddress(address)) {
    return address
  }

  // Normalize to lowercase for consistent cache keys
  const ethAddressLower = address.toLowerCase()

  // Check cache first
  if (normalizedAddressCache.has(ethAddressLower)) {
    return normalizedAddressCache.get(ethAddressLower)!
  }

  // Check if we've already failed to find this address
  if (failedLookupCache.has(ethAddressLower)) {
    console.log(`[ETH Normalization] Address in failed cache, returning original`)
    return address
  }

  try {
    console.log(`[ETH Normalization] Looking up normalized address for: ${address}`)

    let normalizedAddress: string | null = null

    // Strategy 1: Find a Credit-Notice where this ETH address is the Sender
    // (meaning the ETH user SENT tokens to someone)
    // The Pushed-For points to the original Transfer, whose owner.address is the ETH user's normalized address
    const creditResult = await goldsky
      .query<TransactionsResponse>(creditNoticeBySenderQuery, {
        ethAddress: address,
        ethAddressLower: ethAddressLower,
      })
      .toPromise()

    const creditEdges = creditResult.data?.transactions?.edges ?? []
    console.log(`[ETH Normalization] Credit-Notice (Sender) query: ${creditEdges.length} results`)

    if (creditResult.data?.transactions.edges.length) {
      const tags = creditResult.data.transactions.edges[0].node.tags
      const pushedForTag = tags.find((t) => t.name === "Pushed-For")
      const pushedForId = pushedForTag?.value

      if (pushedForId) {
        console.log(`[ETH Normalization] Found Pushed-For from Credit-Notice:`, pushedForId)

        // Get the owner of the original Transfer - this is the ETH user's normalized address
        const ownerResult = await goldsky
          .query<TransactionsResponse>(transactionOwnerQuery, {
            id: pushedForId,
          })
          .toPromise()

        if (ownerResult.data?.transactions.edges.length) {
          normalizedAddress = ownerResult.data.transactions.edges[0].node.owner?.address || null
          console.log(`[ETH Normalization] Got owner from Transfer:`, normalizedAddress)
        }
      }
    }

    // Strategy 2: Find a Debit-Notice where this ETH address is the Recipient
    // (meaning someone SENT tokens TO the ETH user)
    // The Pushed-For points to the original Transfer, then find the Credit-Notice for that Transfer
    // The Credit-Notice's recipient field is the ETH user's normalized address
    if (!normalizedAddress) {
      const debitResult = await goldsky
        .query<TransactionsResponse>(debitNoticeByRecipientQuery, {
          ethAddress: address,
          ethAddressLower: ethAddressLower,
        })
        .toPromise()

      const debitEdges = debitResult.data?.transactions?.edges ?? []
      console.log(
        `[ETH Normalization] Debit-Notice (Recipient) query: ${debitEdges.length} results`,
      )

      if (debitResult.data?.transactions.edges.length) {
        const tags = debitResult.data.transactions.edges[0].node.tags
        const pushedForTag = tags.find((t) => t.name === "Pushed-For")
        const pushedForId = pushedForTag?.value

        if (pushedForId) {
          console.log(`[ETH Normalization] Found Pushed-For from Debit-Notice:`, pushedForId)

          // Find the Credit-Notice that was triggered by the same Transfer
          // The Credit-Notice's recipient is the ETH user's normalized address
          const creditNoticeResult = await goldsky
            .query<TransactionsResponse>(creditNoticeForTransferQuery, {
              transferId: pushedForId,
            })
            .toPromise()

          console.log(
            `[ETH Normalization] Credit-Notice for Transfer query:`,
            creditNoticeResult.data?.transactions.edges.length ?? 0,
            "results",
          )

          if (creditNoticeResult.data?.transactions.edges.length) {
            normalizedAddress = creditNoticeResult.data.transactions.edges[0].node.recipient || null
            console.log(`[ETH Normalization] Got recipient from Credit-Notice:`, normalizedAddress)
          }
        }
      }
    }

    if (!normalizedAddress) {
      console.log(`[ETH Normalization] Could not resolve, returning original address`)
      failedLookupCache.add(ethAddressLower)
      return address
    }

    console.log(`[ETH Normalization] Resolved ${address} -> ${normalizedAddress}`)

    // Cache the result (both cases for case-insensitive lookup)
    normalizedAddressCache.set(ethAddressLower, normalizedAddress)
    normalizedAddressCache.set(address, normalizedAddress)

    return normalizedAddress
  } catch (error) {
    console.error("Failed to resolve ETH address to normalized address:", error)
    failedLookupCache.add(ethAddressLower)
    return address
  }
}
