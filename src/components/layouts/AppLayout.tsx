import { Navbar } from '@/components/navigation/Navbar'
import type { ReactElement } from 'react'

interface IAppLayout {
  children: ReactElement
}

export const AppLayout = ({ children }: IAppLayout) => {
  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh_-_110px)] bg-gray-50">{children}</div>
    </>
  )
}
