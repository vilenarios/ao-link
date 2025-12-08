# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AR.IO Scan is a web-based explorer for the AR.IO Network on Arweave. It allows users to search and explore AR.IO process messages, the AR.IO module, AR.IO token, and ArNS (Arweave Name Service) records.

**Note:** This project is archived and no longer actively maintained.

## Development Commands

```bash
yarn dev          # Start dev server on port 3005
yarn build        # Build for production
yarn check-types  # Type checking (tsc --noEmit)
yarn lint         # Linting
yarn lint:fix     # Lint and auto-fix
yarn deploy       # Deploy to Arweave permaweb
```

## Architecture

### Tech Stack

- React 18 + TypeScript + Vite
- MUI (Material-UI) for components
- TanStack Query for data fetching/caching
- React Router (HashRouter) for routing
- urql for GraphQL client
- nanostores for state management
- Highcharts and D3 for data visualization

### Directory Structure

- `src/app/` - Page components organized by route (entity, message, block, module, token, arns)
- `src/components/` - Reusable UI components
- `src/services/` - API layer for data fetching
- `src/hooks/` - Custom React hooks (primarily ArNS-related)
- `src/stores/` - nanostores state stores
- `src/utils/` - Utility functions
- `src/config/` - Configuration constants (gateway endpoints, AR.IO process IDs)

### Key Configuration (src/config/)

- `gateway.ts` - GraphQL endpoint (`https://ao-search-gateway.goldsky.com/graphql`) and Arweave data gateway
- `ario.ts` - AR.IO Network process IDs: `ARIO_PROCESS_ID`, `ARIO_MODULE_ID`, `ARIO_ANT_REGISTRY`, `ARIO_TOKEN_ID`

### Key Services (src/services/)

- `graphql-client.ts` - urql client configured for Goldsky AO search gateway
- `messages-api.ts` - Fetch AO messages/transactions via GraphQL
- `arns-service.ts` - ArNS name resolution and record management using `@ar.io/sdk`
- `token-api.ts` - Token-related data fetching
- `blocks-api.ts` - Block data queries

### Path Aliases

Use `@/` to import from `src/` directory (e.g., `import { goldsky } from "@/services/graphql-client"`).

### Data Flow

1. Page components request data via services (`src/services/`)
2. Services query Goldsky GraphQL API for AO message/transaction data
3. Raw data is parsed into typed structures (`AoMessage`, `TokenTransferMessage`, etc.)
4. Components render data with MUI components

### Key Types (src/types.ts)

- `AoMessage` - Core message type with action, from, to, type, tags
- `AoProcess` - Process-specific message type
- `TokenTransferMessage` - Token transfer events
- `NetworkStat` - Network statistics data

### ArNS Integration

The app heavily uses ArNS (Arweave Name Service) via `@ar.io/sdk`. Key hooks in `src/hooks/`:

- `useArnsRecords` / `useArnsRecordsPaginated` - Fetch ArNS records
- `useArnsResolution` - Resolve ArNS names to transaction IDs
- `usePrimaryArnsName` - Get primary name for an address
- `useArnsForEntityId` - Check if an entity ID is an ArNS name
