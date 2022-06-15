import R from 'ramda'
import prisma from '~/services/prisma'

export const listVideoGames = async (filters = {}) => {
  const { isActive, isFeatured } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (typeof isFeatured === 'boolean') {
    where.isFeatured = isFeatured
  }

  const query = {}
  if (!R.isEmpty(where)) {
    query.where = where
  }

  const result = await prisma.videoGame.findMany(query)
  return result
}
