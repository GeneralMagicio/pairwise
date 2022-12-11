import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import superjson from 'superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/client'
import { RankingCard } from '@/components/cards/RankingCard'
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

  return {
    props: {
      id,
      trpcState: ssg.dehydrate()
    },
    revalidate: 1
  }
}

const Ranking = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { data: projects } = trpc.budgetBox.getRanking.useQuery({ id })
  return (
    <div className="flex min-h-[calc(100vh_-_100px)] flex-col items-center justify-center gap-y-4 px-8 pt-16 pb-10">
      {projects?.map((project) => (
        <RankingCard
          key={project.id}
          description={project.description as string}
          image={project.image as string}
          owner={project.owner as string}
          power={project.power}
          title={project.title as string}
          url={project.url as string}
        />
      ))}
    </div>
  )
}

export default Ranking
