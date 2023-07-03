import R from 'ramda'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'
import { statusesComparator } from './constants'

export const listChallenges = async (filters = {}) => {
  const { isActive, status, limit } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (notNilNorEmpty(status)) {
    where.status = { in: status }
  }

  const query = {
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          metadata: true,
        },
      },
      challenger: {
        select: {
          id: true,
          username: true,
          metadata: true,
        },
      },
      competition: { select: { id: true } },
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
  if (notNilNorEmpty(limit)) {
    query.take = +limit
  }

  const result = await prisma.challenge.findMany(query)

  return R.sort(statusesComparator)(result ?? [])
}
