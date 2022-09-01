import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const listVideoGames = async (filters = {}) => {
  const { isActive, category } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (notNilNorEmpty(category)) {
    where.category = { in: category }
  }

  const query = {}
  if (notNilNorEmpty(where)) {
    query.where = where
  }

  const result = await prisma.videoGame.findMany(query)
  return result
}
