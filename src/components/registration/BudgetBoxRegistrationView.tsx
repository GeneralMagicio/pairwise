import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import { useAccount } from 'wagmi'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { FormSelector } from '@/components/inputs/FormSelector'
import { DatePicker } from '@/components/inputs/DatePicker'
import { TextArea } from '@/components/inputs/TextArea'
import { TextField } from '@/components/inputs/TextField'
import { trpc } from '@/utils/trpc'
import type { FormikHelpers } from 'formik'

const options = [
  'Setup your Budget Box information',
  'Configure the advanced parameters'
]

interface Values {
  spaceSlug: string
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
  const [selected, setSelected] = useState<number>(0)
  const { address } = useAccount()

  const { data: spaces, isSuccess } = trpc.space.getAll.useQuery()
  const insertOneBudgetBoxMutation = trpc.budgetBox.insertOne.useMutation()

  const spaceOptions = isSuccess ? spaces.map((space) => space.slug) : []
  spaceOptions.unshift('')

  const validationSchemas = [
    Yup.object({
      spaceSlug: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
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
  const validationSchema = validationSchemas[selected]

  const formList = [
    <>
      <FormSelector name="spaceSlug" options={spaceOptions} title="Space" />
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
  const handleChange = (indexChange: number) => {
    setSelected((prevSelected) => prevSelected + indexChange)
  }
  const handleSubmit = (
    {
      spaceSlug,
      name,
      creatorAddress,
      description,
      startDate,
      endDate,
      dampingFactor,
      allowlist
    }: Values,
    { setSubmitting, setTouched }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
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
    } else {
      setTouched({})
      setSubmitting(false)
      setSelected((prevSelected) => prevSelected + 1)
    }
  }

  return (
    <RegistrationLayout
      options={options}
      selected={selected}
      title="Create your Budget Box"
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          spaceSlug: '',
          name: '',
          creatorAddress: address || '',
          description: '',
          startDate: new Date(),
          endDate: new Date(),
          maxVotesPerUser: 1,
          maxPairsPerVote: 20,
          dampingFactor: 0.8,
          allowlist: ''
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <CurrentForms index={selected} />
            <div className="mt-10 flex justify-between">
              <PrimaryButton
                color={ButtonColors.BLUE_GRADIENT}
                fontStyles="font-medium"
                label="Previous"
                styles={classNames(
                  'w-32 h-12',
                  selected === 0 ? 'invisible' : ''
                )}
                onClick={() => handleChange(-1)}
              />
              <PrimaryButton
                color={ButtonColors.BLUE_GRADIENT}
                disabled={isSubmitting}
                fontStyles="font-medium"
                styles="w-32 h-12"
                type="submit"
                label={
                  isSubmitting
                    ? 'Submitting'
                    : selected === options.length - 1
                    ? 'Register'
                    : 'Next'
                }
              />
            </div>
          </Form>
        )}
      </Formik>
    </RegistrationLayout>
  )
}
