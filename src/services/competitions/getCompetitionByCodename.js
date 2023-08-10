import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { isNilOrEmpty, notNilNorEmpty } from '~/utils'

export const getCompetitionByCodename = async (codename, filters = {}) => {
  if (isNilOrEmpty(codename)) {
    throw new InsufficientDataError('Codename field is required.')
  }

  const { withParticipants, withChallenges, isActive } = filters

  const query = { where: { codename: { equals: codename.trim(), mode: 'insensitive' } } }
  if (typeof isActive === 'boolean') {
    query.where.isActive = isActive
  }

  const include = {}
  if (withParticipants) {
    include.participants = {
      select: {
        id: true,
        username: true,
        metadata: true,
        stat: {
          select: {
            rating: true,
          },
        },
      },
    }
  }
  if (withChallenges) {
    include.challenges = {
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            metadata: true,
          },
        },
        challenger: {
          select: {
            id: true,
            username: true,
            metadata: true,
          },
        },
      },
    }
  }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.competition.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Competition not found with codename ${codename}.`)
  }

  return result
}
