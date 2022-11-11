import { PowerRanker } from '@/models/power'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function serverSideCall(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405)
  } else {
    const { body } = req
    const { projects, votes } = body
    const projectSet: Set<string> = new Set(projects)

    const powerRanker = new PowerRanker(projectSet, votes, projectSet.size)
    const rankings = powerRanker.run()

    const rankList = Object.fromEntries(rankings)

    res.status(200).json({ ranking: rankList })
  }
}
