import { FC } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Navbar: FC = () => {
  return (
    <nav className="absolute top-0 flex h-28 w-full items-center justify-between bg-white px-12 shadow-md">
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
