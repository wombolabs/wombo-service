import R from 'ramda'
import { validate as uuidValidate } from 'uuid'

import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

import { statusesComparator } from './constants'

export const listChallenges = async (filters = {}) => {
  const {
    isPublic, // list challenges that are public
    isActive, // list challenges that are active
    isBelongCompetition, // list challenges that belong to a competition
    status, // list challenges that are in status[]
    dateStart, // list challenges that are between dateStart and dateEnd
    dateEnd, // list challenges that are between dateStart and dateEnd
    isPaid, // list challenges that are paid
    studentId, // list challenges from studentId
    notStudentId, // avoid list challenges from studentId
    competitionId, // list challenges from competitionId
    cmsVideoGameHandleId, // list challenges from cmsVideoGameHandleId
    limit, // limit of challenges
  } = filters

  const where = {}
  if (typeof isActive === 'boolean') {
    where.isActive = isActive
  }
  if (typeof isPublic === 'boolean') {
    where.isPublic = isPublic
  }
  if (notNilNorEmpty(status)) {
    where.status = { in: typeof status === 'string' ? [status] : status }
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
  if (uuidValidate(notStudentId)) {
    where.ownerId = { not: notStudentId }
  }
  if (uuidValidate(competitionId)) {
    where.competitionId = { equals: competitionId }
  }
  if (notNilNorEmpty(cmsVideoGameHandleId)) {
    where.cmsVideoGameHandleId = { equals: cmsVideoGameHandleId }
  }

  const query = {
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          metadata: true,
          stats: {
            select: {
              rating: true,
              cmsVideoGameHandleId: true,
            },
          },
        },
      },
      challenger: {
        select: {
          id: true,
          username: true,
          metadata: true,
          stats: {
            select: {
              rating: true,
              cmsVideoGameHandleId: true,
            },
          },
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
  if (notNilNorEmpty(limit) && !Number.isNaN(parseInt(limit, 10))) {
    query.take = +limit
  }

  const result = await prisma.challenge.findMany(query)

  return R.sort(statusesComparator)(result ?? [])
}
