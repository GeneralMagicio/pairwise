import { Chain } from 'wagmi'

export type Network = {
  name: string
  chainId: number
  currency: string
  wagmiChain: Chain
}
