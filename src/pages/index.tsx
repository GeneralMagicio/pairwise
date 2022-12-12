import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import { useState } from 'react'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { SpaceCard } from '@/components/cards/SpaceCard'
import { prisma } from '@/server/db/client'
import { SearchInput } from '@/components/inputs/SearchInput'
import type { FormEvent } from 'react'
import type { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson
  })

  await ssg.space.getAll.prefetch()
  return {
    props: {
      trpcState: ssg.dehydrate()
    },
    revalidate: 60
  }
}

const Home: NextPage = () => {
  const [search, setSearch] = useState<string>('')
  const { data: spaces } = trpc.space.getAll.useQuery()

  const searchInputHandler = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault()
    setSearch((event.target as HTMLInputElement).value.toLowerCase())
  }

  return (
    <div>
      <Head>
        <title>Explore</title>
      </Head>
      <main className="flex w-full justify-center">
        <div className="mt-16 grid gap-y-4">
          <h1 className="text-2xl font-semibold">Explore Spaces</h1>
          <SearchInput
            placeholder="Search spaces"
            value={search}
            onChange={searchInputHandler}
          />
          <div className="grid w-[1200px] justify-items-center gap-y-8 gap-x-6 pt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {spaces
              ? spaces
                  .filter((space) =>
                    [space.title, space.description].some((item) =>
                      item.toLowerCase().includes(search)
                    )
                  )
                  .map((space) => (
                    <SpaceCard
                      key={space.id}
                      categories={space.Categories}
                      description={space.description}
                      img={space.image}
                      slug={space.slug}
                      title={space.title}
                    />
                  ))
              : null}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
