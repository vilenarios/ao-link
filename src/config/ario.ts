// AR.IO Network Process and Module IDs
export const ARIO_PROCESS_ID = "qNvAoz0TgcH7DMg8BCVn8jF32QH5L6T29VjHxhHqqGE"
export const ARIO_MODULE_ID = "CWxzoe4IoNpFHiykadZWphZtLWybDF8ocNi7gmK6zCg"
export const ARIO_ANT_REGISTRY = "i_le_yKKPVstLTDSmkHRqf-wYphMnwB9OhleiTgMkWc"

// AR.IO Token (same as process ID for AO tokens)
export const ARIO_TOKEN_ID = ARIO_PROCESS_ID

// AR.IO Network Actions (from ar-io-network-process smart contract)
export const ARIO_ACTIONS = [
  // Reads
  "Info",
  "Total-Supply",
  "Total-Token-Supply",
  "Transfer",
  "Balance",
  "Balances",
  "Demand-Factor",
  "Demand-Factor-Info",
  "Demand-Factor-Settings",
  // Epoch Read APIs
  "Epoch",
  "Epoch-Settings",
  "Epoch-Prescribed-Observers",
  "Epoch-Prescribed-Names",
  "Epoch-Observations",
  "Epoch-Distributions",
  "Epoch-Eligible-Rewards",
  // Vaults
  "Vault",
  "Vaults",
  "Create-Vault",
  "Vaulted-Transfer",
  "Extend-Vault",
  "Increase-Vault",
  "Revoke-Vault",
  // Gateway Registry Read APIs
  "Gateway",
  "Gateways",
  "Gateway-Registry-Settings",
  "Delegates",
  "Join-Network",
  "Leave-Network",
  "Increase-Operator-Stake",
  "Decrease-Operator-Stake",
  "Update-Gateway-Settings",
  "Save-Observations",
  "Delegate-Stake",
  "Redelegate-Stake",
  "Decrease-Delegate-Stake",
  "Cancel-Withdrawal",
  "Instant-Withdrawal",
  "Redelegation-Fee",
  "All-Paginated-Delegates",
  "All-Gateway-Vaults",
  // ArNS
  "Record",
  "Records",
  "Buy-Name",
  "Upgrade-Name",
  "Extend-Lease",
  "Increase-Undername-Limit",
  "Reassign-Name",
  "Release-Name",
  "Reserved-Names",
  "Reserved-Name",
  "Token-Cost",
  "Cost-Details",
  "Registration-Fees",
  "Returned-Names",
  "Returned-Name",
  "Allow-Delegates",
  "Disallow-Delegates",
  "Delegations",
  // Primary Names
  "Remove-Primary-Names",
  "Request-Primary-Name",
  "Primary-Name-Request",
  "Primary-Name-Requests",
  "Approve-Primary-Name-Request",
  "Primary-Names",
  "Primary-Name",
  // Hyperbeam Patch Balances
  "Patch-Hyperbeam-Balances",
] as const

export type ArioAction = (typeof ARIO_ACTIONS)[number]
