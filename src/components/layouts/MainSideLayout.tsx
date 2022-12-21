import type { ReactElement } from 'react'

interface IMainSideLayout {
  main: ReactElement
  side: ReactElement
}

export const MainSideLayout = ({ main, side }: IMainSideLayout) => {
  return (
    <article className="mx-auto grid max-w-[1100px] grid-cols-3 gap-x-10">
      <main className="col-span-2">{main}</main>
      <aside className="col-span-1 grid gap-y-6">{side}</aside>
    </article>
  )
}
