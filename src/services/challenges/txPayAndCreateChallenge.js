import { validate as uuidValidate } from 'uuid'

import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { isNilOrEmpty, notNilNorEmpty } from '~/utils'

import { createStudentWallet, STUDENT_WALLET_TRANSACTION_TYPES } from '../students'

/**
 * Pay and create a challenge.
 *
 * @param {string} ownerId - The owner ID.
 * @param {object} challengeData - The challenge data.
 *  @param {string} challengeData.id - The challenge ID.
 *  @param {string} challengeData.videoGame - The challenge video game
 *  @param {number} challengeData.betAmount - The challenge bet amount.
 *  @param {number} challengeData.fee - The challenge fee.
 *  @param {string} challengeData.type - The challenge type.
 *  @param {object} challengeData.metadata - The challenge metadata.
 *  @param {boolean} challengeData.isPublic - The challenge is public.
 *  @param {string} challengeData.groupId - The group ID.
 * @returns {Promise<object>} The created challenge.
 */
export const txPayAndCreateChallenge = async (ownerId, challengeData) => {
  if (!uuidValidate(ownerId) || isNilOrEmpty(challengeData)) {
    throw new InsufficientDataError('Student ID and challenge data are required.')
  }

  const { betAmount = 0, challengerBetAmount, groupId, ...challengeDataFields } = challengeData

  if (betAmount <= 0) {
    throw new InsufficientDataError('Bet amount must be greater than 0.')
  }

  if (notNilNorEmpty(challengerBetAmount) && challengerBetAmount <= 0) {
    throw new InsufficientDataError('Challenger bet amount must be greater than 0.')
  }

  const { id: walletId, balance } = await createStudentWallet(ownerId)

  if (balance < betAmount) {
    throw new InsufficientDataError('Insufficient funds.')
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
      data: {
        betAmount,
        challengerBetAmount,
        ...challengeDataFields,
        owner: {
          connect: { id: ownerId },
        },
        group: {
          connect: { id: groupId },
        },
      },
    }),
  ])

  return result
}
