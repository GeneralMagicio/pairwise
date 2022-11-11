import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import { graphqlClient } from '@/graphql/clients/client'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={graphqlClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
