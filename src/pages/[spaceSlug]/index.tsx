import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/client'
import { BudgetBoxCard } from '@/components/cards/BudgetBoxCard'
import type {
  GetStaticPaths,
  InferGetStaticPropsType,
  GetStaticPropsContext
} from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const spaces = await prisma.space.findMany()
  return {
    paths: spaces.map(({ slug }) => ({
      params: { spaceSlug: slug }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ spaceSlug: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson
  })
  const spaceSlug = context.params?.spaceSlug as string
  await ssg.budgetBox.getManyBySpaceSlug.prefetch({ slug: spaceSlug })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      spaceSlug
    },
    revalidate: 60
  }
}

const SpaceDetails = ({
  spaceSlug
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: budgetBoxes } = trpc.budgetBox.getManyBySpaceSlug.useQuery({
    slug: spaceSlug
  })

  return (
    <div>
      <Head>
        <title>{spaceSlug}</title>
      </Head>
      <main className="px-4 md:px-14">
        <div className="grid justify-items-center gap-y-8 px-4 pt-16 sm:px-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
          {budgetBoxes?.map((budgetBox) => (
            <BudgetBoxCard
              key={budgetBox.id}
              description={budgetBox.description}
              id={budgetBox.id}
              image={budgetBox.image}
              startDate={budgetBox.startDate}
              title={budgetBox.title}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default SpaceDetails
