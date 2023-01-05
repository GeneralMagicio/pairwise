import { CustomConnectButton } from '@/components/buttons/ConnectButton'

interface INavBar {
  title: string
}

export const Navbar = ({ title }: INavBar) => {
  return (
    <nav className="sticky top-0 z-20 flex h-[100px] w-full items-center justify-center  bg-white px-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="absolute right-8">
        <CustomConnectButton />
      </div>
    </nav>
  )
}
