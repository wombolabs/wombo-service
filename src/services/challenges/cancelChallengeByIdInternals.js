import { validate as uuidValidate } from 'uuid'
import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { CHALLENGE_STATUSES } from './constants'
import { getChallengeByIdMinify } from './getChallengeByIdMinify'

export const cancelChallengeByIdInternals = async (id) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Challenge identification.')
  }

  const savedChallenge = await getChallengeByIdMinify(id, { isActive: true })

  // Check if challenge is already cancelled or finished
  if (CHALLENGE_STATUSES.CANCELLED === savedChallenge.status) {
    throw new InsufficientDataError('Challenge is already cancelled.')
  }
  if (CHALLENGE_STATUSES.FINISHED === savedChallenge.status) {
    throw new InsufficientDataError('Challenge is already finished.')
  }

  const result = await prisma.challenge.update({
    where: { id },
    data: { status: CHALLENGE_STATUSES.CANCELLED, ownerScore: null, challengerScore: null },
  })

  if (!result) {
    throw new ResourceNotFoundError(`Challenge not found with id ${id}.`)
  }

  return result
}
