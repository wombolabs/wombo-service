import Joi from 'joi'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

import { createStudentWallet, STUDENT_WALLET_TRANSACTION_TYPES } from '../students'
import { CHALLENGE_STATUSES } from './constants'

const validate = async (challengerId, challengeData) => {
  try {
    Joi.assert(challengerId, Joi.string().uuid().required(), 'challenger')

    await Joi.object({
      id: Joi.string().uuid().required(),
      betAmount: Joi.number().integer().min(1).required(),
      challengerBetAmount: Joi.number().integer().min(1).allow(null).optional(),
    }).validateAsync(challengeData)
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new InsufficientDataError(error.message)
    }
    throw error
  }
}

export const txPayAndEnrollChallenge = async (challengerId, challengeData) => {
  await validate(challengerId, challengeData)

  const { betAmount = 0, challengerBetAmount } = challengeData

  const { id: walletId, balance } = await createStudentWallet(challengerId)

  if (notNilNorEmpty(challengerBetAmount) && balance < challengerBetAmount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  if (balance < betAmount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  const result = await prisma.$transaction([
    prisma.walletTransaction.create({
      data: {
        amount: notNilNorEmpty(challengerBetAmount) ? -challengerBetAmount : -betAmount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.ENROLL_CHALLENGE,
        description: challengeData?.id,
        wallet: { connect: { id: walletId } },
      },
    }),
    prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: balance - (notNilNorEmpty(challengerBetAmount) ? challengerBetAmount : betAmount),
      },
    }),
    prisma.challenge.update({
      where: { id: challengeData?.id },
      data: {
        status: CHALLENGE_STATUSES.IN_PROGRESS,
        challenger: {
          connect: { id: challengerId },
        },
      },
    }),
  ])

  return result
}
