import { TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import React from "react"

import { useNavigate } from "react-router-dom"

import { EntityBlock } from "@/components/EntityBlock"
import { IdBlock } from "@/components/IdBlock"
import { InOutLabel } from "@/components/InOutLabel"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { TokenTransferMessage } from "@/types"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { nativeTokenInfo } from "@/utils/native-token"

type TokenTransfersTableRowProps = {
  item: TokenTransferMessage
  entityId: string
}

export function TokenTransfersTableRow(props: TokenTransfersTableRowProps) {
  const navigate = useNavigate()

  const { item, entityId } = props

  return (
    <TableRow
      sx={{ cursor: "pointer" }}
      key={item.id}
      onClick={() => {
        navigate(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
      }}
    >
      <TableCell>
        <TypeBadge type={item.type} />
      </TableCell>
      {/* <TableCell>{item.action}</TableCell> */}
      <TableCell>
        <IdBlock label={truncateId(item.id)} value={item.id} href={`/message/${item.id}`} />
      </TableCell>
      <TableCell>
        <EntityBlock entityId={item.sender} />
      </TableCell>
      <TableCell>
        <InOutLabel outbound={entityId === item.sender} />
      </TableCell>
      <TableCell>
        <EntityBlock entityId={item.recipient} />
      </TableCell>
      <TableCell align="right">
        <Typography
          component="div"
          variant="inherit"
          sx={{
            color: item.amount > 0 ? "success.main" : "error.main",
          }}
        >
          <TokenAmountBlock amount={item.amount} tokenInfo={nativeTokenInfo} needsParsing />
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Tooltip title={formatFullDate(item.ingestedAt)}>
          <span>{formatRelative(item.ingestedAt)}</span>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}
