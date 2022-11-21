import { graphqlClient } from '@/api/clients/graphql'
import { INSERT_MANY_PROJECTS } from '@/graphql/mutations/project'
import { Project, ProjectSchema } from '@/types/project'
import type { NextApiRequest, NextApiResponse } from 'next'

interface Projects {
  projects: Array<Project>
}
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
      const { projects }: Projects = req.body
      const ProjectsSchema = ProjectSchema.array()
      const { success } = ProjectsSchema.safeParse(projects)
      if (success) {
        await graphqlClient.mutate({
          mutation: INSERT_MANY_PROJECTS,
          variables: {
            data: projects
          }
        })
      } else {
        res.status(422).json({
          success: false,
          message: 'Invalid body format'
        })
      }
      res.status(200).json({ success: true })
    } catch (e) {
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
