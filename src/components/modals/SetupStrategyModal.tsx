import Link from 'next/link'
import { useEffect, useState } from 'react'
import networks from '@snapshot-labs/snapshot.js/src/networks.json'
import { PrimaryButton, ButtonColors } from '@/components/buttons/PrimaryButton'
import { ModalLayout } from '@/components/modals/ModalLayout'
import { Selector } from '@/components/inputs/Selector'
import { encodeJson } from '@/utils/helpers/b64'
import { isJSON } from '@/utils/helpers/json'
import { useSelector } from '@/hooks/useSelector'
import type { ChangeEventHandler, Dispatch, SetStateAction } from 'react'

interface ISetupStrategyModal {
  isOpen: boolean
  title: string
  params: string | undefined
  handleSave: (customParams: string) => void
  selectedNetwork: string
  setSelectedNetwork: Dispatch<SetStateAction<string>>
  setSelectedStrategy: Dispatch<SetStateAction<string>>
}

const networkKeyNames = Object.values(networks).map(({ name, key }) => ({
  name,
  key
}))
const networkOptions = Object.values(networks).map(({ name }) => name)

export const SetupStrategyModal = ({
  isOpen,
  title,
  params,
  handleSave,
  selectedNetwork,
  setSelectedNetwork,
  setSelectedStrategy
}: ISetupStrategyModal) => {
  const [customParams, setCustomParams] = useState<string>(params || '')
  const { selected, handleSelect } = useSelector(
    networkOptions,
    networkOptions[0]
  )

  const playgroundLink = customParams
    ? `https://snapshot.org/#/playground/${title}?query=${encodeJson({
        params: isJSON(customParams) ? JSON.parse(customParams) : {},
        network: selectedNetwork,
        snapshot: '',
        addresses: []
      })}`
    : '/'

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setCustomParams((event.target as HTMLTextAreaElement).value)
  }

  useEffect(() => {
    setCustomParams(JSON.stringify(params, null, 2) || '')
  }, [params])

  useEffect(() => {
    setSelectedNetwork(networkKeyNames[0]?.key || '')
  }, [])

  return (
    <ModalLayout closeModal={() => setSelectedStrategy('')} isOpen={isOpen}>
      <>
        <h2 className="text-xl font-medium">{title}</h2>
        <div className="w-full">
          {params ? (
            <>
              <h3>Network</h3>
              <Selector
                className="min-w-full"
                comboBoxClassName="min-w-full"
                options={networkOptions}
                selected={selected}
                handleSelect={(index) => {
                  setSelectedNetwork(networkKeyNames[index]?.key || '')
                  handleSelect(index)
                }}
              />
              <textarea
                className="mt-4 min-h-[200px] w-full overflow-x-scroll  whitespace-pre rounded-lg border"
                value={customParams}
                onChange={handleChange}
              />

              <Link
                className="mt-4 block w-full rounded-lg border p-3 text-center"
                href={playgroundLink}
                target="_blank"
              >
                Test in Playground
              </Link>
              <PrimaryButton
                color={ButtonColors.BLUE_GRADIENT}
                label="Save"
                styles="mt-2 h-10"
                onClick={() => {
                  handleSave(customParams)
                  setSelectedStrategy('')
                }}
              />
            </>
          ) : (
            <h3>Loading...</h3>
          )}
        </div>
      </>
    </ModalLayout>
  )
}
