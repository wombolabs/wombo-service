import R from 'ramda'
import prisma from '~/services/prisma'

export const listTiers = async (filters = {}) => {
  const { codename, isActive } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (!R.isEmpty(codename)) {
    where.codename = { in: codename }
  }

  const query = {}
  if (!R.isEmpty(where)) {
    query.where = where
  }

  const result = await prisma.tier.findMany(query)
  return result
}
