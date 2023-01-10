import { router, publicProcedure } from '../../trpc'
import { z } from 'zod'
import { request, gql } from 'graphql-request'
import snapshot from '@snapshot-labs/snapshot.js'

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
  }),
  getScores: publicProcedure
    .input(
      z.object({
        blockNumber: z.union([z.string(), z.number()]).optional(),
        voters: z.string().array(),
        strategies: z
          .object({
            name: z.string(),
            network: z.string(),
            params: z.any()
          })
          .array()
      })
    )
    .query(async ({ input }) => {
      const { blockNumber, voters, strategies } = input
      try {
        const promiseList = Promise.allSettled(
          strategies.map(({ network, name, params }) =>
            snapshot.utils.getScores(
              '',
              [
                {
                  name,
                  params: params || {}
                }
              ],
              network,
              voters,
              blockNumber
            )
          )
        )
        const rawScores: Array<{ [key: string]: number }> = []
        const scoresByVoter: { [key: string]: number } = {}
        const responses = await promiseList
        responses.forEach((response) => {
          if (response.status === 'fulfilled') {
            rawScores.push(response.value[0])

            Object.keys(response.value[0]).map((key) => {
              scoresByVoter[key] =
                typeof scoresByVoter[key] === 'undefined'
                  ? response.value[0][key] || 0
                  : scoresByVoter[key] + response.value[0][key] || 0
            })
          }
        })
        return { rawScores, scoresByVoter }
      } catch (e) {
        console.error(e)
      }
    })
})
