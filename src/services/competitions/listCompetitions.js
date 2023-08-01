import R from 'ramda'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

const STATUSES_ORDER = { coming_soon: 4, open: 3, in_progress: 2, finished: 1 }
const statusesComparator = R.comparator((a, b) =>
  R.gt(STATUSES_ORDER[R.prop('status', a)], STATUSES_ORDER[R.prop('status', b)])
)

export const listCompetitions = async (filters = {}) => {
  const { codename, withParticipants, withChallenges, status, limit, isActive } = filters

  const include = {}
  if (withParticipants) {
    include.participants = true
  }
  if (withChallenges) {
    include.challenges = true
  }

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (notNilNorEmpty(codename)) {
    where.codename = { equals: codename }
  }
  if (notNilNorEmpty(status)) {
    where.status = { in: typeof status === 'string' ? [status] : status }
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
  if (notNilNorEmpty(limit)) {
    query.take = +limit
  }

  const result = await prisma.competition.findMany(query)

  return R.sort(statusesComparator)(result ?? [])
}
