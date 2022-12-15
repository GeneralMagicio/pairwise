import Head from 'next/head'
import { trpc } from '@/utils/trpc'
import { SpaceRegistrationView } from '@/components/registration/SpaceRegistrationView'

const SpacePage = () => {
  const { data: categories } = trpc.categoryRouter.getAll.useQuery()

  const categoryOptions = categories?.map(({ category }) => category)

  return (
    <>
      <Head>
        <title>Create Space</title>
      </Head>
      <SpaceRegistrationView categoryOptions={categoryOptions || []} />
    </>
  )
}

export default SpacePage
