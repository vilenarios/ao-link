# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AR.IO Scan is a web-based explorer specifically for the AR.IO Network on Arweave. It allows users to search and explore AR.IO process messages, the AR.IO module, AR.IO token, and ArNS (Arweave Name Service) records.

**Note:** This project is archived and no longer actively maintained.

## Development Commands

```bash
# Start development server on port 3005
yarn dev

# Build for production
yarn build

# Type checking
yarn check-types

# Linting
yarn lint
yarn lint:fix

# Deploy to Arweave permaweb
yarn deploy
```

## Architecture

### Tech Stack

- React 18 with TypeScript
- Vite for bundling
- MUI (Material-UI) for components
- TanStack Query for data fetching/caching
- React Router (HashRouter) for routing
- urql for GraphQL client
- nanostores for state management
- Highcharts and D3 for data visualization

### Directory Structure

- `src/app/` - Page components organized by route (entity, message, block, module, token, etc.)
- `src/components/` - Reusable UI components
- `src/services/` - API layer for data fetching
- `src/hooks/` - Custom React hooks (primarily ArNS-related)
- `src/stores/` - nanostores state stores
- `src/utils/` - Utility functions
- `src/config/` - Configuration (gateway endpoints)

### Key Services

**GraphQL Data Source:** Uses Goldsky's AO search gateway (`https://ao-search-gateway.goldsky.com/graphql`) via urql for querying AO transactions.

**AO Connect:** Uses `@permaweb/aoconnect` for interacting with AO processes (dry-run, result fetching).

**ArNS:** Uses `@ar.io/sdk` for ArNS (Arweave Name Service) resolution and record management.

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
