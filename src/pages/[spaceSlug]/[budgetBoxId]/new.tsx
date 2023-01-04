import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/client'
import { NavArrow } from '@/components/navigation/NavArrow'
import { ProjectRegistrationView } from '@/components/registration/ProjectRegistrationView'
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType
} from 'next'

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
  context: GetStaticPropsContext<{ spaceSlug: string; budgetBoxId: string }>
) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson
  })
  const spaceSlug = context.params?.spaceSlug as string
  const budgetBoxId = context.params?.budgetBoxId as string

  await ssg.space.getOneBySlug.prefetch({ slug: spaceSlug })
  await ssg.budgetBox.getOne.prefetch({ id: budgetBoxId })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      budgetBoxId,
      spaceSlug
    },
    revalidate: 60
  }
}

export const NewProjectPage = ({
  budgetBoxId,
  spaceSlug
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: space } = trpc.space.getOneBySlug.useQuery({
    slug: spaceSlug
  })
  const { data: budgetBox } = trpc.budgetBox.getOne.useQuery({
    id: budgetBoxId
  })

  const navArrowItems = [
    { name: 'Home', path: '/' },
    { name: space?.title, path: `/${spaceSlug}` },
    { name: budgetBox?.title, path: `/${spaceSlug}/${budgetBoxId}` },
    { name: 'New Project', path: `/${spaceSlug}/${budgetBoxId}/new` }
  ]

  return (
    <>
      <Head>
        <title>Create Project</title>
      </Head>
      <NavArrow items={navArrowItems} />
      <ProjectRegistrationView />
    </>
  )
}

export default NewProjectPage
