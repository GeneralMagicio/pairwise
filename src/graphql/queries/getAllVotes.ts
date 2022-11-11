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
