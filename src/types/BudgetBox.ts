import { z } from 'zod'

const nonEmptyStringContraint = z.string().min(1)

export const BudgetBoxSchema = z.object({
  id: nonEmptyStringContraint,
  description: nonEmptyStringContraint,
  name: nonEmptyStringContraint,
  allowlist: nonEmptyStringContraint.array(),
  creator: nonEmptyStringContraint
})

export type BudgetBox = z.infer<typeof BudgetBoxSchema>
