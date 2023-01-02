import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { SpaceCard } from '@/components/cards/SpaceCard'
import { prisma } from '@/server/db/client'
import { useSearchInput } from '@/hooks/useSearchInput'
import { textSearch } from '@/utils/helpers/textSearch'
import { SearchInputWithSelector } from '@/components/inputs/SearchInputWithSelector'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { useSelector } from '@/hooks/useSelector'
import { useShowAll } from '@/hooks/useShowAll'
import type { GetStaticProps, NextPage } from 'next'

export const getStaticProps: GetStaticProps = async () => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson
  })

  await ssg.space.getAll.prefetch()
  await ssg.category.getAll.prefetch()

  return {
    props: {
      trpcState: ssg.dehydrate()
    },
    revalidate: 60
  }
}

const Home: NextPage = () => {
  const { data: spaces } = trpc.space.getAll.useQuery()
  const { data: categories } = trpc.category.getAll.useQuery()
  const selectCategories = [
    'All Categories',
    ...(categories?.map(({ category }) => category) || [])
  ]

  const { showAll, setShowAll, maxItems } = useShowAll()
  const { search, searchInputHandler } = useSearchInput()
  const { selected, handleSelect } = useSelector(
    selectCategories,
    'All Categories'
  )

  return (
    <>
      <Head>
        <title>Explore</title>
      </Head>
      <main className="mx-auto mt-8 grid gap-y-4">
        <div className="pl-10">
          <h1 className="mb-3 text-2xl font-semibold">Explore Spaces</h1>
          <SearchInputWithSelector
            handleSelect={handleSelect}
            options={selectCategories}
            placeholder="Search spaces"
            selected={selected}
            value={search}
            onChange={searchInputHandler}
          />
        </div>

        <div className="mx-auto grid justify-items-center gap-6 pt-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {spaces
            ? spaces
                .filter(({ title, description }) =>
                  textSearch(search, [title, description])
                )
                .filter(({ Categories }) =>
                  Categories.some(
                    ({ category }) =>
                      selected == 'All Categories' || category == selected
                  )
                )
                .slice(0, showAll ? spaces.length : maxItems)
                .map((space) => (
                  <SpaceCard
                    key={space.id}
                    categories={space.Categories}
                    description={space.description}
                    img={space.image}
                    slug={space.slug}
                    title={space.title}
                  />
                ))
            : null}
        </div>
        {!showAll && spaces && spaces.length > maxItems ? (
          <PrimaryButton
            color={ButtonColors.BLUE_GRADIENT}
            fontStyles="font-medium"
            label="Show More"
            styles="w-fit h-[45px] mt-4 mx-auto"
            onClick={() => setShowAll(true)}
          />
        ) : null}
      </main>
    </>
  )
}

export default Home
