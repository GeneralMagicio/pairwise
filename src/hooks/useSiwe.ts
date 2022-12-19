import { useEffect, useState } from 'react'
import { useAccount, useNetwork, useSignMessage, useSwitchNetwork } from 'wagmi'
import { SiweMessage } from 'siwe'
import axios from 'axios'
import { DEFAULT_NETWORK } from '@/constants/network'

export const useSiwe = () => {
  const [nonce, setNonce] = useState<string | undefined>('')
  const [isSignLoading, setIsSignLoading] = useState<boolean>(false)
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false)

  const { chain: activeChain } = useNetwork()

  const { address } = useAccount()
  const { isLoading: isSwitchNetworkLoading, switchNetworkAsync } =
    useSwitchNetwork()
  const { signMessageAsync } = useSignMessage()

  const fetchNonce = async () => {
    const nonceRes = await axios.get('/api/siwe/nonce')
    setNonce(nonceRes?.data || '')
  }

  const signIn = async () => {
    try {
      const chainId = activeChain?.id
      if (!address || !chainId) return
      if (chainId !== DEFAULT_NETWORK.chainId) {
        await switchNetworkAsync?.(DEFAULT_NETWORK.chainId)
      }
      setIsSignLoading(true)
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to Budget Boxes',
        uri: window.location.origin,
        version: '1',
        chainId: DEFAULT_NETWORK.chainId,
        nonce
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage()
      })
      const { data: verifyData } = await axios.post('/api/siwe/verify', {
        message,
        signature
      })
      setIsSignLoading(false)

      return verifyData?.ok
    } catch (e) {
      setIsSignLoading(false)
      setNonce(undefined)
      fetchNonce()

      return false
    }
  }

  useEffect(() => {
    fetchNonce()
  }, [])

  useEffect(() => {
    setIsWrongNetwork(activeChain?.id !== DEFAULT_NETWORK.chainId)
  }, [activeChain])

  return {
    address,
    isSignLoading,
    isSwitchNetworkLoading,
    isWrongNetwork,
    signIn
  }
}
