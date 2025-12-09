import {
  Box,
  IconButton,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material"
import { FunnelSimple, Info } from "@phosphor-icons/react"
import React, { useMemo, useState } from "react"

import { useNavigate } from "react-router-dom"

import { AsyncTable, AsyncTableProps, HeaderCell } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { InOutLabel } from "@/components/InOutLabel"
import { TableEntityBlock } from "@/components/TableEntityBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { ARIO_ACTIONS } from "@/config/ario"
import { AoMessage, MSG_TYPES } from "@/types"
import { TYPE_ICON_MAP, TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type EntityMessagesTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {
  entityId?: string
  hideBlockColumn?: boolean
  allowTypeFilter?: boolean
  allowActionFilter?: boolean
}

/**
 * TODO rename to AoTransactionsTable
 */
export function EntityMessagesTable(props: EntityMessagesTableProps) {
  const { entityId, hideBlockColumn, allowTypeFilter, allowActionFilter, ...rest } = props
  const navigate = useNavigate()

  const [extraFilters, setExtraFilters] = useState<Record<string, string>>({})

  const [filterTypeAnchor, setFilterTypeAnchor] = useState<null | HTMLElement>(null)
  const handleFilterTypeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterTypeAnchor(event.currentTarget)
  }
  const handleFilterTypeClose = () => {
    setFilterTypeAnchor(null)
  }

  // Action filter state
  const [filterActionAnchor, setFilterActionAnchor] = useState<null | HTMLElement>(null)
  const [actionSearchText, setActionSearchText] = useState("")
  const handleFilterActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterActionAnchor(event.currentTarget)
  }
  const handleFilterActionClose = () => {
    setFilterActionAnchor(null)
    setActionSearchText("")
  }

  // Filter actions based on search text
  const filteredActions = useMemo(() => {
    if (!actionSearchText) return ARIO_ACTIONS
    const searchLower = actionSearchText.toLowerCase()
    return ARIO_ACTIONS.filter((action) => action.toLowerCase().includes(searchLower))
  }, [actionSearchText])

  const headerCells: HeaderCell[] = [
    {
      label: !allowTypeFilter ? (
        "Type"
      ) : (
        <Stack direction="row" gap={0.5} sx={{ marginY: -1 }} alignItems="center">
          <span>Type</span>
          <Tooltip title={"Filter by type"}>
            <IconButton size="small" onClick={handleFilterTypeClick}>
              <FunnelSimple width={18} height={18} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={filterTypeAnchor}
            open={Boolean(filterTypeAnchor)}
            onClose={handleFilterTypeClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem
              onClick={() => {
                handleFilterTypeClose()
                setExtraFilters({})
              }}
              selected={Object.keys(extraFilters).length === 0}
            >
              <i>All</i>
            </MenuItem>
            {MSG_TYPES.map((msgType) => (
              <MenuItem
                key={msgType}
                onClick={() => {
                  handleFilterTypeClose()
                  setExtraFilters({ Type: msgType })
                }}
                selected={extraFilters.Type === msgType}
              >
                <Box sx={{ marginRight: 1 }}>{msgType}</Box>
                {TYPE_ICON_MAP[msgType] && (
                  <img alt="icon" width={10} height={10} src={TYPE_ICON_MAP[msgType]} />
                )}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      ),
      sx: { width: 140 },
    },
    { label: "ID", sx: { width: 240 } },
    {
      label: !allowActionFilter ? (
        "Action"
      ) : (
        <Stack direction="row" gap={0.5} sx={{ marginY: -1 }} alignItems="center">
          <span>Action</span>
          <Tooltip title={"Filter by action"}>
            <IconButton size="small" onClick={handleFilterActionClick}>
              <FunnelSimple
                width={18}
                height={18}
                weight={extraFilters.Action ? "fill" : "regular"}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={filterActionAnchor}
            open={Boolean(filterActionAnchor)}
            onClose={handleFilterActionClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            slotProps={{
              paper: {
                sx: { maxHeight: 400 },
              },
            }}
          >
            <ListSubheader
              sx={{
                pt: 1,
                pb: 1,
                backgroundColor: "background.paper",
              }}
            >
              <TextField
                size="small"
                autoFocus
                placeholder="Search actions..."
                fullWidth
                value={actionSearchText}
                onChange={(e) => setActionSearchText(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                }}
              />
            </ListSubheader>
            <MenuItem
              onClick={() => {
                handleFilterActionClose()
                setExtraFilters((prev) => {
                  const { Action, ...rest } = prev
                  return rest
                })
              }}
              selected={!extraFilters.Action}
            >
              <i>All</i>
            </MenuItem>
            {filteredActions.map((action) => (
              <MenuItem
                key={action}
                onClick={() => {
                  handleFilterActionClose()
                  setExtraFilters((prev) => ({ ...prev, Action: action }))
                }}
                selected={extraFilters.Action === action}
              >
                {action}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      ),
    },
    { label: "From", sx: { width: 240 } },
    { label: "", sx: { width: 60 } },
    { label: "To", sx: { width: 240 } },
    {
      label: "Arweave Block",
      sx: { width: 160 },
      align: "right",
    },
    {
      field: "ingestedAt" satisfies keyof AoMessage,
      label: (
        <Stack direction="row" gap={0.5} alignItems="center">
          Seen at
          <Tooltip title="Time when the message was seen by the Arweave network (ingested_at).">
            <Info width={16} height={16} />
          </Tooltip>
        </Stack>
      ),
      sx: { width: 160 },
      align: "right",
      sortable: true,
    },
  ]

  if (hideBlockColumn) {
    headerCells.splice(6, 1)
  }

  return (
    <AsyncTable
      virtualize
      extraFilters={extraFilters}
      {...rest}
      component={Paper}
      initialSortDir="desc"
      initialSortField="ingestedAt"
      headerCells={headerCells}
      renderRow={(item: AoMessage) => {
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
            <TableCell>
              <IdBlock
                label={truncateId(item.id)}
                value={item.id}
                href={`/${TYPE_PATH_MAP[item.type]}/${item.id}`}
              />
            </TableCell>
            <TableCell>{item.action}</TableCell>
            <TableCell>
              <TableEntityBlock entityId={item.from} />
            </TableCell>
            <TableCell>
              {entityId !== undefined && <InOutLabel outbound={entityId !== item.to} />}
            </TableCell>
            <TableCell>
              <TableEntityBlock entityId={item.to} />
            </TableCell>
            {!hideBlockColumn && (
              <TableCell align="right">
                {item.blockHeight === null ? (
                  "Processing"
                ) : (
                  <IdBlock
                    label={formatNumber(item.blockHeight)}
                    value={String(item.blockHeight)}
                    href={`/block/${item.blockHeight}`}
                  />
                )}
              </TableCell>
            )}
            <TableCell align="right">
              {item.ingestedAt === null ? (
                "Processing"
              ) : (
                <Tooltip title={formatFullDate(item.ingestedAt)}>
                  <span>{formatRelative(item.ingestedAt)}</span>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        )
      }}
    />
  )
}
