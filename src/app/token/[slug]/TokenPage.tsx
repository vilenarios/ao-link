import { Avatar, Box, Paper, Skeleton, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useEffect, useMemo, useState } from "react"
import { Navigate, useParams, useSearchParams } from "react-router-dom"

import { TokenHolderChart } from "./TokenHolderChart"

import { TokenHolderTable } from "./TokenHolderTable"
import ErrorView from "@/components/ErrorView"
import { IdBlock } from "@/components/IdBlock"
import PageSkeleton from "@/components/PageSkeleton"
import PageWrapper from "@/components/PageWrapper"
import { SectionInfo } from "@/components/SectionInfo"
import { Subheading } from "@/components/Subheading"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { ARIO_TOKEN_ID } from "@/config/ario"
import { useTokenInfo } from "@/hooks/useTokenInfo"
import { TokenHolder, getTokenHolders } from "@/services/token-api"
import { getTokenLogoUrl } from "@/utils/native-token"
import { isArweaveId } from "@/utils/utils"

const defaultTab = "table"

export default function TokenPage() {
  const { tokenId } = useParams()

  // Always call hooks unconditionally (React rules of hooks)
  const tokenInfo = useTokenInfo(tokenId === ARIO_TOKEN_ID ? tokenId : undefined)

  // Redirect to AR.IO token if a different token is requested
  if (tokenId && tokenId !== ARIO_TOKEN_ID) {
    return <Navigate to={`/token/${ARIO_TOKEN_ID}`} replace />
  }

  const [tokenHolders, setTokenHolders] = useState<TokenHolder[]>()

  useEffect(() => {
    if (!tokenInfo) return

    getTokenHolders(tokenInfo).then(setTokenHolders)
  }, [tokenInfo])

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

  const errorMessage = useMemo(() => {
    if (!isArweaveId(String(tokenId))) {
      return "Invalid Process ID."
    }
    if (tokenInfo === null) {
      return "Cannot read Token Info."
    }
  }, [tokenId, tokenInfo])

  if (!tokenId || tokenInfo === null || errorMessage) {
    return <ErrorView message={errorMessage || "Invalid token"} />
  }

  return (
    <PageWrapper>
      <Stack component="main" gap={6} paddingY={4} key={tokenId}>
        <Subheading type="TOKEN" value={<IdBlock label={tokenId} />} />
        <Grid2 container spacing={{ xs: 4 }}>
          <Grid2 xs={12} lg={6}>
            {tokenInfo === undefined ? (
              <Skeleton height={48} variant="rectangular" />
            ) : (
              <Stack direction="row" gap={1} alignItems="center">
                <Avatar
                  src={getTokenLogoUrl(tokenInfo.logo)}
                  alt={tokenInfo.name}
                  sx={{ width: 48, height: 48 }}
                />
                <Stack>
                  <Tooltip title="Name" placement="right">
                    <Typography variant="h6" lineHeight={1.15}>
                      {tokenInfo.name}
                    </Typography>
                  </Tooltip>
                  <Tooltip title="Ticker" placement="right">
                    <Typography variant="body2" lineHeight={1.15} color="text.secondary">
                      {tokenInfo.ticker}
                    </Typography>
                  </Tooltip>
                </Stack>
              </Stack>
            )}
          </Grid2>
          <Grid2 xs={12} lg={6}>
            {tokenHolders === undefined ? (
              <Skeleton height={48} variant="rectangular" />
            ) : (
              <Stack justifyContent="center" height="100%">
                <SectionInfo title="Token holders" value={tokenHolders.length} />
                <SectionInfo
                  title="Circulating supply"
                  value={
                    <TokenAmountBlock
                      amount={tokenHolders.reduce((acc, holder) => acc + holder.balance, 0)}
                      tokenInfo={tokenInfo}
                    />
                  }
                />
              </Stack>
            )}
          </Grid2>
        </Grid2>
        <div>
          <Tabs value={activeTab} onChange={handleChange} textColor="primary">
            <Tab value="table" label="Token Holders Table" />
            <Tab value="chart" label="Token Holders Chart" />
          </Tabs>
          <Box sx={{ marginX: -2 }}>
            {tokenHolders === undefined || !tokenInfo ? (
              <PageSkeleton />
            ) : (
              <Paper>
                {activeTab === "table" && (
                  <TokenHolderTable data={tokenHolders} tokenInfo={tokenInfo} />
                )}
                {activeTab === "chart" && (
                  <TokenHolderChart data={tokenHolders} tokenInfo={tokenInfo} />
                )}
              </Paper>
            )}
          </Box>
        </div>
      </Stack>
    </PageWrapper>
  )
}
