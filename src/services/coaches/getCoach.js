import R from 'ramda'
import prisma from '~/services/prisma'

export const getCoach = async (username, filters = {}) => {
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
      username,
    },
  }
  if (!R.isEmpty(include)) {
    query.include = include
  }

  const result = await prisma.coach.findUnique(query)
  return result
}
