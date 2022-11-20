import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createClient } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { DEFAULT_NETWORK } from '@/constants/network'

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string
const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY as string

export const { chains, provider, webSocketProvider } = configureChains(
  [DEFAULT_NETWORK.wagmiChain],
  [
    alchemyProvider({ apiKey: ALCHEMY_API_KEY }),
    infuraProvider({ apiKey: INFURA_API_KEY })
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Budget Boxes',
  chains
})

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
})
