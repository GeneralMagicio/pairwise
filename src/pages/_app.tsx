import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { AppLayout } from '@/components/layouts/AppLayout'
import { graphqlClient } from '@/api/clients/graphql'
import { wagmiClient, chains } from '@/api/clients/wagmi'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={graphqlClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  )
}
