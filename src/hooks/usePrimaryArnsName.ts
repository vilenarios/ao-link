import { useQuery, useQueryClient } from "@tanstack/react-query"

import { populateReverseLookupCache } from "@/services/arns-cache-utils"
import { getPrimaryName } from "@/services/arns-service"
import { ARNS_CACHE_CONFIG } from "@/services/cache-config"
import { isValidEntityId } from "@/utils/utils"

/**
 * Hook to get the primary ArNS name for a given address using AR-IO SDK
 * This is efficient and only makes a single targeted API call
 * Supports both Arweave addresses and Ethereum addresses
 */
export function usePrimaryArnsName(address: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ["primary-arns-name", address],
    queryFn: async () => {
      if (!address || !isValidEntityId(address)) {
        return null
      }

      const primaryName = await getPrimaryName(address)

      // Populate reverse lookup cache for optimization
      populateReverseLookupCache(queryClient, address, primaryName)

      return primaryName
    },
    ...ARNS_CACHE_CONFIG,
    enabled: Boolean(address && isValidEntityId(address)),
  })
}
