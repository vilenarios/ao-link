import { Client, cacheExchange, fetchExchange } from "urql"

import { GATEWAY_GRAPHQL } from "@/config/gateway"

export const goldsky = new Client({
  url: GATEWAY_GRAPHQL,
  exchanges: [cacheExchange, fetchExchange],
})
