import { Stack, Typography } from "@mui/material"
import React from "react"

import { MonoFontFF } from "./RootLayout/fonts"

// Use medium-saturation colors that work in both light and dark modes
const OUT_COLOR = "#a87858" // medium coral/orange
const IN_COLOR = "#58a870" // medium green

export function InOutLabel({ outbound }: { outbound: boolean }) {
  return (
    <Stack
      alignItems="center"
      sx={{
        padding: 0.5,
        width: 36,
        borderRadius: "4px",
        background: outbound ? OUT_COLOR : IN_COLOR,
      }}
    >
      <Typography variant="caption" fontFamily={MonoFontFF} sx={{ color: "var(--tag-text)" }}>
        {outbound ? "OUT" : "IN"}
      </Typography>
    </Stack>
  )
}
