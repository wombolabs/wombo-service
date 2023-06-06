import { validate as uuidValidate } from 'uuid'
import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { notNilNorEmpty } from '~/utils'
import { getChallengeById } from './getChallengeById'
import { CHALLENGE_STATUSES } from './constants'

export const updateChallengeById = async (id, challenge = {}) => {
  if (!uuidValidate(id)) {
    throw new InsufficientDataError('Invalid Challenge identification.')
  }
  if (!notNilNorEmpty(challenge)) {
    throw new InsufficientDataError('Required fields are missing for update challenge.')
  }

  const { ownerScore, challengerScore, status } = challenge

  const savedChallenge = await getChallengeById(id, { isActive: true })

  const data = {}

  if (ownerScore >= 0 && challengerScore >= 0 && CHALLENGE_STATUSES.IN_PROGRESS === savedChallenge.status) {
    data.ownerScore = ownerScore
    data.challengerScore = challengerScore
    data.status = CHALLENGE_STATUSES.FINISHED
  }

  if (
    savedChallenge.ownerScore >= 0 &&
    savedChallenge.challengerScore >= 0 &&
    CHALLENGE_STATUSES.REVIEWING === status
  ) {
    data.status = CHALLENGE_STATUSES.REVIEWING
  }

  let result = {}

  if (notNilNorEmpty(data)) {
    result = await prisma.challenge.update({
      where: { id },
      data,
    })

    if (!result) {
      throw new ResourceNotFoundError(`Challenge not found with id ${id}.`)
    }
  }

  return result
}
