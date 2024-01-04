import R from 'ramda'
import prisma from '~/services/prisma'
import { ResourceNotFoundError, InsufficientDataError } from '~/errors'
import { notNilNorEmpty } from '~/utils/notNilNorEmpty'
import { isNilOrEmpty } from '~/utils/isNilOrEmpty'
import { DEFAULT_CHALLENGE_FIELDS } from '../challenges/constants'

const SELECTED_CHALLENGE_FIELDS = R.pipe(
  R.map((f) => [f, true]),
  R.fromPairs,
  R.omit(['owner', 'challenger']),
)(DEFAULT_CHALLENGE_FIELDS)
const INCLUDED_CHALLENGE_FIELDS = {
  select: {
    ...SELECTED_CHALLENGE_FIELDS,
    owner: { select: { username: true } },
    challenger: { select: { username: true } },
  },
  orderBy: [
    {
      createdAt: 'desc',
    },
  ],
}
const INCLUDED_WALLET_FIELDS = {
  select: {
    id: true,
    balance: true,
    transactions: {
      select: {
        id: true,
        amount: true,
        description: true,
        metadata: true,
        type: true,
        createdAt: true,
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    },
    updatedAt: true,
  },
}

export const getStudentByUsernameInternal = async (username, filters = {}) => {
  if (isNilOrEmpty(username)) {
    throw new InsufficientDataError('Username field is required.')
  }

  const { withCompetitions, withChallenges, withWallet } = filters

  const include = {}
  if (withCompetitions) {
    include.competitions = true
  }
  if (withChallenges) {
    include.challengesOwner = INCLUDED_CHALLENGE_FIELDS
    include.challengesChallenger = INCLUDED_CHALLENGE_FIELDS
  }
  if (withWallet) {
    include.wallet = INCLUDED_WALLET_FIELDS
  }

  const query = { where: { username: { equals: username?.trim(), mode: 'insensitive' } } }
  if (notNilNorEmpty(include)) {
    query.include = include
  }

  const result = await prisma.student.findFirst(query)

  if (!result) {
    throw new ResourceNotFoundError(`Student not found with username ${username}.`)
  }

  return result
}
