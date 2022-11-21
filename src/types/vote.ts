import { z } from 'zod'

const nonEmptyStringContraint = z.string().min(1)

export const PreferenceSchema = z.object({
  alpha: nonEmptyStringContraint,
  beta: nonEmptyStringContraint,
  preference: z.union([z.literal(-1), z.literal(0), z.literal(1)])
})
export type Preference = z.infer<typeof PreferenceSchema>

export const VoteSchema = z.object({
  voter: nonEmptyStringContraint,
  budgetBox: nonEmptyStringContraint,
  preferences: PreferenceSchema.array()
})
export type Vote = z.infer<typeof VoteSchema>
