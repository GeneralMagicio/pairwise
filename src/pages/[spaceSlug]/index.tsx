import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/client'
import { BudgetBoxCard } from '@/components/cards/BudgetBoxCard'
import { SpaceHeroCard } from '@/components/cards/SpaceHeroCard'
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
  await ssg.space.getOneBySlug.prefetch({ slug: spaceSlug })
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
  const { data: space } = trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  return (
    <div>
      <Head>
        <title>{spaceSlug}</title>
      </Head>
      {space ? (
        <main className="py-16">
          <div className="mx-auto w-[1100px]">
            <SpaceHeroCard
              categories={space.Categories}
              description={space.description}
              image={space.image}
              title={space.title}
            />
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </main>
      ) : null}
    </div>
  )
}

export default SpaceDetails
