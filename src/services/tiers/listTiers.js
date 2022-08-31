import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const listTiers = async (filters = {}) => {
  const { codename, isActive } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (notNilNorEmpty(codename)) {
    where.codename = { in: codename }
  }

  const query = {}
  if (notNilNorEmpty(where)) {
    query.where = where
  }

  const result = await prisma.tier.findMany(query)
  return result
}
