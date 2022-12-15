import { router, publicProcedure } from '../trpc'

export const categoryRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany()
  })
})
