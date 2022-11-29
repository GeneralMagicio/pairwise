import { authRouter } from './auth'
import { budgetBoxRouter } from './budgetBox'
import { projectRouter } from './project'
import { voteRouter } from './vote'
import { router } from '../trpc'

export const appRouter = router({
  auth: authRouter,
  budgetBox: budgetBoxRouter,
  project: projectRouter,
  vote: voteRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
