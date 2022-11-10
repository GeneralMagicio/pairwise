import { RankingCard } from '@/components/cards/RankingCard'
import { Project } from '@/types/project'

const Ranking = () => {
  const power = {
    'bridging-digital-communities': 0.39963420210333767,
    'diamante-bridge-collective-0': 0.2998780673677792,
    'unchain-fund': 0.20012193263222058,
    'Diamante-Luz-Center-for-Regenerative-Living-0': 0.10036579789666203
  }

  const projects: Array<Project> = [
    {
      id: 'bridging-digital-communities',
      title: 'Bridging Digital Communities',
      url: 'https://giveth.io/project/bridging-digital-communities',
      owner: 'Kay @geleeroyale',
      description:
        'I run a bridge server for chats (Discord, Telegram, Riot, ...) and am actively engaging communities connected to the Ethereum space. Especially with the advent of newDAOs my services are being requested on a regular basis. Most requested at the moment is bridging between community servers on Discord (both communities get to share a room), whereas before it was mostly mirroring rooms between different protocols. Once a bridge is up, it still needs to be maintained and I regularly check that everything is in working order.',
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmNbtiT1JRENpxBbQqQ39Dgzp3NteQeKpXGE9QijpPpM7K&w=1920&q=75'
    },
    {
      id: 'diamante-bridge-collective-0',
      title: 'Diamante Bridge Collective',
      url: 'https://giveth.io/project/diamante-bridge-collective-0',
      owner: 'Diamante Bridge Collective',
      description: `The Diamante Bridge Collective (DBC) is a network of land stewards, individuals, organizations and communities located primarily within the Diamante Valley of Costa Rica, expanding to include those from the greater Southern Zone of Costa Rica, and those abroad.
The DBC functions as a hub of many physical nodes, connected via global networks of shared vision and mission with the goal of restoring, preserving and consciously stewarding surrounding lands and watersheds while living harmoniously within them in alignment with our planetary values.`,
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmajCgweP9g2o4sGmrzioh3KHyBXTdY9rYmg31h2pzUsZb&w=1920&q=75'
    },
    {
      id: 'unchain-fund',
      title: 'Unchain Fund',
      url: 'https://giveth.io/project/unchain-fund',
      owner: 'Alex Casas',
      description: `With your support we can quickly raise and distribute money to the people of Ukraine – to where they need it the most.
We are urgently raising funds for the support of the Ukrainian people - supporting effective NGO's doing work on the ground right now.`,
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmTBRjvMzeZdo32Pp9EKhF2AQjZx2AcM53JNFqLwTW2ttf&w=1920&q=75'
    },
    {
      id: 'Diamante-Luz-Center-for-Regenerative-Living-0',
      title: 'Diamante Luz Center for Regenerative Living',
      url: 'https://giveth.io/project/Diamante-Luz-Center-for-Regenerative-Living-0',
      owner: 'Diamante Luz',
      description: `Diamante Luz is a space for integrated collaboration and cooperation with nature. Our residents, neighbors, and visitors have been drawn to the area in order to co-create a space for living and working in balance with all of our relations.`,
      image:
        'https://giveth.io/_next/image?url=https%3A%2F%2Fgiveth.mypinata.cloud%2Fipfs%2FQmXoqPYCRgu8ZJuVXPpLnGN9dvh3TGtBxRVCwjCBCHiG4u&w=1920&q=75'
    }
  ]

  return (
    <div className="h-full w-screen flex flex-col gap-y-4 pt-60 pb-10 px-8 border items-center justify-center">
      {projects.map((project: Project) => (
        <RankingCard
          key={project.id}
          description={project.description || ''}
          image={project.image}
          owner={project.owner}
          power={power['bridging-digital-communities']}
          title={project.title}
          url={project.url}
        />
      ))}
    </div>
  )
}

export default Ranking
