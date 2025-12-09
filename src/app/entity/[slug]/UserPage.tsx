import { Box, Stack, Tabs } from "@mui/material"
import React, { useState } from "react"
import { useSearchParams } from "react-router-dom"

// import { ArDomains } from "./ArDomains"
import { IncomingMessagesTable } from "./IncomingMessagesTable"
import { OutgoingMessagesTable } from "./OutgoingMessagesTable"
import { SpawnedProcesses } from "./SpawnedProcesses"
import { TokenTransfers } from "./TokenTransfers"
import { ArnsSection } from "@/components/ArnsSection"
import { BalanceSection } from "@/components/BalanceSection"
import { IdBlock } from "@/components/IdBlock"
import { Subheading } from "@/components/Subheading"
import { TabWithCount } from "@/components/TabWithCount"
import { UserAddress } from "@/types"
import { isEthereumAddress } from "@/utils/utils"

type UserPageProps = {
  entityId: UserAddress
}

export function UserPage(props: UserPageProps) {
  const { entityId } = props
  const isEthUser = isEthereumAddress(entityId)

  // ETH users can't query by owner (requires public key for normalization),
  // so default to incoming messages for them
  const defaultTab = isEthUser ? "incoming" : "outgoing"

  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || defaultTab)
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

  return (
    <Stack component="main" gap={6} paddingY={4}>
      <Subheading type={isEthUser ? "ETH USER" : "USER"} value={<IdBlock label={entityId} />} />
      <Stack gap={1}>
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
          {/* Outgoing messages and spawned processes require owner queries which need
              the public key for ETH address normalization - not available from address alone */}
          {!isEthUser && (
            <TabWithCount value="outgoing" label="Outgoing messages" chipValue={outgoingCount} />
          )}
          <TabWithCount value="incoming" label="Incoming messages" chipValue={incomingCount} />
          {!isEthUser && (
            <TabWithCount value="spawned" label="Spawned processes" chipValue={processesCount} />
          )}
          <TabWithCount value="transfers" label="ARIO transfers" chipValue={transfersCount} />
        </Tabs>
        <Box sx={{ marginX: -2 }}>
          {!isEthUser && (
            <OutgoingMessagesTable
              entityId={entityId}
              open={activeTab === "outgoing"}
              onCountReady={setOutgoingCount}
            />
          )}
          <IncomingMessagesTable
            entityId={entityId}
            open={activeTab === "incoming"}
            onCountReady={setIncomingCount}
          />
          {!isEthUser && (
            <SpawnedProcesses
              entityId={entityId}
              open={activeTab === "spawned"}
              onCountReady={setProcessesCount}
            />
          )}
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
