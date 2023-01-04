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

interface IProject {
  title: string
  adminUser: { name: string }
  description: string
  image: string
}

export const givethRouter = router({
  getOneProjectBySlug: publicProcedure
    .input(
      z.object({
        slug: z.string()
      })
    )
    .query(async ({ input }) => {
      const { slug } = input
      try {
        const response = await GivethGraphQLClient.request(getQuery(slug))
        const { title, adminUser, description, image } = response.projectBySlug
        return {
          title,
          owner: adminUser.name,
          url: `https://giveth.io/project/${slug}`,
          description,
          image
        }
      } catch (e) {
        console.log(e)
        return {}
      }
    }),
  getManyProjectsBySlug: publicProcedure
    .input(
      z.object({
        slugs: z.string().array()
      })
    )
    .query(async ({ input }) => {
      const { slugs } = input
      try {
        const promiseList = Promise.allSettled(
          slugs.map((slug) => GivethGraphQLClient.request(getQuery(slug)))
        )
        const responses = await promiseList
        const data: Array<IProject> = []
        responses.forEach((response) =>
          response.status === 'fulfilled'
            ? data.push({
                ...response.value.projectBySlug,
                url: `https://giveth.io/project/${response.value.projectBySlug.slug}`
              })
            : null
        )
        return data
      } catch (e) {
        console.log(e)
        return null
      }
    })
})
