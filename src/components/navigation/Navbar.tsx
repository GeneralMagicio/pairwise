import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'

export const Navbar: FC = () => {
  return (
    <nav className="sticky top-0 z-20 flex h-[110px] w-full items-center justify-between bg-white px-12 shadow-md">
      <Link href="/">
        <div className="cursor-pointer text-xl font-semibold">
          <span className="hidden sm:block">Budget Boxes</span>
          <span className="sm:hidden">BB</span>
        </div>
      </Link>
      <ConnectButton />
    </nav>
  )
}
