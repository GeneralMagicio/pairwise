import { authRouter } from './auth'
import { budgetBoxRouter } from './budgetBox'
import { categoryRouter } from './category'
import { ensRouter } from './integrations/ens'
import { givethRouter } from './integrations/giveth'
import { projectRouter } from './project'
import { voteRouter } from './vote'
import { spaceRouter } from './space'
import { snapshotRouter } from './integrations/snapshot'
import { router } from '../trpc'

export const appRouter = router({
  auth: authRouter,
  budgetBox: budgetBoxRouter,
  category: categoryRouter,
  ens: ensRouter,
  giveth: givethRouter,
  project: projectRouter,
  snapshot: snapshotRouter,
  space: spaceRouter,
  vote: voteRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
