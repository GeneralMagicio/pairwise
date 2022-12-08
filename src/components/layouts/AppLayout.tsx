import { Navbar } from '../navigation/Navbar'
import { Sidebar } from '@/components/navigation/Sidebar'
import type { ReactElement } from 'react'

interface IAppLayout {
  children: ReactElement
}

export const AppLayout = ({ children }: IAppLayout) => {
  return (
    <div className="bg-gray-100">
      <Sidebar>
        <>
          <Navbar />
          {children}
        </>
      </Sidebar>
    </div>
  )
}
