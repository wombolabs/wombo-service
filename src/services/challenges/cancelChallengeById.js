import { validate as uuidValidate } from 'uuid'
import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { getChallengeById } from './getChallengeById'
import { CHALLENGE_STATUSES } from './constants'

export const cancelChallengeById = async (id, ownerId) => {
  if (!uuidValidate(id) || !uuidValidate(ownerId)) {
    throw new InsufficientDataError('Invalid Challenge or Owner identification.')
  }

  const savedChallenge = await getChallengeById(id, { isActive: true })

  if (savedChallenge.owner?.id !== ownerId) {
    throw new InsufficientDataError('Owner error on cancel challenge.')
  }

  if (CHALLENGE_STATUSES.PUBLISHED !== savedChallenge.status) {
    throw new InsufficientDataError('Status error on cancel challenge.')
  }

  const result = await prisma.challenge.update({ where: { id }, data: { status: CHALLENGE_STATUSES.CANCELLED } })

  if (!result) {
    throw new ResourceNotFoundError(`Challenge not found with id ${id}.`)
  }

  return result
}
