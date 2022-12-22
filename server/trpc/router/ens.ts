import { router, publicProcedure } from '../trpc'
import { z } from 'zod'
import { request, gql } from 'graphql-request'

const ENS_SUBGRAPH_URL =
  'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

const GET_ENS_NAMES_BY_ADDRESS = gql`
  query Domain($id: String!) {
    account(id: $id) {
      domains {
        name
      }
    }
  }
`

export const ensRouter = router({
  getEnsNamesByAddress: publicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ input }) => {
      const { address } = input

      const response = await request(
        ENS_SUBGRAPH_URL,
        GET_ENS_NAMES_BY_ADDRESS,
        {
          id: address.toLowerCase()
        }
      )
      const names: Array<string> = []
      try {
        response &&
          response.account.domains &&
          response.account.domains.map((domain: { name: string }) =>
            names.push(domain.name)
          )
      } catch (e) {
        console.log(e)
      }

      return names
    })
})
