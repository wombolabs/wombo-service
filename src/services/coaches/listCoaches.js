import R from 'ramda'
import prisma from '~/services/prisma'

export const listCoaches = async (filters = {}) => {
  const { id, isActive, category, withVideoGames, withTiers } = filters

  const include = {}
  if (withVideoGames) {
    include.videoGames = true
  }
  if (withTiers) {
    include.tiers = true
  }

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (!R.isEmpty(id)) {
    where.id = { in: id }
  }
  if (!R.isEmpty(category)) {
    where.category = { in: category }
  }

  const query = {}
  if (!R.isEmpty(where)) {
    query.where = where
  }
  if (!R.isEmpty(include)) {
    query.include = include
  }

  const result = await prisma.coach.findMany(query)
  return result
}
