import R from 'ramda'
import prisma from '~/services/prisma'
import { InsufficientDataError } from '~/errors'
import { DEFAULT_CHALLENGE_FIELDS, statusesComparator } from '../challenges/constants'

const SELECTED_FIELDS = R.pipe(
  R.map((f) => [f, true]),
  R.fromPairs,
  R.omit(['owner', 'challenger'])
)(DEFAULT_CHALLENGE_FIELDS)

export const getStudentChallenges = async (email) => {
  if (!email) {
    throw new InsufficientDataError('Email field is required.')
  }

  const result = await prisma.student.findFirst({
    where: {
      email,
      isActive: true,
    },
    select: {
      challengesOwner: {
        select: {
          ...SELECTED_FIELDS,
          challenger: { select: { username: true, metadata: true } },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      },
      challengesChallenger: {
        select: {
          ...SELECTED_FIELDS,
          owner: { select: { username: true, metadata: true } },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      },
    },
  })

  return R.evolve({
    challengesOwner: R.sort(statusesComparator),
    challengesChallenger: R.sort(statusesComparator),
  })(result)
}
