import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import { graphqlClient } from '@/graphql/clients/client'
import { Navbar } from '@/components/navigation/Navbar'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={graphqlClient}>
      <Navbar />
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
