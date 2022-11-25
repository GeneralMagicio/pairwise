import { authRouter } from './auth'
import { budgetBoxRouter } from './budgetBox'
import { projectRouter } from './project'
import { router } from '../trpc'

export const appRouter = router({
  budgetBox: budgetBoxRouter,
  project: projectRouter,
  auth: authRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
