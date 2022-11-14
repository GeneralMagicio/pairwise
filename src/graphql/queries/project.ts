import { gql } from '@apollo/client'

export const GET_ALL_PROJECTS = gql`
  query {
    projects {
      _id
      description
      id
      image
      owner
      title
      url
    }
  }
`

export const GET_PROJECTS_FROM_BUDGET_BOX = gql`
  query ($data: BudgetBoxQueryInput) {
    budgetBox(query: $data) {
      projects {
        id
        title
        url
        owner
        description
        image
      }
    }
  }
`
