import { LoadingModal } from '../modals/LoadingModal'
import { useState } from 'react'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { FormSelector } from '@/components/inputs/FormSelector'
import { TextArea } from '@/components/inputs//TextArea'
import { TextField } from '@/components/inputs/TextField'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { trpc } from '@/utils/trpc'
import { useFormNavigation } from '@/hooks/useFormNavigation'
import { useSiwe } from '@/hooks/useSiwe'
import { useModal } from '@/hooks/useModal'
import type { FormikHelpers } from 'formik'

interface Values {
  creatorName: string
  ens: string
  adminAddresses: string
  spaceName: string
  spaceCategory: string
  spaceDescription: string
  spaceUrl: string
}

const options = ['Select addresses for Space', "Setup your Space's Profile"]

export const SpaceRegistrationView = () => {
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const [newSpaceSlug, setNewSpaceSlug] = useState<string>('')
  const { isModalOpen, setIsModalOpen } = useModal({})
  const router = useRouter()
  const { address, signIn } = useSiwe()
  const trpcContext = trpc.useContext()

  const { data: ensNames, isSuccess: ensNamesSuccess } =
    trpc.ens.getEnsNamesByAddress.useQuery({
      address: address || ''
    })
  const ensNamesOptions = ensNamesSuccess ? ['', ...ensNames] : []

  const { refetch: refetchSpaceSlug } = trpc.space.getOneBySlug.useQuery({
    slug: newSpaceSlug
  })

  const insertOneSpaceMutation = trpc.space.insertOne.useMutation({
    onMutate: async (newSpace) => {
      const {
        admins,
        creator,
        description,
        image,
        slug,
        title,
        url,
        categoryName
      } = newSpace
      await trpcContext.space.getOneBySlug.cancel({ slug })

      trpcContext.space.getOneBySlug.setData(
        { slug },
        {
          id: '',
          admins,
          creator,
          createdAt: new Date(),
          description,
          image,
          slug,
          title,
          url: url || '',
          Categories: [{ id: '', category: categoryName }]
        },
        {}
      )
      return { newSpace }
    },

    onSettled: (newTodo, error, variables, context) => {
      if (!error) {
        router.push({
          pathname: `/${context?.newSpace.slug}`,
          query: { q: 'success' }
        })
      }
    }
  })
  const { data: categories } = trpc.category.getAll.useQuery()

  const categoryOptions = categories
    ? ['', ...categories.map(({ category }) => category)]
    : []

  const initialValues = {
    creatorName: '',
    ens: '',
    adminAddresses: '',
    spaceName: '',
    spaceCategory: '',
    spaceDescription: '',
    spaceUrl: ''
  }

  const validationSchemas = [
    Yup.object({
      spaceName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      spaceCategory: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      ens: Yup.string()
        .min(3, 'ENS name cannot be empty')
        .required('Required')
        .test('Unique ENS', 'Invalid ENS', (value: string | undefined) => {
          if (typeof ensNames === 'undefined' || !value) return true
          return ensNames.includes(value)
        })
        .test(
          'Unique ENS',
          'ENS already in use',
          async (value: string | undefined) => {
            if (!value) return false
            setNewSpaceSlug(value)
            const { data: space } = await refetchSpaceSlug()

            // If there is no space with the given slug the test will pass
            return !space
          }
        )
    }),
    Yup.object({
      creatorName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      spaceDescription: Yup.string()
        .min(20, 'Must be 20 characters or more')
        .required('Required'),
      spaceUrl: Yup.string().matches(
        /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/,
        'Website should be a valid URL'
      ),
      adminAddresses: Yup.string().required('Required'),
      ens: Yup.string()
        .min(3, 'ENS name cannot be empty')
        .required('Required')
        .test('Unique ENS', 'Invalid ENS', (value: string | undefined) => {
          if (typeof ensNames === 'undefined' || !value) return true
          return ensNames.includes(value)
        })
        .test(
          'Unique ENS',
          'ENS already in use',
          async (value: string | undefined) => {
            if (!value) return false
            setNewSpaceSlug(value)
            const { data: space } = await refetchSpaceSlug()

            // If there is no space with the given slug the test will pass
            return !space
          }
        )
    })
  ]

  const formList = [
    <>
      <TextField name="spaceName" title="Name" />
      <FormSelector
        name="ens"
        options={ensNamesOptions}
        title="ENS for the space"
      />
      <FormSelector
        name="spaceCategory"
        options={categoryOptions}
        title="Category"
      />
    </>,
    <>
      <TextField name="creatorName" title="Space creator name" />
      <TextField name="spaceUrl" title="Website" />
      <TextArea name="spaceDescription" title="Description" />
      <TextArea
        name="adminAddresses"
        title="Set up admin accounts for your space (add comma separated addresses)"
      />
    </>
  ]
  const CurrentForms = ({ index }: { index: number }) => formList[index] || null
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const signSuccess = await signIn()
      if (signSuccess && address) {
        insertOneSpaceMutation.mutate({
          admins: values.adminAddresses.split(','),
          categoryName: values.spaceCategory,
          creator: values.creatorName,
          description: values.spaceDescription,
          image:
            'https://user-images.githubusercontent.com/18421017/206027384-4869ad77-e635-4525-a5e8-e88eb8a5b206.png',
          slug: values.ens,
          title: values.spaceName,
          url: values.spaceUrl
        })
        setIsModalOpen(true)
        setSubmitting(false)
      }
    } else {
      setSubmitting(false)
      setSelected((prevSelected) => prevSelected + 1)
    }
  }

  return (
    <>
      <LoadingModal isOpen={isModalOpen} title="Creating space" />
      <RegistrationLayout
        handleNavigation={handleNavigation}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        options={options}
        selected={selected}
        title="Create your space"
        validationSchemas={validationSchemas}
      >
        <CurrentForms index={selected} />
      </RegistrationLayout>
    </>
  )
}
