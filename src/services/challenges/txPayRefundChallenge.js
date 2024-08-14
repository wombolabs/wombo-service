import { validate as uuidValidate } from 'uuid'
import { InsufficientDataError } from '~/errors'
import prisma from '~/services/prisma'
import { notNilNorEmpty } from '~/utils'
import { STUDENT_WALLET_TRANSACTION_TYPES, getWalletByStudentId } from '../students'
import { CHALLENGE_USER_TYPE } from './constants'

/**
 * Pay refund of challenge.
 *
 * @param {string} userType - The user type. OWNER or CHALLENGER.
 * @param {string} userId - The user ID.
 * @param {string} challengeId - The challenge ID.
 * @param {number} betAmount - The owner bet amount.
 * @param {number} challengerBetAmount - The challenger bet amount.
 * @returns {Promise<object>} The transaction result.
 */
export const txPayRefundChallenge = async (
  userType, // OWNER or CHALLENGER,
  userId,
  challengeId,
  betAmount, // ownerBetAmount or totalBetAmount if challengerBetAmount is null
  challengerBetAmount,
) => {
  if (!uuidValidate(userId) || !uuidValidate(challengeId)) {
    throw new InsufficientDataError('Invalid Challenge or User identification.')
  }

  const wallet = await getWalletByStudentId(userId)

  let amount = betAmount
  if (notNilNorEmpty(challengerBetAmount) && challengerBetAmount > 0) {
    amount = userType === CHALLENGE_USER_TYPE.OWNER ? betAmount : challengerBetAmount
  }

  const result = await prisma.$transaction([
    prisma.walletTransaction.create({
      data: {
        amount,
        type: STUDENT_WALLET_TRANSACTION_TYPES.REFUND,
        description: challengeId,
        wallet: { connect: { id: wallet.id } },
      },
    }),
    prisma.wallet.update({
      where: {
        id: wallet.id,
      },
      data: {
        balance: wallet.balance + amount,
      },
    }),
  ])

  return result
}
