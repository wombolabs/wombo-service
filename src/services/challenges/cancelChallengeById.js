import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'

import { CHALLENGE_STATUSES } from './constants'
import { getChallengeById } from './getChallengeById'

export const cancelChallengeById = async (id, ownerId) => {
  if (!uuidValidate(id) || !uuidValidate(ownerId)) {
    throw new InsufficientDataError('Invalid Challenge or Owner identification.')
  }

  const savedChallenge = await getChallengeById(id, { isActive: true })

  // the owner needs to be the same as the one who created the challenge
  if (savedChallenge.owner?.id !== ownerId) {
    throw new InsufficientDataError('Owner error on cancel challenge.')
  }

  // the challenge needs to be published
  if (CHALLENGE_STATUSES.PUBLISHED !== savedChallenge.status) {
    throw new InsufficientDataError('Status error on cancel challenge.')
  }

  const result = await prisma.challenge.update({ where: { id }, data: { status: CHALLENGE_STATUSES.CANCELLED } })

  if (!result) {
    throw new ResourceNotFoundError(`Challenge not found with id ${id}.`)
  }

  return result
}
