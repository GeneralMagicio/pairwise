import { gql } from '@apollo/client'

export const GET_ALL_VOTES = gql`
  query {
    votes {
      preferences {
        alpha
        beta
        preference
      }
    }
  }
`
export const GET_VOTES = gql`
  query ($data: VoteQueryInput) {
    votes(query: $data) {
      voter
      preferences {
        alpha
        beta
        preference
      }
      budgetBox {
        _id
        id
      }
    }
  }
`
