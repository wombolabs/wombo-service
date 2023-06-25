import R from 'ramda'
import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

export const createChallenge = async (ownerId, challengeData = {}, challengerId = null) => {
  if (!ownerId || R.isEmpty(challengeData)) {
    throw new InsufficientDataError('Student ID and challenge data are required.')
  }

  const data = {
    ...challengeData,
    owner: {
      connect: { id: ownerId },
    },
  }

  if (notNilNorEmpty(challengerId)) {
    data.challenger = {
      connect: { id: challengerId },
    }
  }

  const result = await prisma.challenge.create({ data })

  return result
}
