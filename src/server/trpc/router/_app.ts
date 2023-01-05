import { authRouter } from './auth'
import { budgetBoxRouter } from './budgetBox'
import { categoryRouter } from './category'
import { ensRouter } from './ens'
import { givethRouter } from './integrations/giveth'
import { projectRouter } from './project'
import { voteRouter } from './vote'
import { spaceRouter } from './space'
import { router } from '../trpc'

export const appRouter = router({
  auth: authRouter,
  budgetBox: budgetBoxRouter,
  category: categoryRouter,
  ens: ensRouter,
  giveth: givethRouter,
  project: projectRouter,
  space: spaceRouter,
  vote: voteRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
