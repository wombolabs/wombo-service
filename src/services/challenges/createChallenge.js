import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { isNilOrEmpty, notNilNorEmpty } from '~/utils'

export const createChallenge = async (ownerId, challengeData, challengerId = null) => {
  if (!uuidValidate(ownerId) || isNilOrEmpty(challengeData)) {
    throw new InsufficientDataError('Student ID and challenge data are required.')
  }

  const data = {
    ...challengeData,
    owner: {
      connect: { id: ownerId },
    },
  }

  // connect challenger if exists
  if (notNilNorEmpty(challengerId)) {
    data.challenger = {
      connect: { id: challengerId },
    }
  }

  const result = await prisma.challenge.create({ data })

  return result
}
