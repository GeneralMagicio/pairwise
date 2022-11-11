import { ApolloClient, InMemoryCache } from '@apollo/client'

const GRAPHQL_URI = process.env.GRAPHQL_URI as string
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY as string

export const graphqlClient = new ApolloClient({
  uri: GRAPHQL_URI,
  headers: {
    apiKey: GRAPHQL_API_KEY
  },
  cache: new InMemoryCache()
})
