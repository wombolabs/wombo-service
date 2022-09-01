import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const getCoachByUsername = async (username, filters = {}) => {
  if (!username) {
    throw new InsufficientDataError('Username field is required.')
  }

  const { withVideoGames, withTiers, isActive } = filters

  const query = { where: { username: { contains: username, mode: 'insensitive'  }} }
  if (typeof isActive === 'boolean') {
    query.where.isActive = isActive
  }

  const include = {}
  if (withVideoGames) {
    include.videoGames = true
  }
  if (withTiers) {
    include.tiers = true
  }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.coach.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Coach not found with username ${username}.`)
  }

  return result
}
