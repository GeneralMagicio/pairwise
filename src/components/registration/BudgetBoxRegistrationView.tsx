import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { DatePicker } from '@/components/inputs/DatePicker'
import { TextArea } from '@/components/inputs/TextArea'
import { TextField } from '@/components/inputs/TextField'
import { trpc } from '@/utils/trpc'
import { useFormNavigation } from '@/hooks/useFormNavigation'
import { useSiwe } from '@/hooks/useSiwe'
import type { FormikHelpers } from 'formik'

const options = [
  'Setup your Budget Box information',
  'Configure the advanced parameters'
]

interface Values {
  name: string
  creatorAddress: string
  description: string
  startDate: Date
  endDate: Date
  maxVotesPerUser: number
  maxPairsPerVote: number
  dampingFactor: number
  allowlist: string
}

export const BudgetBoxRegistrationView = () => {
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const router = useRouter()
  const spaceSlug = router.query.spaceSlug as string
  const { address, signIn } = useSiwe()

  const insertOneBudgetBoxMutation = trpc.budgetBox.insertOne.useMutation()

  const initialValues = {
    name: '',
    creatorAddress: address || '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    maxVotesPerUser: 1,
    maxPairsPerVote: 20,
    dampingFactor: 0.8,
    allowlist: ''
  }

  const validationSchemas = [
    Yup.object({
      name: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      creatorAddress: Yup.string().min(42).required('Required'),
      description: Yup.string()
        .min(20, 'Must be 20 characters or more')
        .required('Required')
    }),
    Yup.object({
      startDate: Yup.date()
        .typeError('You have to define a start date')
        .min(new Date(), "Start date can't be in the past")
        .required('Required'),
      endDate: Yup.date()
        .typeError('You have to define an end date')
        .min(new Date(), "End date can't be in the past")
        .test(
          'endDate greater than start date',
          'The end date can be sooner than the start date',
          (value, context) => (value ? value > context.parent.startDate : false)
        )
        .required('Required')
    })
  ]

  const formList = [
    <>
      <TextField name="name" title="Name" />
      <TextField
        disabled={true}
        name="creatorAddress"
        title="Creator Address"
        value={address}
      />
      <TextArea name="description" title="Description" />
    </>,
    <>
      <div className="flex justify-between gap-x-8">
        <TextField
          className="grow"
          name="maxVotesPerUser"
          title="Max votes per user"
        />
        <TextField
          className="grow"
          name="maxPairsPerVote"
          title="Max pairs per vote"
          type="number"
        />
        <TextField
          className="grow"
          name="dampingFactor"
          title="Damping Factor"
          type="number"
        />
      </div>
      <div className="flex justify-between gap-x-14">
        <DatePicker className="grow" name="startDate" title="Start Date" />
        <DatePicker className="grow" name="endDate" title="End Date" />
      </div>
      <TextArea
        name="allowlist"
        title="Allowlist (add comma separated addresses)"
      />
    </>
  ]
  const CurrentForms = ({ index }: { index: number }) => formList[index] || null

  const handleSubmit = async (
    {
      name,
      creatorAddress,
      description,
      startDate,
      endDate,
      dampingFactor,
      allowlist
    }: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const signSuccess = await signIn()
      if (signSuccess && address) {
        insertOneBudgetBoxMutation.mutate({
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          creator: creatorAddress,
          title: name,
          image:
            'https://user-images.githubusercontent.com/18421017/206027384-4869ad77-e635-4525-a5e8-e88eb8a5b206.png',
          description,
          dampingFactor,
          allowlist: allowlist.split(','),
          spaceSlug
        })
        setSubmitting(false)
      }
    } else {
      setSubmitting(false)
      setSelected((prevSelected) => prevSelected + 1)
    }
  }

  return (
    <RegistrationLayout
      handleNavigation={handleNavigation}
      handleSubmit={handleSubmit}
      initialValues={initialValues}
      options={options}
      selected={selected}
      title="Create your Budget Box"
      validationSchemas={validationSchemas}
    >
      <CurrentForms index={selected} />
    </RegistrationLayout>
  )
}
