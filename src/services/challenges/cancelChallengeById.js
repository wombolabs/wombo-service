import { validate as uuidValidate } from 'uuid'
import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { notNilNorEmpty } from '~/utils'
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

  const data = {}

  if (CHALLENGE_STATUSES.PUBLISEHD === savedChallenge.status) {
    data.status = CHALLENGE_STATUSES.CANCELLED
  } else {
    throw new InsufficientDataError('Status error on cancel challenge.')
  }

  let result = {}

  if (notNilNorEmpty(data)) {
    result = await prisma.challenge.update({ where: { id }, data })

    if (!result) {
      throw new ResourceNotFoundError(`Challenge not found with id ${id}.`)
    }
  }

  return result
}
