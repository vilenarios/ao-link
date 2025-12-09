import { Box, Stack, Tabs } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

// import { ArDomains } from "./ArDomains"
import { IncomingMessagesTable } from "./IncomingMessagesTable"
import { OutgoingMessagesTable } from "./OutgoingMessagesTable"
import { SpawnedProcesses } from "./SpawnedProcesses"
import { TokenTransfers } from "./TokenTransfers"
import { ArnsSection } from "@/components/ArnsSection"
import { BalanceSection } from "@/components/BalanceSection"
import { IdBlock } from "@/components/IdBlock"
import { SectionInfo } from "@/components/SectionInfo"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { resolveEthToNormalizedAddress } from "@/services/eth-normalization"
import { UserAddress } from "@/types"
import { isEthereumAddress } from "@/utils/utils"

type UserPageProps = {
  entityId: UserAddress
}

export function UserPage(props: UserPageProps) {
  const { entityId } = props
  const isEthUser = isEthereumAddress(entityId)

  // ETH users default to outgoing (same as Arweave users) now that normalization works
  const defaultTab = "outgoing"

  // All tabs now work for ETH users via normalized address lookup

  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get("tab")

  const initialTab = requestedTab ?? defaultTab

  const [activeTab, setActiveTab] = useState(initialTab)
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
    if (newValue === defaultTab) {
      setSearchParams({})
    } else {
      setSearchParams({ tab: newValue })
    }
  }

  const [outgoingCount, setOutgoingCount] = useState<number>()
  const [incomingCount, setIncomingCount] = useState<number>()
  const [processesCount, setProcessesCount] = useState<number>()
  const [transfersCount, setTransfersCount] = useState<number>()

  // For ETH users, fetch their normalized Arweave address
  const [normalizedAddress, setNormalizedAddress] = useState<string | null>(null)
  useEffect(() => {
    if (isEthUser) {
      resolveEthToNormalizedAddress(entityId).then((resolved) => {
        // Only set if it's different from the original (meaning we found a normalized address)
        if (resolved !== entityId) {
          setNormalizedAddress(resolved)
        }
      })
    }
  }, [entityId, isEthUser])

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type="USER" value={<IdBlock label={entityId} />} />
      <Stack gap={1}>
        {normalizedAddress && (
          <SectionInfo title="Normalized Address" value={<IdBlock label={normalizedAddress} />} />
        )}
        <BalanceSection entityId={entityId} />
        <ArnsSection entityId={entityId} />
      </Stack>
      <div>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <TabWithCount value="outgoing" label="Outgoing messages" chipValue={outgoingCount} />
          <TabWithCount value="incoming" label="Incoming messages" chipValue={incomingCount} />
          <TabWithCount value="spawned" label="Spawned processes" chipValue={processesCount} />
          <TabWithCount value="transfers" label="ARIO transfers" chipValue={transfersCount} />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          <OutgoingMessagesTable
            entityId={entityId}
            open={activeTab === "outgoing"}
            onCountReady={setOutgoingCount}
          />
          <IncomingMessagesTable
            entityId={entityId}
            open={activeTab === "incoming"}
            onCountReady={setIncomingCount}
          />
          <SpawnedProcesses
            entityId={entityId}
            open={activeTab === "spawned"}
            onCountReady={setProcessesCount}
          />
          <TokenTransfers
            entityId={entityId}
            open={activeTab === "transfers"}
            onCountReady={setTransfersCount}
          />
        </Box>
      </div>
    </Stack>
  )
}
