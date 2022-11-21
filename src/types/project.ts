import { z } from 'zod'

const nonEmptyStringContraint = z.string().min(1)

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
