import type { ReactElement } from 'react'

interface IRegistrationMain {
  children: ReactElement
  handleChange: (indexChange: number) => void
}

export const RegistrationMain = ({ children }: IRegistrationMain) => {
  return (
    <section className="flex h-full min-h-fit w-full flex-col justify-between rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        Create your Space
      </h2>
      {children}
    </section>
  )
}
