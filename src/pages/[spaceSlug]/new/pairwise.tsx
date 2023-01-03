import Head from 'next/head'
import { BudgetBoxRegistrationView } from '@/components/registration/BudgetBoxRegistrationView'

export const NewBudgetBoxPage = () => {
  return (
    <>
      <Head>
        <title>Create Pairwise</title>
      </Head>
      <BudgetBoxRegistrationView />
    </>
  )
}

export default NewBudgetBoxPage
