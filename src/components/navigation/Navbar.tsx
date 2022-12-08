import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'

export const Navbar: FC = () => {
  return (
    <nav className="sticky top-0 z-20 flex h-[100px] w-full items-center justify-end border-b bg-blue-50 pr-8 sm:pr-24">
      <ConnectButton />
    </nav>
  )
}
