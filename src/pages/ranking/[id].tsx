import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import superjson from 'superjson'
import Head from 'next/head'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/client'
import { RankingCard } from '@/components/cards/RankingCard'
import { LoadingIcon } from '@/components/icons/LoadingIcon'
import type { InferGetStaticPropsType } from 'next'
import type { GetStaticPaths, GetStaticPropsContext } from 'next'

export const getStaticPaths: GetStaticPaths = async () => {
  const budgetBoxes = await prisma.budgetBox.findMany({
    select: {
      id: true
    }
  })
  return {
    paths: budgetBoxes.map(({ id }) => ({
      params: { id }
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps = async (
  context: GetStaticPropsContext<{ id: string }>
) => {
  const id = context.params?.id as string
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson
  })

  await ssg.budgetBox.getRanking.prefetch({
    id
  })
  await ssg.budgetBox.getOne.prefetch({
    id
  })

  return {
    props: {
      id,
      trpcState: ssg.dehydrate()
    },
    revalidate: 1
  }
}

const RankingPage = ({
  id
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const {
    data: projects,
    isLoading: projectsLoading,
    isSuccess: projectsSuccess
  } = trpc.budgetBox.getRanking.useQuery({
    id: 'dsdsddsdsd'
  })
  const { data: budgetBox } = trpc.budgetBox.getOne.useQuery({ id })

  return (
    <>
      <Head>
        <title>{`${budgetBox?.title || ''} Ranking`}</title>
      </Head>
      {projectsLoading ? (
        <LoadingIcon label="Loading" />
      ) : projectsSuccess ? (
        <RankingCard projects={projects} />
      ) : (
        <h2 className="text-center text-xl font-semibold text-red-600">
          An error occured, refresh the page and try again
        </h2>
      )}
    </>
  )
}

export default RankingPage
