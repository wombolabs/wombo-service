import R from 'ramda'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'
import { statusesComparator } from './constants'

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

  return R.sort(statusesComparator)(result ?? [])
}
