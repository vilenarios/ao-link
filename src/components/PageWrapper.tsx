import React, { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import ErrorView from "./ErrorView"
import PageSkeleton from "./PageSkeleton"

interface PageWrapperProps {
  children: React.ReactNode
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ErrorBoundary fallback={<ErrorView />}>{children}</ErrorBoundary>
    </Suspense>
  )
}
