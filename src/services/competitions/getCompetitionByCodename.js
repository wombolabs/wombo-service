import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const getCompetitionByCodename = async (codename, filters = {}) => {
  if (!codename) {
    throw new InsufficientDataError('Codename field is required.')
  }

  const { withParcipants, withChallenges, isActive } = filters

  const query = { where: { codename: { equals: codename, mode: 'insensitive' } } }
  if (typeof isActive === 'boolean') {
    query.where.isActive = isActive
  }

  const include = {}
  if (withParcipants) {
    include.participants = true
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
