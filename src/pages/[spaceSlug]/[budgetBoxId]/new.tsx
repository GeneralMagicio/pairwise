import Head from 'next/head'
import { ProjectRegistrationView } from '@/components/registration/ProjectRegistrationView'

export const NewProjectPage = () => {
  return (
    <>
      <Head>
        <title>Create Project</title>
      </Head>
      <ProjectRegistrationView />
    </>
  )
}

export default NewProjectPage
