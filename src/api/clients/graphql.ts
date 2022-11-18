import * as Realm from 'realm-web'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const GRAPHQL_URI = process.env.NEXT_PUBLIC_GRAPHQL_URI as string
const GRAPHQL_APP_ID = process.env.NEXT_PUBLIC_GRAPHQL_APP_ID as string

const app = new Realm.App(GRAPHQL_APP_ID)
async function getValidAccessToken() {
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous())
  } else {
    await app.currentUser.refreshAccessToken()
  }
  return app.currentUser?.accessToken
}

export const graphqlClient = new ApolloClient({
  link: new HttpLink({
    uri: GRAPHQL_URI,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken()
      if (options) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`
        }
        return fetch(uri, options)
      }

      return fetch(uri, { headers: { Authorization: `Bearer ${accessToken}` } })
    }
  }),
  cache: new InMemoryCache()
})
