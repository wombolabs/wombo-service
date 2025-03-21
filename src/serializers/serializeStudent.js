import R from 'ramda'

import { DEFAULT_STUDENT_FIELDS } from '~/services/students'

import { serializeStudentMetadata } from './serializeStudentMetadata'

const DEFAULT_COMPETITION_FIELD = 'codename'

const serializeCompetitions = R.curry((competitions) => R.pluck(DEFAULT_COMPETITION_FIELD)(competitions))

export const serializeStudent = R.curry((student) =>
  R.pipe(
    R.pick([...DEFAULT_STUDENT_FIELDS]),
    R.evolve({
      metadata: serializeStudentMetadata,
      competitions: serializeCompetitions,
      wallet: R.curry((wallet) => R.unless(R.isNil, R.pick(['balance', 'updatedAt']))(wallet)),
      stats: R.curry((stats) => R.unless(R.isNil, R.map(R.pick(['rating', 'cmsVideoGameHandleId'])))(stats)),
    }),
  )(student),
)
