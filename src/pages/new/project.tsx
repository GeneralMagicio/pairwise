import Head from 'next/head'
import { ProjectRegistrationView } from '@/components/registration/ProjectRegistrationView'

export const NewProjectPage = () => {
  return (
    <>
      <Head>Create Project</Head>
      <ProjectRegistrationView />
    </>
  )
}

export default NewProjectPage
