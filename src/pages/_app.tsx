import { trpc } from '../utils/trpc'
import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { AppLayout } from '@/components/layouts/AppLayout'
import { wagmiClient, chains } from '@/api/clients/wagmi'
import '@rainbow-me/rainbowkit/styles.css'
import '../styles/globals.css'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <SessionProvider session={session}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </RainbowKitProvider>
      </WagmiConfig>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)
