import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import { useRouter } from 'next/router'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { prisma } from '@/server/db/client'
import { BudgetBoxCard } from '@/components/cards/BudgetBoxCard'
import { SpaceHeroCard } from '@/components/cards/SpaceHeroCard'
import { Divider } from '@/components/general/Divider'
import { SearchInput } from '@/components/inputs/SearchInput'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { NavArrow } from '@/components/navigation/NavArrow'
import { useSearchInput } from '@/hooks/useSearchInput'
import { textSearch } from '@/utils/helpers/textSearch'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { useModal } from '@/hooks/useModal'
import { useShowAll } from '@/hooks/useShowAll'
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
  const { showAll, setShowAll, maxItems } = useShowAll(6)
  const { search, searchInputHandler } = useSearchInput()
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
  const navArrowItems = [
    { name: 'Home', path: '/' },
    { name: space?.title || '', path: router.asPath }
  ]

  return (
    <div>
      <Head>
        <title>{space?.title}</title>
      </Head>
      <SuccessModal
        closeModal={closeModal}
        isOpen={isModalOpen}
        title="Congratulations!"
        description="You have successfully registered your space. Proceed to
          creating a pairwise for your space."
      />
      <NavArrow items={navArrowItems} />
      {space ? (
        <main className="mx-auto flex flex-col justify-center">
          <SpaceHeroCard
            categories={space.Categories}
            description={space.description}
            image={space.image}
            slug={space.slug}
            title={space.title}
          />
          <div className="mt-14 flex items-center justify-between">
            <SearchInput
              placeholder="Search boxes"
              value={search}
              onChange={searchInputHandler}
            />
          </div>
          <Divider text="Now Voting" />
          <div className="mt-10 grid justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
            {budgetBoxes
              ?.filter(({ title, description }) =>
                textSearch(search, [title, description])
              )
              .slice(0, showAll ? budgetBoxes.length : maxItems)
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
          {!showAll && budgetBoxes && budgetBoxes.length > maxItems ? (
            <PrimaryButton
              color={ButtonColors.BLUE_GRADIENT}
              fontStyles="font-medium"
              label="Show More"
              styles="w-[60px] h-[52px] mt-14 mx-auto"
              onClick={() => setShowAll(true)}
            />
          ) : null}
        </main>
      ) : null}
    </div>
  )
}

export default SpaceDetails
