import Head from 'next/head'
import { SpaceRegistrationView } from '@/components/registration/SpaceRegistrationView'

const NewSpacePage = () => {
  return (
    <>
      <Head>
        <title>Create Space</title>
      </Head>
      <SpaceRegistrationView />
    </>
  )
}

export default NewSpacePage
