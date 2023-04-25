import R from 'ramda'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

const STATUSES_ORDER = { published: 5, in_progress: 4, reviewing: 3, finished: 2, cancelled: 1 }
const statusesComparator = R.comparator((a, b) =>
  R.gt(STATUSES_ORDER[R.prop('status', a)], STATUSES_ORDER[R.prop('status', b)])
)

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

  return R.sort(statusesComparator)(result ?? [])
}
