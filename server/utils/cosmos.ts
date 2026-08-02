import { CosmosClient, type Container } from '@azure/cosmos'

let ordersContainer: Container | null = null

export function getOrdersContainer(): Container {
  if (ordersContainer) {
    return ordersContainer
  }

  const { cosmos } = useRuntimeConfig()

  if (!cosmos.endpoint || !cosmos.key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cosmos DB is not configured. Set NUXT_COSMOS_ENDPOINT and NUXT_COSMOS_KEY.'
    })
  }

  const client = new CosmosClient({ endpoint: cosmos.endpoint, key: cosmos.key })
  ordersContainer = client.database(cosmos.database).container(cosmos.container)
  return ordersContainer
}
