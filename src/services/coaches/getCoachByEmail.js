import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'

export const getCoachByEmail = async (email, filters = {}) => {
  if (!email) {
    throw new InsufficientDataError('Email field is required.')
  }

  const { withVideoGames, withTiers } = filters

  const include = {}
  if (withVideoGames) {
    include.videoGames = true
  }
  if (withTiers) {
    include.tiers = true
  }

  const query = {
    where: {
      email,
      isActive: true,
    },
  }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.coach.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Coach not found with email ${email}.`)
  }

  return result
}
