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
