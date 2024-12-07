import Joi from 'joi'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'

import { getGroupCategoryById } from '../groups'
import { createStudentWallet, STUDENT_WALLET_TRANSACTION_TYPES } from '../students'

const validate = async (ownerId, challengeData) => {
  try {
    Joi.assert(ownerId, Joi.string().uuid().required(), 'owner')

    await Joi.object({
      id: Joi.string().uuid(),
      videoGame: Joi.string().max(50),
      betAmount: Joi.number().integer().min(1).required(),
      challengerBetAmount: Joi.number().integer().min(1).allow(null).optional(),
      fee: Joi.number().integer().min(1).required(),
      type: Joi.string().max(40),
      description: Joi.string().min(0).max(500).allow(null).optional(),
      metadata: Joi.object().allow(null).optional(),
      isPublic: Joi.boolean(),
      cmsVideoGameHandleId: Joi.string().uuid(),
      groupId: Joi.string().uuid().allow(null).optional(),
    }).validateAsync(challengeData)
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      throw new InsufficientDataError(error.message)
    }
    throw error
  }
}

export const txPayAndCreateChallenge = async (ownerId, challengeData) => {
  await validate(ownerId, challengeData)

  const { betAmount = 0, challengerBetAmount, groupId, fee: challengeFee, ...challengeDataFields } = challengeData

  const { id: walletId, balance } = await createStudentWallet(ownerId)

  if (balance < betAmount) {
    throw new InsufficientDataError('Insufficient funds.')
  }

  let fee = challengeFee

  if (notNilNorEmpty(groupId)) {
    const group = await getGroupCategoryById(groupId, { isActive: true })
    fee = group?.category?.fee
  }

  const createChallengeData = {
    betAmount,
    challengerBetAmount,
    fee,
    ...challengeDataFields,
    owner: {
      connect: { id: ownerId },
    },
  }
  if (notNilNorEmpty(groupId)) {
    createChallengeData.group = {
      connect: { id: groupId },
    }
  }

  const result = await prisma.$transaction([
    prisma.walletTransaction.create({
      data: {
        amount: -betAmount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.CREATE_CHALLENGE,
        description: challengeData?.id,
        wallet: { connect: { id: walletId } },
      },
    }),
    prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: balance - betAmount,
      },
    }),
    prisma.challenge.create({
      data: createChallengeData,
    }),
  ])

  return result
}
