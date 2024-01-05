import R from 'ramda'
import { DEFAULT_STUDENT_FIELDS } from '~/services/students'
import { serializeChallenges } from './serializeChallenges'
import { serializeStudentMetadata } from './serializeStudentMetadata'

const DEFAULT_COMPETITION_FIELD = ['id', 'start', 'metadata']

const serializeCompetitions = R.curry((competitions) => R.project(DEFAULT_COMPETITION_FIELD)(competitions))

export const serializeStudentInternal = R.curry((student) =>
  R.pipe(
    R.pick(['challengesOwner', 'challengesChallenger', 'isActive', ...DEFAULT_STUDENT_FIELDS]),
    R.evolve({
      metadata: serializeStudentMetadata,
      wallet: R.curry((wallet) => R.unless(R.isNil, R.pick(['id', 'balance', 'transactions', 'updatedAt']))(wallet)),
      competitions: serializeCompetitions,
      challengesOwner: serializeChallenges,
      challengesChallenger: serializeChallenges,
    })
  )(student)
)
