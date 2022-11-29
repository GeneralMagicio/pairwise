import { nonEmptyStringContraint } from '.'
import { z } from 'zod'

export const ProjectSchema = z.object({
  id: nonEmptyStringContraint,
  power: z.number().optional(),
  title: nonEmptyStringContraint,
  url: nonEmptyStringContraint,
  owner: nonEmptyStringContraint,
  description: nonEmptyStringContraint,
  image: nonEmptyStringContraint
})

export type Project = z.infer<typeof ProjectSchema>
