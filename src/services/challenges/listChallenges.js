import R from 'ramda'
import { validate as uuidValidate } from 'uuid'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'
import { statusesComparator } from './constants'

export const listChallenges = async (filters = {}) => {
  const { isActive, isBelongCompetition, status, dateStart, dateEnd, isPaid, studentId, competitionId, limit } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (notNilNorEmpty(status)) {
    where.status = { in: status }
  }
  if (typeof isBelongCompetition === 'boolean') {
    where.competitionId = isBelongCompetition ? { not: null } : null
  }
  if (notNilNorEmpty(dateStart) && notNilNorEmpty(dateEnd)) {
    where.updatedAt = {
      lte: new Date(dateEnd).toISOString(),
      gte: new Date(dateStart).toISOString(),
    }
  }
  if (typeof isPaid === 'boolean') {
    where.betAmount = isPaid ? { gt: 0 } : { equals: 0 }
  }
  if (uuidValidate(studentId)) {
    where.OR = [{ ownerId: { equals: studentId } }, { challengerId: { equals: studentId } }]
  }
  if (uuidValidate(competitionId)) {
    where.competitionId = { equals: competitionId }
  }

  const query = {
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
      competition: { select: { id: true } },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  }
  if (notNilNorEmpty(where)) {
    query.where = where
  }
  if (notNilNorEmpty(limit)) {
    query.take = +limit
  }

  const result = await prisma.challenge.findMany(query)

  return R.sort(statusesComparator)(result ?? [])
}
