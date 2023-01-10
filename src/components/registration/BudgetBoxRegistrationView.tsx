import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { useEffect, useState } from 'react'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { SetupStrategyModal } from '@/components/modals/SetupStrategyModal'
import { Switch } from '@/components/buttons/Switch'
import { Slider } from '@/components/inputs/Slider'
import { SelectStrategyModal } from '@/components/modals/SelectStrategyModal'
import { RegistrationLayout } from '@/components/registration/layout/RegistrationLayout'
import { DatePicker } from '@/components/inputs/DatePicker'
import { TextArea } from '@/components/inputs/TextArea'
import { TextField } from '@/components/inputs/TextField'
import { LoadingModal } from '@/components/modals/LoadingModal'
import { StrategyTitleCard } from '@/components/cards/StrategyTitleCard'
import { ImageUploader } from '@/components/inputs/ImageUploader'
import { useModal } from '@/hooks/useModal'
import { useImageUploader } from '@/hooks/useImageUploader'
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
  startDate: string
  endDate: string
  maxVotesPerUser: number
  maxPairsPerVote: number
  dampingFactor: number
  allowlist: string
}

export const BudgetBoxRegistrationView = () => {
  const [noEndDate, setNoEndDate] = useState<boolean>(false)
  const [unlimitedVotes, setUnlimitedVotes] = useState<boolean>(false)
  const { selected, setSelected, handleNavigation } = useFormNavigation()
  const [isSelectStrategyOpen, setIsSelectStrategyOpen] =
    useState<boolean>(false)
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('')
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('')
  const [selectedStrategies, setSelectedStrategies] = useState<
    Array<{ name: string; params: string; network: string }>
  >([])
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [params, setParams] = useState<any>('')
  const {
    image: budgetBoxImage,
    setImage: setBudgetBoxImage,
    imageFile: budgetBoxImageFile,
    setImageFile: setBudgetBoxImageFile,
    uploadImage
  } = useImageUploader()
  const router = useRouter()
  const spaceSlug = router.query.spaceSlug as string
  const { isModalOpen, setIsModalOpen } = useModal({})
  const { address, signIn } = useSiwe()

  const { data: space, isSuccess: isSuccessSpace } =
    trpc.space.getOneBySlug.useQuery({ slug: spaceSlug })

  const { data: strategies } = trpc.snapshot.getAllStrategies.useQuery()
  const { data: selectedStrategy } = trpc.snapshot.getOneStrategy.useQuery({
    id: selectedStrategyId
  })

  const insertOneBudgetBoxMutation = trpc.budgetBox.insertOne.useMutation({
    onSuccess: (data) => {
      if (data) {
        router.push({
          pathname: `/${spaceSlug}/${data.id}`,
          query: { q: 'success' }
        })
      }
    }
  })

  const handleSave = (params: string) => {
    setSelectedStrategies((prevState) => [
      ...prevState,
      { name: selectedStrategyId, params, network: selectedNetworkId }
    ])
    setIsSelectStrategyOpen(false)
  }

  const handleRemove = (index: number) => {
    setSelectedStrategies((prevState) =>
      prevState.filter((_, i) => i !== index)
    )
  }

  const isValidInputs =
    selected === options.length - 1
      ? isSuccessSpace && address && selectedStrategies.length > 0
        ? space?.admins.includes(address)
        : false
      : true

  const defaultEndDate = new Date()
  defaultEndDate.setDate(new Date().getDate() + 15)

  const initialValues = {
    name: '',
    creatorAddress: address || '',
    description: '',
    startDate: new Date().toISOString().substring(0, 10),
    endDate: defaultEndDate.toISOString().substring(0, 10),
    maxVotesPerUser: 1,
    maxPairsPerVote: 20,
    dampingFactor: 0.8,
    allowlist: ''
  }

  const validationSchemas = [
    Yup.object({
      name: Yup.string()
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
      creatorAddress: Yup.string().min(42).required('Required'),
      description: Yup.string()
        .min(10, 'Must be 10 characters or more')
        .required('Required')
    }),
    Yup.object({
      startDate: Yup.date()
        .typeError('You have to define a start date')
        .min(new Date().toDateString(), "Start date can't be in the past")
        .required('Required'),
      endDate: Yup.date()
        .typeError('You have to define an end date')
        .min(new Date().toDateString(), "End date can't be in the past")
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
      <ImageUploader
        height={300}
        image={budgetBoxImage}
        setFile={setBudgetBoxImageFile}
        setImage={setBudgetBoxImage}
        width={'100%'}
      />
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
          disabled={unlimitedVotes}
          name="maxVotesPerUser"
          title="Max votes per user"
        />
        <TextField
          className="grow"
          disabled={unlimitedVotes}
          name="maxPairsPerVote"
          title="Max pairs per vote"
          type="number"
        />
        <Switch
          checked={unlimitedVotes}
          className="mt-4 mr-4"
          setChecked={setUnlimitedVotes}
          title="Unlimited votes"
        />
      </div>
      <Slider max={1} min={0} name="dampingFactor" title="Damping Factor" />
      <div className="flex items-center justify-between gap-x-10">
        <DatePicker className="grow" name="startDate" title="Start Date" />
        <DatePicker
          className="grow"
          disabled={noEndDate}
          name="endDate"
          title="End Date"
        />
        <Switch
          checked={noEndDate}
          className="mt-4 mr-4"
          setChecked={setNoEndDate}
          title="No end date"
        />
      </div>
      <div className="py-4">
        <h3>Selected Strategies</h3>
        <div className="flex h-48 flex-col gap-y-2 overflow-y-scroll rounded-lg border bg-gray-100 p-3">
          {selectedStrategies.length > 0 ? (
            selectedStrategies.map(({ name }, index) => (
              <div key={index} className="rounded-lg bg-white">
                <StrategyTitleCard
                  hasCloseIcon
                  handleClose={() => handleRemove(index)}
                  title={name}
                />
              </div>
            ))
          ) : (
            <h3 className="m-auto text-lg font-medium">
              No Strategy selected.
            </h3>
          )}
        </div>
        {selectedStrategies.length < 8 ? (
          <PrimaryButton
            color={ButtonColors.BLUE_GRADIENT}
            label="Add Strategy"
            styles="mt-4 w-32 h-12"
            onClick={() => setIsSelectStrategyOpen(true)}
          />
        ) : null}
      </div>
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
      maxVotesPerUser,
      maxPairsPerVote,
      allowlist
    }: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    if (selected === options.length - 1) {
      const signSuccess = await signIn()
      if (signSuccess && address) {
        let imageUrl =
          'https://user-images.githubusercontent.com/18421017/206027384-4869ad77-e635-4525-a5e8-e88eb8a5b206.png'

        if (budgetBoxImageFile) {
          const formData = new FormData()
          formData.append('file', budgetBoxImageFile)
          formData.append('upload_preset', 'pairwise-uploads')
          const { data } = await uploadImage(formData)
          if (data.secure_url) {
            imageUrl = data.secure_url
          }
        }
        insertOneBudgetBoxMutation.mutate({
          startDate: new Date(startDate),
          endDate: noEndDate ? null : new Date(endDate),
          creator: creatorAddress,
          title: name,
          image: imageUrl,
          description,
          dampingFactor,
          maxVotesPerUser: unlimitedVotes ? null : maxVotesPerUser,
          maxPairsPerVote: unlimitedVotes ? null : maxPairsPerVote,
          allowlist: allowlist.split(','),
          spaceSlug,
          snapshotStrategies: selectedStrategies.map(
            ({ name, network, params }) => ({
              name,
              network,
              params: JSON.parse(params || '{}')
            })
          )
        })
        setIsModalOpen(true)
        setSubmitting(false)
      }
    } else {
      setSubmitting(false)
      setSelected((prevSelected) => prevSelected + 1)
    }
  }
  useEffect(() => {
    setParams(selectedStrategy)
    if (selectedStrategyId !== '') {
      setIsSelectStrategyOpen(false)
    }
  }, [selectedStrategyId, selectedStrategy])

  return (
    <>
      <LoadingModal isOpen={isModalOpen} title="Creating Pairwise" />
      <SelectStrategyModal
        data={strategies}
        handleClose={() => setIsSelectStrategyOpen(false)}
        isOpen={isSelectStrategyOpen}
        setSelectedStrategy={setSelectedStrategyId}
      />
      <SetupStrategyModal
        handleSave={handleSave}
        isOpen={selectedStrategyId !== ''}
        params={params ? params?.examples[0]?.strategy.params : '{}'}
        selectedNetwork={selectedNetworkId}
        setSelectedNetwork={setSelectedNetworkId}
        setSelectedStrategy={setSelectedStrategyId}
        title={selectedStrategyId}
      />
      <RegistrationLayout
        handleNavigation={handleNavigation}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        isValidInputs={isValidInputs}
        options={options}
        selected={selected}
        title="Create your Pairwise"
        validationSchemas={validationSchemas}
      >
        <CurrentForms index={selected} />
      </RegistrationLayout>
    </>
  )
}
