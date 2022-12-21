import Head from 'next/head'
import { ProjectImportView } from '@/components/registration/ProjectImportView'

export const NewProjectPage = () => {
  return (
    <>
      <Head>
        <title>Import Project</title>
      </Head>
      <ProjectImportView />
    </>
  )
}

export default NewProjectPage
