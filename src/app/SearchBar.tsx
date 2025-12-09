"use client"

import {
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react"
import React, { type ChangeEvent, useState, useCallback, useRef } from "react"

import { useNavigate } from "react-router-dom"

import { TypeBadge } from "@/components/TypeBadge"
import { ARIO_PROCESS_ID } from "@/config/ario"
import { getRecordValue } from "@/services/arns-api"
import { resolveArNSName } from "@/services/arns-service"
import { getMessageById } from "@/services/messages-api"
import { TYPE_PATH_MAP } from "@/utils/data-utils"
import { isArweaveId, isEthereumAddress } from "@/utils/utils"

type ResultType = "Message" | "Process" | "ArNS" | "User"

type Result = {
  label: string
  id: string
  type: ResultType
}

/**
 * Check if a message is related to AR.IO (sent to or from the AR.IO process)
 */
function isArioRelatedMessage(msg: { to: string; from: string }): boolean {
  return msg.to === ARIO_PROCESS_ID || msg.from === ARIO_PROCESS_ID
}

// Simple in-memory cache for ANT process checks (avoid repeated dry-runs)
const antProcessCache = new Map<string, { result: boolean; timestamp: number }>()
const ANT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const ANT_CACHE_MAX_SIZE = 100 // Prevent unbounded memory growth

async function checkIsAntProcess(processId: string): Promise<boolean> {
  // Check cache first
  const cached = antProcessCache.get(processId)
  if (cached && Date.now() - cached.timestamp < ANT_CACHE_TTL) {
    return cached.result
  }

  try {
    const record = await getRecordValue(processId)
    const isAnt = !!(record && record.antId)

    // Evict oldest entries if cache is full
    if (antProcessCache.size >= ANT_CACHE_MAX_SIZE) {
      const firstKey = antProcessCache.keys().next().value
      if (firstKey) antProcessCache.delete(firstKey)
    }

    antProcessCache.set(processId, { result: isAnt, timestamp: Date.now() })
    return isAnt
  } catch {
    antProcessCache.set(processId, { result: false, timestamp: Date.now() })
    return false
  }
}

async function findByText(text: string, abortSignal?: AbortSignal): Promise<Result[]> {
  if (!text || !text.trim()) return Promise.resolve([])
  text = text.trim()

  // Check if request was cancelled
  if (abortSignal?.aborted) {
    throw new Error("Search cancelled")
  }

  // Determine what type of search to perform based on input pattern
  const isLikelyArweaveId = isArweaveId(text) || text.length === 43
  const isEthAddress = isEthereumAddress(text)

  const results: Result[] = []

  if (isEthAddress) {
    // Input is an Ethereum address - add as User result
    results.push({
      label: `${text} (ETH User)`,
      id: text,
      type: "User" as ResultType,
    })
  } else if (isLikelyArweaveId) {
    // Input looks like an Arweave ID - search for messages and check if it's an ANT
    const [msg, isAnt] = await Promise.all([
      getMessageById(text).catch(() => null),
      checkIsAntProcess(text),
    ])

    // Check if the searched ID is an ANT process
    if (isAnt) {
      results.push({
        label: `${text} (ANT Process)`,
        id: text,
        type: "Process" as ResultType,
      })
    }

    // Only show messages that are AR.IO related (and not already added as ANT)
    if (msg && msg.type && isArioRelatedMessage(msg) && !results.some((r) => r.id === msg.id)) {
      results.push({
        label: text,
        id: msg.id,
        type: msg.type === "Process" ? "Process" : "Message",
      })
    }

    // Always offer to search as a User/wallet address (could be an Arweave wallet)
    results.push({
      label: `${text} (AR User)`,
      id: text,
      type: "User" as ResultType,
    })
  } else {
    // Input is likely an ArNS name - only search ArNS (don't waste calls on GraphQL/ANT checks)
    const arnsResolution = await resolveArNSName(text).catch(() => null)

    if (arnsResolution) {
      // 1. ArNS management result - links to arns.ar.io
      results.push({
        label: `${text} (ArNS Management)`,
        id: text,
        type: "ArNS" as ResultType,
      })

      // 2. User result - the owner of the ArNS name
      if (arnsResolution.owner && !results.some((r) => r.id === arnsResolution.owner)) {
        results.push({
          label: `${arnsResolution.owner} (ArNS Owner)`,
          id: arnsResolution.owner,
          type: "User" as ResultType,
        })
      }

      // 3. Process result - the ANT process that manages this name
      if (arnsResolution.processId && !results.some((r) => r.id === arnsResolution.processId)) {
        results.push({
          label: `${arnsResolution.processId} (ANT Process)`,
          id: arnsResolution.processId,
          type: "Process" as ResultType,
        })
      }
    }
  }

  return results
}

const SearchBar = () => {
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const abortControllerRef = useRef<AbortController>()

  const performSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setLoading(true)
    try {
      const searchResults = await findByText(value, abortControllerRef.current.signal)
      setResults(searchResults)
    } catch (error: any) {
      if (error.message !== "Search cancelled") {
        console.error("Search error:", error)
        setResults([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setInputValue(value)

    // Clear previous debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Debounce search requests
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(value)
    }, 300) // 300ms debounce
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
  }

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false)
    }, 0)
  }

  const navigate = useNavigate()

  return (
    <Box
      sx={{
        width: {
          xs: "100%", // Full width on mobile
          sm: 400, // Small tablets / landscape phones
          md: 480, // Tablets
          lg: 560, // Laptop
          xl: 720, // Large desktop
        },
        maxWidth: "100%", // Ensure we never exceed the viewport width
        position: "relative",
      }}
    >
      <Autocomplete
        id="search-bar"
        size="small"
        disableClearable
        clearOnEscape
        freeSolo
        options={results}
        value={inputValue}
        sx={{
          "& .MuiAutocomplete-listbox": {
            maxHeight: "400px",
          },
          "& .MuiAutocomplete-popper": {
            zIndex: 1301, // Higher than backdrop
          },
        }}
        onChange={(event, newValue, reason) => {
          if (reason === "selectOption" && typeof newValue !== "string") {
            setInputValue("")
            setResults([])

            // Special handling for ArNS management
            if (newValue.type === "ArNS") {
              window.open(`https://arns.ar.io/#/manage/names/${newValue.id}`, "_blank")
            } else {
              navigate(`/${TYPE_PATH_MAP[newValue.type]}/${newValue.id}`)
            }

            document.getElementById("search-bar")?.blur()
          }

          if (reason === "clear") {
            document.getElementById("search-bar")?.blur()
          }
        }}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        renderOption={(props, option) => (
          <Stack
            {...props}
            direction="row"
            alignItems="center"
            component={MenuItem}
            key={`${option.id}_${option.type}`}
            justifyContent="space-between"
          >
            <Stack direction="row" gap={1} alignItems="center">
              <TypeBadge type={option.type} />
              <Typography variant="inherit">{option.id}</Typography>
            </Stack>
            <ArrowUpRight size={18} />
          </Stack>
        )}
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            placeholder="Search by User ID, ArNS Name, AR.IO Message ID or ANT Process ID"
            sx={{
              background: "var(--mui-palette-background-default) !important",
              "& fieldset": {
                borderColor: "var(--mui-palette-divider) !important",
              },
              width: "100%",
              zIndex: 50,
              "& .MuiOutlinedInput-root": {
                overflow: "hidden",
              },
            }}
            {...params}
            onChange={handleInputChange}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <MagnifyingGlass width={16} height={16} alt="search" />
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      <Backdrop
        open={isInputFocused}
        sx={{
          zIndex: 10,
          backdropFilter: "blur(4px)",
          backgroundColor: "var(--transparent-100-64)", // Uses theme-aware backdrop
        }}
      />
    </Box>
  )
}

export default SearchBar
