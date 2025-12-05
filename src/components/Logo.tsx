import { useColorScheme } from "@mui/material"
import React from "react"

interface LogoProps {
  color?: string
  height?: number
}

export function Logo({ height = 28 }: LogoProps) {
  const { mode = "dark" } = useColorScheme()

  const logoSrc = mode === "dark" ? "/ar.io-alt-white.png" : "/ar.io-alt-black.png"

  return (
    <img
      src={logoSrc}
      alt="AR.IO Scan"
      style={{
        display: "block",
        height: `${height}px`,
        width: "auto",
        maxWidth: "100%",
        objectFit: "contain",
      }}
    />
  )
}
