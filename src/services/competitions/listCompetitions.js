import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

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
        status: 'asc',
      },
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
  return result
}
