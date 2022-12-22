import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import { useRouter } from 'next/router'
import superjson from '@/utils/superjson'
import { appRouter } from 'server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from 'server/db/client'
import { BudgetBoxDetails } from '@/components/details/BudgetBoxDetails'
import { BudgetBoxInfoButtonCard } from '@/components/cards/BudgetBoxInfoButtonCard'
import { BudgetBoxInfoLiveCard } from '@/components/cards/BudgetBoxInfoLiveCard'
import { BudgetBoxInfoVotingCard } from '@/components/cards/BudgetBoxInfoVotingCard'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { useModal } from '@/hooks/useModal'
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

  await ssg.budgetBox.getOne.prefetch({ id: budgetBoxId })
  await ssg.project.getManyByBudgetBoxId.prefetch({ id: budgetBoxId })
  await ssg.budgetBox.getRanking.prefetch({ id: budgetBoxId })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      budgetBoxId,
      spaceSlug
    },
    revalidate: 60
  }
}

export const BudgetBoxDetailsPage = ({
  budgetBoxId,
  spaceSlug
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter()
  const { q } = router.query
  const { isModalOpen, closeModal } = useModal({
    dependency: q === 'success',
    onCloseModal: () => router.push(`/${spaceSlug}`)
  })
  const { data: budgetBox } = trpc.budgetBox.getOne.useQuery({
    id: budgetBoxId
  })
  const { data: projects } = trpc.project.getManyByBudgetBoxId.useQuery({
    id: budgetBoxId
  })
  const { data: ranking } = trpc.budgetBox.getRanking.useQuery({
    id: budgetBoxId
  })
  const topProjects = ranking?.slice(0, 3).map(({ power, title }) => ({
    power,
    title
  }))

  return (
    <div>
      <Head>
        <title>{budgetBox?.title}</title>
      </Head>
      <SuccessModal
        closeModal={closeModal}
        isOpen={isModalOpen}
        title="Congratulations!"
      />
      {budgetBox ? (
        <main className="py-16">
          <div className="mx-auto grid max-w-[1100px] grid-cols-3 gap-x-10">
            <BudgetBoxDetails
              className="col-span-2 w-[660px]"
              description={budgetBox.description}
              image={budgetBox.image}
              title={budgetBox.title}
            />
            <div className="col-span-1 grid gap-y-6">
              <BudgetBoxInfoButtonCard
                budgetBoxId={budgetBox.id}
                description={budgetBox.description}
                spaceSlug={spaceSlug}
                title="Information"
              />
              <BudgetBoxInfoLiveCard
                projectsCount={projects?.length || 0}
                title="Live project information"
                topProjects={topProjects}
              />
              <BudgetBoxInfoVotingCard
                allowanceMethod="Allowlist"
                endDate={budgetBox.endDate}
                startDate={budgetBox.startDate}
                title="Voting information"
              />
            </div>
          </div>
        </main>
      ) : null}
    </div>
  )
}

export default BudgetBoxDetailsPage
