import { Navbar } from '../navigation/Navbar'
import { Sidebar } from '@/components/navigation/Sidebar'
import type { ReactElement } from 'react'

interface IAppLayout {
  children: ReactElement
}

export const AppLayout = ({ children }: IAppLayout) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-full">
        <Navbar title="Welcome to Pairwise" />
        <main className="mx-auto w-full max-w-6xl py-12">{children}</main>
      </div>
    </div>
  )
}
