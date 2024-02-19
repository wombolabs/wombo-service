import { validate as uuidValidate } from 'uuid'
import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { isNilOrEmpty } from '~/utils'
import { getChallengeById } from './getChallengeById'
import { CHALLENGE_STATUSES } from './constants'

export const finishChallengeById = async (id, challenge = {}) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Challenge identification.')
  }

  const { ownerScore, challengerScore } = challenge
  if (typeof ownerScore !== 'number' || typeof challengerScore !== 'number' || ownerScore < 0 || challengerScore < 0) {
    throw new InsufficientDataError('Required fields are missing or invalid values for finish challenge.')
  }

  const savedChallenge = await getChallengeById(id, { isActive: true })

  if (savedChallenge?.status === CHALLENGE_STATUSES.FINISHED) {
    throw new InsufficientDataError('Challenge is already finished.')
  }

  const result = await prisma.challenge.update({
    where: { id },
    data: { ownerScore, challengerScore, status: CHALLENGE_STATUSES.FINISHED },
  })

  if (isNilOrEmpty(result)) {
    throw new ResourceNotFoundError(`Challenge not found with id ${id}.`)
  }

  return result
}
