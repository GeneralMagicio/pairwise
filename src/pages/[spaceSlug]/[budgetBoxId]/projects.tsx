import Head from 'next/head'
import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { prisma } from '@/server/db/client'
import { trpc } from '@/utils/trpc'
import { NavArrow } from '@/components/navigation/NavArrow'
import { SearchInput } from '@/components/inputs/SearchInput'
import { ProjectCard } from '@/components/cards/ProjectCard'
import { Divider } from '@/components/general/Divider'
import { useSearchInput } from '@/hooks/useSearchInput'
import { textSearch } from '@/utils/helpers/textSearch'
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

  const budgetBoxId = context.params?.budgetBoxId as string
  const spaceSlug = context.params?.spaceSlug as string

  await ssg.project.getManyByBudgetBoxId.prefetch({ id: budgetBoxId })
  await ssg.space.getOneBySlug.prefetch({ slug: spaceSlug })
  await ssg.budgetBox.getOne.prefetch({ id: budgetBoxId })

  return {
    props: {
      budgetBoxId,
      spaceSlug,
      trpcState: ssg.dehydrate()
    },
    revalidate: 60
  }
}

export const ProjectsPage = ({
  budgetBoxId,
  spaceSlug
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { search, searchInputHandler } = useSearchInput()
  const { data: projects } = trpc.project.getManyByBudgetBoxId.useQuery({
    id: budgetBoxId
  })
  const { data: budgetBox } = trpc.budgetBox.getOne.useQuery({
    id: budgetBoxId
  })
  const { data: space } = trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  const navArrowItems = [
    { name: 'Home', path: '/' },
    { name: space?.title || '', path: `/${spaceSlug}` },
    { name: budgetBox?.title || '', path: `/${spaceSlug}/${budgetBoxId}` },
    { name: 'Projects', path: `/${spaceSlug}/${budgetBoxId}/projects` }
  ]

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      {projects ? (
        <>
          <NavArrow items={navArrowItems} />
          <main>
            <SearchInput
              className="mt-8"
              placeholder="Search Projects"
              value={search}
              onChange={searchInputHandler}
            />
            <div className="mt-12">
              <Divider text="All Projects" />
            </div>
            <div className="mt-7 grid grid-cols-3 place-items-center gap-8">
              {projects
                .filter(({ description, owner, title }) =>
                  textSearch(search, [description, owner, title])
                )
                .map(({ id, description, owner, title, image, url }) => (
                  <ProjectCard
                    key={id}
                    description={description || ''}
                    image={image || ''}
                    owner={owner || ''}
                    title={title}
                    url={url || ''}
                    voteMode={false}
                  />
                ))}
            </div>
          </main>
        </>
      ) : null}
    </>
  )
}

export default ProjectsPage
