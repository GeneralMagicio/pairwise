import { gql } from '@apollo/client'

export const INSERT_ONE_VOTE = gql`
  mutation insertOneVote($data: VoteInsertInput!) {
    insertOneVote(data: $data) {
      _id
    }
  }
`
