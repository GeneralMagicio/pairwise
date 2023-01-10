import { router, publicProcedure } from '../../trpc'
import { z } from 'zod'
import { request, gql } from 'graphql-request'

const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql'

const GET_ALL_STRATEGIES = gql`
  query Strategies {
    strategies {
      id
      author
      version
      spacesCount
      examples
    }
  }
`

const GET_ONE_STRATEGY = (id: string) => {
  return gql`
  query Strategy {
    strategy (id: "${id}") {
      id
      author
      version
      spacesCount
      examples
    }
  }
`
}
export const snapshotRouter = router({
  getOneStrategy: publicProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ input }) => {
      const { id } = input
      const response = await request(SNAPSHOT_GRAPHQL_URL, GET_ONE_STRATEGY(id))
      return response.strategy
    }),
  getAllStrategies: publicProcedure.query(async () => {
    const response = await request(SNAPSHOT_GRAPHQL_URL, GET_ALL_STRATEGIES)
    return response.strategies
  })
})
