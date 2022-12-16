import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import classNames from 'classnames'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { FormSelector } from '@/components/inputs/FormSelector'
import { TextArea } from '@/components/inputs/TextArea'
import { TextField } from '@/components/inputs/TextField'
import { trpc } from '@/utils/trpc'
import type { FormikHelpers } from 'formik'

interface Values {
  spaceSlug: string
  budgetBoxName: string
  name: string
  owner: string
  image: string
  url: string
  description: string
}

const options = ['Create a project']

export const ProjectRegistrationView = () => {
  const [selected, setSelected] = useState<number>(0)

  const { data: spaces, isSuccess: isSuccessSpaces } =
    trpc.space.getAll.useQuery()
  const { data: budgetBoxes, isSuccess: isSuccessBudgetBoxes } =
    trpc.budgetBox.getAll.useQuery()

  const insertOneProjectMutation = trpc.project.insertOne.useMutation()

  const spaceOptions = isSuccessSpaces ? spaces.map(({ slug }) => slug) : []
  spaceOptions.unshift('')

  const budgetBoxOptions = isSuccessBudgetBoxes
    ? budgetBoxes.map(({ title }) => title)
    : []
  budgetBoxOptions.unshift('')

  const validationSchemas = [
    Yup.object({
      spaceSlug: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      budgetBoxName: Yup.string().required(),
      name: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      owner: Yup.string().required('Required'),
      image: Yup.string().required('Required'),
      url: Yup.string()
        .matches(
          /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
          'Website should be a valid URL'
        )
        .required('Required'),
      description: Yup.string()
        .min(20, 'Must be 15 characters or less')
        .required('Required')
    })
  ]
  const validationSchema = validationSchemas[selected]

  const formList = [
    <>
      <FormSelector name="spaceSlug" options={spaceOptions} title="Space" />
      <FormSelector
        name="budgetBoxName"
        options={budgetBoxOptions}
        title="Budget Box"
      />
      <TextField name="name" title="Name" />
      <TextField name="owner" title="Owner" />
      <TextField maxLength={200} name="image" title="Image Link" />
      <TextField maxLength={200} name="url" title="Website" />
      <TextArea name="description" title="Description" />
    </>
  ]
  const CurrentForms = ({ index }: { index: number }) => formList[index] || null
  const handleChange = (indexChange: number) => {
    setSelected((prevSelected) => prevSelected + indexChange)
  }
  const handleSubmit = (
    { budgetBoxName, name, owner, image, url, description }: Values,
    { setSubmitting, setTouched }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const selectedBudgetBox = budgetBoxes
        ?.filter(({ title }) => budgetBoxName === title)
        .map(({ id }) => ({
          id
        }))

      insertOneProjectMutation.mutate({
        slug: '',
        owner,
        title: name,
        url,
        description,
        image,
        BudgetBoxes: selectedBudgetBox || []
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
      title="Create a project"
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          spaceSlug: '',
          budgetBoxName: '',
          name: '',
          owner: '',
          image: '',
          url: '',
          description: ''
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
