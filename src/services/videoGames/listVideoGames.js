import R from 'ramda'
import prisma from '~/services/prisma'

export const listVideoGames = async (filters = {}) => {
  const { isActive, category } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (!R.isEmpty(category)) {
    where.category = { in: category }
  }

  const query = {}
  if (!R.isEmpty(where)) {
    query.where = where
  }

  const result = await prisma.videoGame.findMany(query)
  return result
}
