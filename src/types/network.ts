import { z } from 'zod'

export const NetworkSchema = z.object({
  name: z.string().min(1),
  chainId: z.number(),
  currency: z.string().min(1),
  wagmiChain: z.any()
})

export type Network = z.infer<typeof NetworkSchema>
