import { PowerRanker } from '@/models/power'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Ranking {
  project: string
  power: number
}

interface Data {
  ranking: Ranking[]
}

export default async function serverSideCall(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405)
  } else {
    const { body } = req
    const { projects, votes } = body
    const projectSet = new Set(projects)

    const powerRanker = new PowerRanker(projectSet, votes, projectSet.size)
    const rankings = powerRanker.run()

    const rankList = Object.fromEntries(rankings)

    res.status(200).json({ ranking: rankList })
  }
}
