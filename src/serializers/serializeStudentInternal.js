import R from 'ramda'
import { DEFAULT_STUDENT_FIELDS } from '~/services/students'
import { serializeChallenges } from './serializeChallenges'

const DEFAULT_COMPETITION_FIELD = 'codename'

const serializeCompetitions = R.curry((competitions) => R.pluck(DEFAULT_COMPETITION_FIELD)(competitions))

export const serializeStudentInternal = R.curry((student) =>
  R.pipe(
    R.pick(['challengesOwner', 'challengesChallenger', 'isActive', ...DEFAULT_STUDENT_FIELDS]),
    R.evolve({
      discord: R.curry((discord) => R.pick(['id', 'username', 'discriminator'])(discord)),
      wallet: R.curry((wallet) => R.unless(R.isNil, R.pick(['id', 'balance', 'transactions', 'updatedAt']))(wallet)),
      competitions: serializeCompetitions,
      challengesOwner: serializeChallenges,
      challengesChallenger: serializeChallenges,
    })
  )(student)
)
