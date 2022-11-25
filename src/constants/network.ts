import { chain } from 'wagmi'
import type { Network } from '@/types/network'

export const DEFAULT_NETWORK: Network = {
  name: 'Ethereum Mainnet',
  chainId: 1,
  currency: 'ETH',
  wagmiChain: chain.mainnet
}
