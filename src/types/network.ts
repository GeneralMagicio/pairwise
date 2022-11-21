import { z } from 'zod'

const nonEmptyStringContraint = z.string().min(1)

export const NetworkSchema = z.object({
  name: nonEmptyStringContraint,
  chainId: z.number(),
  currency: nonEmptyStringContraint,
  wagmiChain: z.any()
})

export type Network = z.infer<typeof NetworkSchema>
