import React, { memo } from "react"

import { EntityMessagesTable } from "@/app/entity/[slug]/EntityMessagesTable"
import { ARIO_PROCESS_ID } from "@/config/ario"
import { getArioMessages } from "@/services/messages-api"

type EntityMessagesProps = {
  open: boolean
  onCountReady?: (count: number) => void
}

function BaseAllMessagesTable(props: EntityMessagesProps) {
  const { open, onCountReady } = props

  if (!open) return null

  const pageSize = 25

  return (
    <EntityMessagesTable
      entityId={ARIO_PROCESS_ID}
      pageSize={pageSize}
      allowActionFilter
      fetchFunction={async (offset, ascending, sortField, lastRecord, extraFilters) => {
        const [count, records] = await getArioMessages(
          ARIO_PROCESS_ID,
          pageSize,
          lastRecord?.cursor,
          ascending,
          extraFilters,
        )

        if (count !== undefined && onCountReady) {
          onCountReady(count)
        }

        return records
      }}
    />
  )
}

export const AllMessagesTable = memo(BaseAllMessagesTable)
