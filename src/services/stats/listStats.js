import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const listStats = async (filters) => {
  const { cmsVideoGameHandleId } = filters // list stats from cmsVideoGameHandleId

  const where = {}
  if (notNilNorEmpty(cmsVideoGameHandleId)) {
    where.cmsVideoGameHandleId = { equals: cmsVideoGameHandleId }
  }

  const query = {
    include: {
      owner: {
        select: {
          username: true,
          metadata: true,
        },
      },
    },
    orderBy: [
      {
        rating: 'desc',
      },
    ],
  }
  if (notNilNorEmpty(where)) {
    query.where = where
  }

  const result = await prisma.stat.findMany(query)

  return result ?? []
}
