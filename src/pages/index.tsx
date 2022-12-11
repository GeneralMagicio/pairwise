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
      <main className="flex w-full  justify-center">
        <div className="grid justify-items-center gap-y-8 gap-x-6  pt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {spaces
            ? spaces.map((space) => (
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
      </main>
    </div>
  )
}

export default Home
