import { Box, Container, Link, Stack, Typography } from "@mui/material"
import React, { useMemo } from "react"

import { GoldSkyLogo } from "./GoldSkyLogo"

/**
 * Generates an ArNS URL based on the current hostname.
 * If viewing scan.ar.io, returns aolink.ar.io
 * If viewing scan.{gateway}.com, returns aolink.{gateway}.com
 */
function getArnsUrl(arnsName: string): string {
  if (typeof window === "undefined") {
    return `https://${arnsName}.ar.io`
  }

  const hostname = window.location.hostname

  // Handle localhost for development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `https://${arnsName}.ar.io`
  }

  // Split hostname into parts (e.g., "scan.ar.io" -> ["scan", "ar", "io"])
  const parts = hostname.split(".")

  // Replace the first part (the ArNS name) with the new name
  // e.g., scan.ar.io -> aolink.ar.io
  // e.g., scan.gateway.example.com -> aolink.gateway.example.com
  if (parts.length >= 2) {
    parts[0] = arnsName
    return `https://${parts.join(".")}`
  }

  // Fallback to ar.io gateway
  return `https://${arnsName}.ar.io`
}

export function Footer() {
  const aoLinkUrl = useMemo(() => getArnsUrl("aolink"), [])

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        width: "100%",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          paddingX: 2,
          paddingY: 1,
          background: "var(--grey-700)",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            overflowX: { xs: "auto", md: "visible" },
            whiteSpace: { xs: "nowrap", md: "normal" },
            width: "100%",
            justifyContent: { xs: "flex-start", md: "space-between" },
          }}
        >
          <Stack direction="row" gap={1.5} alignItems="center" sx={{ color: "var(--text-mid)" }}>
            <Link
              href="https://ar.io"
              target="_blank"
              sx={{
                color: "var(--text-mid)",
                "&:hover": {
                  color: "var(--text-high)",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              HOME
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4, color: "var(--text-low)" }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="https://github.com/ar-io"
              target="_blank"
              sx={{
                color: "var(--text-mid)",
                "&:hover": {
                  color: "var(--text-high)",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              GITHUB
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4, color: "var(--text-low)" }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href={aoLinkUrl}
              target="_blank"
              sx={{
                color: "var(--text-mid)",
                "&:hover": {
                  color: "var(--text-high)",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              AO
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4, color: "var(--text-low)" }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="https://x.com/ar_io_network"
              target="_blank"
              sx={{
                color: "var(--text-mid)",
                "&:hover": {
                  color: "var(--text-high)",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              X
            </Link>
            <Typography
              component="span"
              sx={{ opacity: 0.4, color: "var(--text-low)" }}
              variant="caption"
            >
              /
            </Typography>
            <Link
              href="https://docs.ar.io"
              target="_blank"
              sx={{
                color: "var(--text-mid)",
                "&:hover": {
                  color: "var(--text-high)",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              DOCS
            </Link>
          </Stack>
          {/* Spacer for mobile */}
          <Box sx={{ display: { xs: "inline-block", md: "none" }, minWidth: 32 }} />
          <Stack direction="row" gap={1} alignItems="center">
            <Typography component="span" sx={{ color: "var(--text-low)" }} variant="caption">
              Powered by
            </Typography>
            <Link
              href="https://goldsky.com"
              target="_blank"
              sx={{
                color: "var(--text-mid)",
                "&:hover": {
                  color: "var(--text-high)",
                },
              }}
              fontWeight={500}
              underline="none"
              variant="body2"
            >
              <GoldSkyLogo />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
