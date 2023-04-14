import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const listChallenges = async (filters = {}) => {
  const { isActive } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }

  const query = {
    include: {
      owner: {
        select: {
          username: true,
          metadata: true,
        },
      },
      challenger: {
        select: {
          username: true,
          metadata: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  }
  if (notNilNorEmpty(where)) {
    query.where = where
  }

  const result = await prisma.challenge.findMany(query)

  return result
}
