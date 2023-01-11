import Link from 'next/link'
import { ModalLayout } from '@/components/modals/ModalLayout'
import { isJSON } from '@/utils/helpers/json'
import { snapShotPlaygroundLink } from '@/utils/helpers/snapshot'

interface IStrategyDetailsModal {
  isOpen: boolean
  title: string
  network: string
  params: string
  handleClose: () => void
}

export const StrategyDetailsModal = ({
  isOpen,
  title,
  network,
  params,
  handleClose
}: IStrategyDetailsModal) => {
  const test = isJSON(params) ? JSON.parse(params) : {}
  const entries = Object.entries(test)

  const playgroundLink = snapShotPlaygroundLink(title, params, network)

  return (
    <ModalLayout closeModal={handleClose} isOpen={isOpen}>
      <>
        <h2 className="text-2xl font-black">Strategy</h2>
        <div className="flex min-w-full flex-col rounded-lg border p-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <p>
            <span className="font-bold">Network:</span> {network}
          </p>
          {entries.map((entry) => (
            <p key={entry[0]}>
              <>
                <span className="font-bold">{`${entry[0]}: `}</span>
                {entry[1]}
              </>
            </p>
          ))}
        </div>

        <Link
          className="mt-2 w-full rounded-lg border p-3 text-center"
          href={playgroundLink}
          target="_blank"
        >
          Test in Playground
        </Link>
      </>
    </ModalLayout>
  )
}
