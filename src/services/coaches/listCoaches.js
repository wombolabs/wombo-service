import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

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
  if (notNilNorEmpty(id)) {
    where.id = { in: id }
  }
  if (notNilNorEmpty(category)) {
    where.category = { in: category }
  }

  const query = {}
  if (notNilNorEmpty(where)) {
    query.where = where
  }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.coach.findMany(query)
  return result
}
