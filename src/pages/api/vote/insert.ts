import { graphqlClient } from '@/graphql/clients/client'
import { INSERT_ONE_VOTE } from '@/graphql/mutations/insertOneVote'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Data {
  success: boolean
  message?: string
}

export default async function serverSideCall(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405)
  } else {
    const { body } = req
    const { vote } = body
    try {
      await graphqlClient.mutate({
        mutation: INSERT_ONE_VOTE,
        variables: {
          data: vote
        }
      })
      res.status(200).json({ success: true })
    } catch (e: unknown) {
      let message
      if (e instanceof Error) message = e.message
      else message = String(e)
      res.status(500).json({
        success: false,
        message: message
      })
    }
  }
}
