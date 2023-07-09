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

  const { ownerScore, challengerScore } = challenge
  if (typeof ownerScore !== 'number' || typeof challengerScore !== 'number' || ownerScore < 0 || challengerScore < 0) {
    throw new InsufficientDataError('Required fields are missing or invalid values for update challenge.')
  }

  const savedChallenge = await getChallengeById(id, { isActive: true })

  const data = {}

  if (ownerScore >= 0 && challengerScore >= 0 && CHALLENGE_STATUSES.IN_PROGRESS === savedChallenge.status) {
    data.ownerScore = ownerScore
    data.challengerScore = challengerScore
    data.status = CHALLENGE_STATUSES.FINISHED
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
