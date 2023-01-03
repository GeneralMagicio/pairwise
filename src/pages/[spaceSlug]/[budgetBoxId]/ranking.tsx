import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import superjson from 'superjson'
import Head from 'next/head'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/client'
import { RankingCard } from '@/components/cards/RankingCard'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import { NavArrow } from '@/components/navigation/NavArrow'
import type { InferGetStaticPropsType } from 'next'
import type { GetStaticPaths, GetStaticPropsContext } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const spaces = await prisma.space.findMany({
    include: {
      BudgetBoxes: true
    }
  })

  const params: Array<{
    params: { spaceSlug: string; budgetBoxId: string }
  }> = []
  spaces.map(({ BudgetBoxes, slug }) =>
    BudgetBoxes.map(({ id }) =>
      params.push({
        params: { spaceSlug: slug, budgetBoxId: id }
      })
    )
  )
  return {
    paths: params,
    fallback: 'blocking'
  }
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ budgetBoxId: string; spaceSlug: string }>
) => {
  const budgetBoxId = context.params?.budgetBoxId as string
  const spaceSlug = context.params?.spaceSlug as string
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson
  })

  await ssg.budgetBox.getRanking.prefetch({
    id: budgetBoxId
  })
  await ssg.budgetBox.getOne.prefetch({
    id: budgetBoxId
  })
  await ssg.space.getOneBySlug.prefetch({ slug: spaceSlug })

  return {
    props: {
      budgetBoxId,
      spaceSlug,
      trpcState: ssg.dehydrate()
    },
    revalidate: 1
  }
}

const RankingPage = ({
  budgetBoxId,
  spaceSlug
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    data: projects,
    isLoading: projectsLoading,
    isSuccess: projectsSuccess
  } = trpc.budgetBox.getRanking.useQuery({ id: budgetBoxId })
  const { data: budgetBox } = trpc.budgetBox.getOne.useQuery({
    id: budgetBoxId
  })
  const { data: space } = trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  const navArrowItems = [
    { name: 'Home', path: '/' },
    { name: space?.title, path: `/${spaceSlug}` },
    { name: budgetBox?.title, path: `/${spaceSlug}/${budgetBoxId}` },
    { name: 'Ranking', path: `/${spaceSlug}/${budgetBoxId}/ranking` }
  ]
  return (
    <>
      <Head>
        <title>{`${budgetBox?.title || ''} Ranking`}</title>
      </Head>
      {projects ? (
        <>
          <NavArrow items={navArrowItems} />
          <main>
            {projectsLoading ? (
              <LoadingIcon label="Loading" />
            ) : projectsSuccess ? (
              <RankingCard projects={projects} />
            ) : (
              <h2 className="text-center text-xl font-semibold text-red-600">
                An error occured, refresh the page and try again
              </h2>
            )}
          </main>
        </>
      ) : null}
    </>
  )
}

export default RankingPage
