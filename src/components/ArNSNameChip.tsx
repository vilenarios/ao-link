import { Chip, Stack, Tooltip, Typography } from "@mui/material"
import { Globe } from "@phosphor-icons/react"
import { ReactNode } from "react"

import { MonoFontFF } from "./RootLayout/fonts"

// Use gradient primary start color for ArNS elements
const ARNS_COLOR = "var(--gradient-primary-start)"
// CSS variable approach for the hover background - will be set in globals.css
const ARNS_BG_HOVER = "var(--gradient-primary-start-10, rgba(247, 195, 161, 0.1))"

interface ArNSNameChipProps {
  name: string
  showIcon?: boolean
  variant?: "filled" | "outlined"
  size?: "small" | "medium"
  onClick?: () => void
  startAdornment?: ReactNode
  endAdornment?: ReactNode
}

/**
 * Component for displaying ArNS names with a distinctive globe icon
 */
export function ArNSNameChip({
  name,
  showIcon = true,
  variant = "outlined",
  size = "small",
  onClick,
  startAdornment,
  endAdornment,
}: ArNSNameChipProps) {
  return (
    <Tooltip title={`ArNS name: ${name}`} arrow>
      <Chip
        label={
          <Stack direction="row" alignItems="center" gap={0.5}>
            {startAdornment}
            {showIcon && (
              <Globe
                size={size === "small" ? 14 : 16}
                weight="duotone"
                style={{ color: ARNS_COLOR }}
              />
            )}
            <Typography
              variant="inherit"
              component="span"
              sx={{
                fontFamily: MonoFontFF,
                fontSize: size === "small" ? "0.75rem" : "0.875rem",
              }}
            >
              {name}
            </Typography>
            {endAdornment}
          </Stack>
        }
        variant={variant}
        size={size}
        onClick={onClick}
        sx={{
          backgroundColor: variant === "filled" ? ARNS_BG_HOVER : "transparent",
          borderColor: ARNS_COLOR,
          color: ARNS_COLOR,
          "& .MuiChip-label": {
            padding: "2px 6px",
          },
          "&:hover": {
            backgroundColor: ARNS_BG_HOVER,
            cursor: onClick ? "pointer" : "default",
          },
        }}
      />
    </Tooltip>
  )
}

interface ArNSNameDisplayProps {
  name: string
  showIcon?: boolean
  inline?: boolean
  onClick?: () => void
}

/**
 * Simple inline display component for ArNS names
 */
export function ArNSNameDisplay({
  name,
  showIcon = true,
  inline = true,
  onClick,
}: ArNSNameDisplayProps) {
  const content = (
    <Stack
      direction="row"
      alignItems="center"
      gap={0.5}
      sx={{
        display: inline ? "inline-flex" : "flex",
        color: ARNS_COLOR,
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              textDecoration: "underline",
            }
          : undefined,
      }}
      onClick={onClick}
    >
      {showIcon && <Globe size={14} weight="duotone" style={{ color: ARNS_COLOR }} />}
      <Typography
        variant="body2"
        component={inline ? "span" : "div"}
        sx={{
          fontFamily: MonoFontFF,
          color: "inherit",
        }}
      >
        {name}
      </Typography>
    </Stack>
  )

  if (onClick) {
    return (
      <Tooltip title={`ArNS name: ${name}`} arrow>
        {content}
      </Tooltip>
    )
  }

  return content
}
