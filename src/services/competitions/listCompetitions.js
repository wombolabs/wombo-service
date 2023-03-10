import R from 'ramda'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

const STATUSES_ORDER = { coming_soon: 4, open: 3, in_progress: 2, finished: 1 }
const statusesComparator = R.comparator((a, b) =>
  R.gt(STATUSES_ORDER[R.prop('status', a)], STATUSES_ORDER[R.prop('status', b)])
)

export const listCompetitions = async (filters = {}) => {
  const { codename, withParcipants, isActive } = filters

  const include = {}
  if (withParcipants) {
    include.participants = true
  }

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (notNilNorEmpty(codename)) {
    where.codename = { in: codename }
  }

  const query = {
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  }
  if (notNilNorEmpty(where)) {
    query.where = where
  }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.competition.findMany(query)

  return R.sort(statusesComparator)(result ?? [])
}
