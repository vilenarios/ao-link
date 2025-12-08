import { Stack, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import React, { useMemo } from "react"
import { Navigate, useParams } from "react-router-dom"

import { ProcessPage } from "./ProcessPage"
import { UserPage } from "./UserPage"
import { LoadingSkeletons } from "@/components/LoadingSkeletons"
import PageWrapper from "@/components/PageWrapper"
import { getMessageById } from "@/services/messages-api"

import { AoProcess } from "@/types"
import { isArweaveId, isValidEntityId } from "@/utils/utils"

function EntityPageContent() {
  const { entityId = "" } = useParams()

  const isValidId = useMemo(() => isValidEntityId(String(entityId)), [entityId])
  const isArweaveAddress = useMemo(() => isArweaveId(String(entityId)), [entityId])

  // Only check if the entity is a message/process for Arweave IDs
  // Ethereum addresses can own tokens and ArNS names but are not AO messages/processes
  const {
    data: message,
    isLoading,
    error,
  } = useQuery({
    enabled: Boolean(entityId) && isValidId && isArweaveAddress,
    queryKey: ["message", entityId],
    queryFn: () => getMessageById(entityId),
  })

  if (!isValidId || error) {
    return (
      <Stack component="main" gap={4} paddingY={4}>
        <Typography>{error?.message || "Invalid Entity ID."}</Typography>
      </Stack>
    )
  }

  // For Ethereum addresses, skip message lookup and show UserPage directly
  if (!isArweaveAddress) {
    return <UserPage key={entityId} entityId={entityId} />
  }

  if (isLoading) {
    return <LoadingSkeletons />
  }

  if (!message) {
    return <UserPage key={entityId} entityId={entityId} />
  }

  if (message.type === "Process") {
    return <ProcessPage key={entityId} message={message as AoProcess} />
  }

  return <Navigate to={`/message/${entityId}`} />
}

export default function EntityPage() {
  return (
    <PageWrapper>
      <EntityPageContent />
    </PageWrapper>
  )
}
