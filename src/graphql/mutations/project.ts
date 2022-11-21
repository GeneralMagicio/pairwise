import { gql } from '@apollo/client'

export const INSERT_MANY_PROJECTS = gql`
  mutation insertManyProjects($data: [ProjectInsertInput!]!) {
    insertManyProjects(data: $data) {
      insertedIds
    }
  }
`
