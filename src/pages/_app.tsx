import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { Navbar } from '@/components/navigation/Navbar'
import { graphqlClient } from '@/graphql/clients/client'
import type { AppProps } from 'next/app'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY as string

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    infuraProvider({ apiKey: INFURA_API_KEY })
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Budget Boxes',
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={graphqlClient}>
      <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        
          <Navbar />
          <Component {...pageProps} />
        
      </RainbowKitProvider>
    </WagmiConfig>
    </ApolloProvider>
  )
}
