import Head from 'next/head'
import { BudgetBoxRegistrationView } from '@/components/registration/BudgetBoxRegistrationView'

export const NewBudgetBoxPage = () => {
  return (
    <>
      <Head>Create Pairwise</Head>
      <BudgetBoxRegistrationView />
    </>
  )
}

export default NewBudgetBoxPage
