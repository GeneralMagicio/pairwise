import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'

export const CustomConnectButton: FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted
      }) => {
        const ready = mounted
        const connected = ready && account && chain
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none'
              }
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="rounded-xl bg-gradient-to-b from-blue-500 to-cyan-300 px-3 py-2 font-semibold text-white"
                    type="button"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="rounded-xl bg-red-600 px-3 py-2 font-semibold text-white"
                    type="button"
                    onClick={openChainModal}
                  >
                    Wrong network
                  </button>
                )
              }

              return (
                <div className="flex gap-12">
                  <button
                    className="rounded-xl bg-gradient-to-b from-blue-500 to-cyan-300 px-3 py-2 font-semibold text-white"
                    type="button"
                    onClick={openAccountModal}
                  >
                    {account.displayName}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
