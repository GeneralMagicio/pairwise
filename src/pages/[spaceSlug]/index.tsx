import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import superjson from '@/utils/superjson'
import { appRouter } from 'server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from 'server/db/client'
import { BudgetBoxCard } from '@/components/cards/BudgetBoxCard'
import { SpaceHeroCard } from '@/components/cards/SpaceHeroCard'
import { Divider } from '@/components/general/Divider'
import { SearchInput } from '@/components/inputs/SearchInput'
import { CreateIcon } from '@/components/icons'
import { useSearchInput } from '@/hooks/useSearchInput'
import { textSearch } from '@/utils/helpers/textSearch'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { useModal } from '@/hooks/useModal'
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
  const [search, searchInputHandler] = useSearchInput()
  const router = useRouter()
  const { q } = router.query
  const { isModalOpen, closeModal } = useModal({
    dependency: q === 'success',
    onCloseModal: () => router.push(`/${spaceSlug}`)
  })

  const { data: budgetBoxes } = trpc.budgetBox.getManyBySpaceSlug.useQuery({
    slug: spaceSlug
  })
  const { data: space } = trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  return (
    <div>
      <Head>
        <title>{spaceSlug}</title>
      </Head>
      <SuccessModal
        closeModal={closeModal}
        isOpen={isModalOpen}
        title="Congratulations!"
      />
      {space ? (
        <main className="py-16">
          <div className="mx-auto max-w-[1100px]">
            <SpaceHeroCard
              categories={space.Categories}
              description={space.description}
              image={space.image}
              title={space.title}
            />
            <div className="mt-14 flex items-center justify-between">
              <SearchInput
                placeholder="Search boxes"
                value={search}
                onChange={searchInputHandler}
              />
              <Link
                className="flex items-center"
                href={`/${spaceSlug}/new/budget-box`}
              >
                <div className="grid h-7 w-7 place-content-center rounded-full bg-gradient-to-b from-blue-500 to-cyan-300 ">
                  <CreateIcon height={15} width={15} />
                </div>
                <h3 className="ml-2 text-gray-600">Create Budget Box</h3>
              </Link>
            </div>

            <Divider text="Now Voting" />
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {budgetBoxes
                ?.filter(({ title, description }) =>
                  textSearch(search, [title, description])
                )
                .map((budgetBox) => (
                  <BudgetBoxCard
                    key={budgetBox.id}
                    description={budgetBox.description}
                    id={budgetBox.id}
                    image={budgetBox.image}
                    spaceSlug={spaceSlug}
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
