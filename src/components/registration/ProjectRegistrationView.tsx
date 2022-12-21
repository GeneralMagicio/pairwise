import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { TextArea } from '@/components/inputs/TextArea'
import { TextField } from '@/components/inputs/TextField'
import { LoadingModal } from '@/components/modals/LoadingModal'
import { useModal } from '@/hooks/useModal'
import { trpc } from '@/utils/trpc'
import { useFormNavigation } from '@/hooks/useFormNavigation'
import { useSiwe } from '@/hooks/useSiwe'
import type { FormikHelpers } from 'formik'

interface Values {
  name: string
  owner: string
  image: string
  url: string
  description: string
}

const options = ['Create a project']

export const ProjectRegistrationView = () => {
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const router = useRouter()
  const budgetBoxId = router.query.budgetBoxId as string
  const spaceSlug = router.query.spaceSlug as string
  const { isModalOpen, setIsModalOpen } = useModal({})
  const { address, signIn } = useSiwe()

  const { data: space, isSuccess: isSuccessSpace } =
    trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  const insertOneProjectMutation = trpc.project.insertOne.useMutation({
    onSettled: (data, error) => {
      if (!error) {
        router.push({
          pathname: `/${spaceSlug}/${budgetBoxId}`,
          query: { q: 'success' }
        })
      }
    }
  })

  const isValidInputs =
    isSuccessSpace && address ? space?.admins.includes(address) : false

  const initialValues = {
    name: '',
    owner: '',
    image: '',
    url: '',
    description: ''
  }

  const validationSchemas = [
    Yup.object({
      name: Yup.string()
        .max(40, 'Must be 40 characters max')
        .required('Required'),
      owner: Yup.string(),
      image: Yup.string(),
      url: Yup.string().matches(
        /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
        'Website should be a valid URL'
      ),
      description: Yup.string().min(20, 'Must be 20 characters or more')
    })
  ]

  const formList = [
    <>
      <TextField name="name" title="Name" />
      <TextField name="owner" title="Owner" />
      <TextField maxLength={200} name="image" title="Image Link" />
      <TextField maxLength={200} name="url" title="Website" />
      <TextArea name="description" title="Description" />
    </>
  ]
  const CurrentForms = ({ index }: { index: number }) => formList[index] || null

  const handleSubmit = async (
    { name, owner, image, url, description }: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const signSuccess = await signIn()

      if (signSuccess && address) {
        insertOneProjectMutation.mutate({
          slug: '',
          owner,
          title: name,
          url,
          description,
          image,
          BudgetBoxes: [{ id: budgetBoxId }]
        })
        setIsModalOpen(true)
        setSubmitting(false)
      }
    } else {
      setSelected((prevSelected) => prevSelected + 1)
    }
  }

  return (
    <>
      <LoadingModal isOpen={isModalOpen} title="Creating Project" />
      <RegistrationLayout
        handleNavigation={handleNavigation}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        isValidInputs={isValidInputs}
        options={options}
        selected={selected}
        title="Create a project"
        validationSchemas={validationSchemas}
      >
        <CurrentForms index={selected} />
      </RegistrationLayout>
    </>
  )
}
