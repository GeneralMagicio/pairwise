import { z } from 'zod'

export const nonEmptyStringContraint = z.string().min(1)
