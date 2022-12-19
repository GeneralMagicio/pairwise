import * as Yup from 'yup'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { FormSelector } from '@/components/inputs/FormSelector'
import { TextArea } from '@/components/inputs/TextArea'
import { TextField } from '@/components/inputs/TextField'
import { trpc } from '@/utils/trpc'
import { useFormNavigation } from '@/hooks/useFormNavigation'
import { useSiwe } from '@/hooks/useSiwe'
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
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const { address, signIn } = useSiwe()

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

  const initialValues = {
    spaceSlug: '',
    budgetBoxName: '',
    name: '',
    owner: '',
    image: '',
    url: '',
    description: ''
  }

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

  const handleSubmit = async (
    { budgetBoxName, name, owner, image, url, description }: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const signSuccess = await signIn()

      if (signSuccess && address) {
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
      }
    } else {
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
      title="Create a project"
      validationSchemas={validationSchemas}
    >
      <CurrentForms index={selected} />
    </RegistrationLayout>
  )
}
