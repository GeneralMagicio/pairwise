import { GetServerSideProps } from 'next'
import { PowerRanker } from '@/models/power'
import { RankingCard } from '@/components/cards/RankingCard'
import { Project } from '@/types/project'
import { Preference, Vote } from '@/types/vote'
import { graphqlClient } from '@/api/clients/graphql'
import { GET_PROJECTS_FROM_BUDGET_BOX } from '@/graphql/queries/project'
import { GET_VOTES } from '@/graphql/queries/vote'

interface Ranking {
  projects: Array<Project>
  ranking: { [name: string]: number }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context
  const budgetBoxId = params?.id
  const { data: projectsData } = await graphqlClient.query({
    query: GET_PROJECTS_FROM_BUDGET_BOX,
    variables: {
      data: { id: budgetBoxId }
    },
    fetchPolicy: 'network-only'
  })
  const projects: Array<Project> = [...projectsData?.budgetBox?.projects]

  let rankList = {}
  if (projects.length > 1) {
    const { data: votesData } = await graphqlClient.query({
      query: GET_VOTES,
      variables: {
        data: { budgetBox: { id: budgetBoxId } }
      },
      fetchPolicy: 'network-only'
    })
    const votes = votesData.votes
    const formattedVotes: Array<Preference> = []
    votes.map((vote: Vote) => {
      formattedVotes.push(...vote.preferences)
    })
    const projectSet: Set<string> = new Set()
    formattedVotes.map((vote: Preference) => {
      projectSet.add(vote.alpha)
      projectSet.add(vote.beta)
    })

    const powerRanker = new PowerRanker(
      projectSet,
      formattedVotes,
      projectSet.size
    )
    const rankings = powerRanker.run()

    rankList = Object.fromEntries(rankings)
  }

  return { props: { projects, ranking: rankList } }
}

const Ranking = ({ projects, ranking }: Ranking) => {
  return (
    <div className="flex min-h-[calc(100vh_-_110px)] flex-col items-center justify-center gap-y-4 px-8 pt-16 pb-10">
      {projects.length < 2 ? (
        <span className="px-4 text-center text-lg">
          There is no project in this budget box
        </span>
      ) : (
        projects
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
          ))
      )}
    </div>
  )
}

export default Ranking
