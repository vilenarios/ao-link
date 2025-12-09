import { dryrun } from "@permaweb/aoconnect"
import { gql } from "urql"

import { AoMessage, ArweaveBlock, BlockEdge, TokenTransferMessage, TransactionEdge } from "../types"

export const messageFields = gql`
  fragment MessageFields on TransactionConnection {
    edges {
      cursor
      node {
        id
        ingested_at
        recipient
        block {
          timestamp
          height
        }
        tags {
          name
          value
        }
        data {
          size
        }
        owner {
          address
        }
      }
    }
  }
`

export const systemTagNames = [
  "Type",
  "Data-Protocol",
  "SDK",
  "Content-Type",
  "Variant",
  "Pushed-For",
  "Ref_",
  "Reference",
  "From-Module",
  "From-Process",
  "Module",
  "Scheduler",
  "aos-Version",
  "App-Name",
  "Scheduler",
  "Name",
]

export function parseAoMessage(edge: TransactionEdge): AoMessage {
  const { node, cursor } = edge

  const systemTags: Record<string, string> = {}
  const userTags: Record<string, string> = {}
  const tags: Record<string, string> = {}

  node.tags.forEach((tag) => {
    tags[tag.name] = tag.value

    if (systemTagNames.includes(tag.name)) {
      systemTags[tag.name] = tag.value
    } else {
      userTags[tag.name] = tag.value
    }
  })

  // delete systemTags["Pushed-For"]
  // delete systemTags["Data-Protocol"]
  delete systemTags["Type"]
  delete systemTags["Module"]
  delete systemTags["Name"]

  const type = tags["Type"] as AoMessage["type"]
  const blockHeight = node.block ? node.block.height : null
  const from = tags["Forwarded-For"] || tags["From-Process"] || node.owner.address
  const schedulerId = tags["Scheduler"]
  const action = tags["Action"]
  const blockTimestamp = node.block ? new Date(node.block.timestamp * 1000) : null
  const ingestedAt = new Date(node.ingested_at * 1000)
  const to = node.recipient.trim()

  if (type === "Message" && tags["Name"]) {
    userTags["Name"] = tags["Name"]
  }

  return {
    id: node.id,
    type,
    from,
    to,
    blockHeight,
    schedulerId,
    blockTimestamp,
    ingestedAt,
    action,
    tags,
    systemTags,
    userTags,
    cursor,
    dataSize: node.data?.size,
  }
}

/**
 * Safely parse a quantity string to a number.
 * Returns 0 if the value is missing or invalid.
 */
function parseQuantity(value: string | undefined): number {
  if (value === undefined || value === null || value === "") {
    console.warn("[parseTokenEvent] Missing Quantity tag")
    return 0
  }
  const num = Number(value)
  if (isNaN(num)) {
    console.warn(`[parseTokenEvent] Invalid Quantity: ${value}`)
    return 0
  }
  return num
}

export function parseTokenEvent(edge: TransactionEdge): TokenTransferMessage {
  const aoMessage = parseAoMessage(edge)

  const { id, ingestedAt, action, from, to, tags } = aoMessage

  let sender: string = ""
  let recipient: string = ""
  let tokenId: string = ""
  let amount = 0

  const quantity = parseQuantity(tags["Quantity"])

  if (action === "Debit-Notice") {
    amount = -quantity
    sender = to
    recipient = tags["Recipient"] ?? ""
    tokenId = from
  } else if (action === "Credit-Notice") {
    amount = quantity
    sender = tags["Sender"] ?? ""
    recipient = to
    tokenId = from
  } else if (action === "Transfer") {
    amount = -quantity
    sender = from
    recipient = tags["Recipient"] ?? ""
    tokenId = to
  } else {
    // Return safe default instead of throwing to avoid breaking entire list
    console.warn(`[parseTokenEvent] Unknown action: ${action}`)
    return {
      id,
      type: "Message",
      cursor: edge.cursor,
      ingestedAt,
      action,
      sender: "",
      recipient: "",
      amount: 0,
      tokenId: "",
    }
  }

  return {
    id,
    type: "Message",
    cursor: edge.cursor,
    ingestedAt,
    action,
    sender,
    recipient,
    amount,
    tokenId,
  }
}

export function parseArweaveBlock(edge: BlockEdge): ArweaveBlock {
  const { node, cursor } = edge

  const timestamp = node.timestamp ? new Date(node.timestamp * 1000) : null

  return {
    cursor,
    id: node.id,
    timestamp,
    height: node.height,
    previous: node.previous,
  }
}

export type DryRunResult = Awaited<ReturnType<typeof dryrun>>

/**
 * Returned message object(s) from dryRun
 */
export interface Message {
  Anchor: string
  Tags: Tag[]
  Target: string
  Data: string
}

export type Tag = {
  name: string
  value: string
}

export type CuMessage = {
  systemTags: Record<string, string>
  userTags: Record<string, string>
  tags: Record<string, string>
}

export function parseAoMessageFromCU(message: Message): CuMessage {
  const systemTags: Record<string, string> = {}
  const userTags: Record<string, string> = {}
  const tags: Record<string, string> = {}

  message.Tags.forEach((tag) => {
    tags[tag.name] = tag.value

    if (systemTagNames.includes(tag.name)) {
      systemTags[tag.name] = tag.value
    } else {
      userTags[tag.name] = tag.value
    }
  })

  // delete systemTags["Pushed-For"]
  // delete systemTags["Data-Protocol"]
  delete systemTags["Type"]
  delete systemTags["Module"]
  delete systemTags["Name"]

  return {
    // to: message.Target,
    // action: tags["Action"],
    systemTags,
    userTags,
    tags,
  }
}
