import { gql } from '@apollo/client'

export const GET_ALL_BUDGET_BOXES = gql`
  query {
    budgetBoxes {
      _id
      allowlist
      creator
      description
      id
      name
    }
  }
`
