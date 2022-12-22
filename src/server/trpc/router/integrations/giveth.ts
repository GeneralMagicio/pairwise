import { z } from 'zod'
import { gql, GraphQLClient } from 'graphql-request'
import { router, publicProcedure } from '@/server/trpc/trpc'

const getQuery = (slug: string) => {
  return gql`
  {
    projectBySlug(slug: "${slug}") {
      slug
      title
      image
      description
      adminUser {
        name
      }
    }
  }
`
}

const GivethGraphQLClient = new GraphQLClient(
  'https://mainnet.serve.giveth.io/graphql'
)

export const givethRouter = router({
  getOneProjectBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({ input }) => {
      console.log('test')
      const { slug } = input
      try {
        const response = await GivethGraphQLClient.request(getQuery(slug))
        console.log({ response })
        const { title, adminUser, description, image } = response.projectBySlug
        return { title, owner: adminUser.name, description, image }
      } catch (e) {
        console.log(e)
        return {}
      }
    })
})
