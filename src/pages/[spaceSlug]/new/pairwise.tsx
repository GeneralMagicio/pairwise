import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import { BudgetBoxRegistrationView } from '@/components/registration/BudgetBoxRegistrationView'
import { NavArrow } from '@/components/navigation/NavArrow'
import { prisma } from '@/server/db/client'
import { appRouter } from '@/server/trpc/router/_app'
import superjson from '@/utils/superjson'

import { trpc } from '@/utils/trpc'
import type {
  InferGetStaticPropsType,
  GetStaticPaths,
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

  return {
    props: {
      trpcState: ssg.dehydrate(),
      spaceSlug
    }
  }
}

export const NewBudgetBoxPage = ({
  spaceSlug
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: space } = trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  const navArrowItems = [
    { name: 'Home', path: '/' },
    { name: space?.title, path: `/${spaceSlug}` },
    { name: 'New Pairwise', path: `/${spaceSlug}/new/pairwise` }
  ]
  return (
    <>
      <Head>
        <title>Create Pairwise</title>
      </Head>
      <NavArrow items={navArrowItems} />
      <BudgetBoxRegistrationView />
    </>
  )
}

export default NewBudgetBoxPage
