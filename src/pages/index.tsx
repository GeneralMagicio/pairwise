import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { SpaceCard } from '@/components/cards/SpaceCard'
import { prisma } from '@/server/db/client'
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
  const { data: spaces } = trpc.space.getAll.useQuery()
  return (
    <div>
      <Head>
        <title>Explore</title>
      </Head>
      <main className="w-full px-4 sm:px-8 md:px-12 lg:px-32">
        <div className="grid justify-items-center gap-y-8 px-4 pt-16 sm:grid-cols-2 sm:px-0 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
          {spaces
            ? spaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  categories={space.Categories}
                  img={space.image}
                  slug={space.slug}
                  title={space.title}
                />
              ))
            : null}
        </div>
      </main>
    </div>
  )
}

export default Home
