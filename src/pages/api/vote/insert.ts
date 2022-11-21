import { graphqlClient } from '@/api/clients/graphql'
import { INSERT_ONE_VOTE } from '@/graphql/mutations/vote'
import { GET_VOTES } from '@/graphql/queries/vote'
import { Vote, VoteSchema } from '@/types/vote'
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
    try {
      const vote: Vote = req.body?.vote
      const { success } = VoteSchema.safeParse(vote)
      if (success) {
        const voterAddress = vote?.voter
        const budgetBoxId = vote?.budgetBox?.link
        const { data: votesData } = await graphqlClient.query({
          query: GET_VOTES,
          variables: {
            data: { budgetBox: { id: budgetBoxId }, voter: voterAddress }
          },
          fetchPolicy: 'network-only'
        })
        if (votesData?.votes.length > 0) {
          res.status(422).json({ success: false, message: 'Already voted' })
        } else {
          await graphqlClient.mutate({
            mutation: INSERT_ONE_VOTE,
            variables: {
              data: vote
            }
          })
          res.status(200).json({ success: true })
        }
      } else {
        res.status(422).json({
          success: false,
          message: 'Invalid body format'
        })
      }
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
