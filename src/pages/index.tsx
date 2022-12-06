import { createProxySSGHelpers } from '@trpc/react-query/ssg'
import Head from 'next/head'
import superjson from '@/utils/superjson'
import { appRouter } from '@/server/trpc/router/_app'
import { trpc } from '@/utils/trpc'
import { BudgetBoxCard } from '@/components/cards/BudgetBoxCard'
import { prisma } from '@/server/db/client'

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { session: null, prisma },
    transformer: superjson
  })

  await ssg.budgetBox.getAll.prefetch()
  return {
    props: {
      trpcState: ssg.dehydrate()
    },
    revalidate: 60
  }
}

const Home = () => {
  const { data: budgetBoxes } = trpc.budgetBox.getAll.useQuery(undefined, {
    refetchOnWindowFocus: false
  })
  return (
    <div>
      <Head>
        <title>Budget Boxes</title>
      </Head>
      <main className="px-4 md:px-14">
        <div className="grid justify-items-center gap-y-8 px-4 pt-16 sm:px-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ">
          {budgetBoxes?.map((budgetBox) => (
            <BudgetBoxCard key={budgetBox.id} budgetBox={budgetBox} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home
