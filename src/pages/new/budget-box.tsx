import Head from 'next/head'
import { BudgetBoxRegistrationView } from '@/components/registration/BudgetBoxRegistrationView'

export const NewBudgetBoxPage = () => {
  return (
    <>
      <Head>Create Budget Box</Head>
      <BudgetBoxRegistrationView />
    </>
  )
}

export default NewBudgetBoxPage
