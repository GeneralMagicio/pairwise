import type { FC } from 'react'

interface IDivider {
  text: string
}

export const Divider: FC<IDivider> = ({ text }) => {
  return (
    <>
      <h3 className="mt-8 text-2xl font-bold">{text}</h3>
      <div className="mt-1 flex items-center">
        <hr className="h-[2px] w-6 rounded-full border-0 bg-black" />
        <hr className="grow" />
      </div>
    </>
  )
}
