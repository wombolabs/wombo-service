import R from 'ramda'
import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

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
    },
  }
  if (!R.isEmpty(include)) {
    query.include = include
  }

  const result = await prisma.coach.findUnique(query)

  if (!result) {
    throw new ResourceNotFoundError()
  }

  return result
}
