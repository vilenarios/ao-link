"use client"

import { Container, Stack } from "@mui/material"
import CssBaseline from "@mui/material/CssBaseline"
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  getInitColorSchemeScript,
} from "@mui/material/styles"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ArweaveProvider } from "./ArweaveProvider"
import { theme } from "./theme"
import { Footer } from "../Footer"
import Header from "../Header"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,
    },
  },
})

export default function RootLayoutUI({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Prevent flash of wrong color mode */}
      {getInitColorSchemeScript({ defaultMode: "dark" })}
      <CssVarsProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        <ArweaveProvider>
          <Stack sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
            <Header />
            <Container
              maxWidth="xl"
              sx={{
                minHeight: "calc(100vh - 101px)",
                px: { xs: 1.5, sm: 2, md: 3 },
              }}
            >
              {children}
            </Container>
            <Footer />
          </Stack>
        </ArweaveProvider>
      </CssVarsProvider>
    </QueryClientProvider>
  )
}
