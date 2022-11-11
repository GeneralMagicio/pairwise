import { GetServerSideProps } from 'next'
import { PowerRanker } from '@/models/power'
import { RankingCard } from '@/components/cards/RankingCard'
import { Project } from '@/types/project'
import { graphqlClient } from '@/graphql/clients/client'
import { GET_ALL_PROJECTS } from '@/graphql/queries/getAllProjects'
import { GET_ALL_VOTES } from '@/graphql/queries/getAllVotes'

interface Vote {
  voter: string
  preferences: Array<Preference>
}

interface Preference {
  alpha: string
  beta: string
  preference: number
}

interface Ranking {
  projects: Array<Project>
  ranking: { [name: string]: number }
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: projectsData } = await graphqlClient.query({
    query: GET_ALL_PROJECTS
  })

  const projects = [...projectsData?.projects]
  const { data: votesData } = await graphqlClient.query({
    query: GET_ALL_VOTES
  })
  const votes = votesData.votes
  const formattedVotes: Array<Preference> = []
  votes.map((vote: Vote) => {
    formattedVotes.push(...vote.preferences)
  })
  const projectIds = projects.map((project: Project) => project.id as string)

  const projectSet: Set<string> = new Set(projectIds)

  const powerRanker = new PowerRanker(
    projectSet,
    formattedVotes,
    projectSet.size
  )
  const rankings = powerRanker.run()

  const rankList = Object.fromEntries(rankings)

  return { props: { projects, ranking: rankList } }
}

const Ranking = ({ projects, ranking }: Ranking) => {
  return (
    <div className="h-full w-screen flex flex-col gap-y-4 pt-60 pb-10 px-8 items-center justify-center">
      {projects
        .sort((a, b) => ranking[b.id] - ranking[a.id])
        .map((project: Project) => (
          <RankingCard
            key={project.id}
            description={project.description || ''}
            id={project.id}
            image={project.image}
            owner={project.owner}
            power={ranking[project.id]}
            title={project.title}
            url={project.url}
          />
        ))}
    </div>
  )
}

export default Ranking
