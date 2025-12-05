"use client"

import { Box, Stack } from "@mui/material"
import React from "react"

import { AllMessagesTable } from "./AllMessagesTable"
import PageWrapper from "@/components/PageWrapper"

import { Subheading } from "@/components/Subheading"

function HomePageContent() {
  return (
    <Stack component="main" gap={2} sx={{ paddingY: { xs: 2, sm: 3 } }}>
      <Subheading type="Latest AR.IO Network Messages" />
      <Box sx={{ marginX: { xs: 0, sm: -2 } }}>
        <AllMessagesTable open />
      </Box>
    </Stack>
  )
}

export default function HomePage() {
  return (
    <PageWrapper>
      <HomePageContent />
    </PageWrapper>
  )
}
