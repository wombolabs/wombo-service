import R from 'ramda'

import { serializeStudentMetadata } from './serializeStudentMetadata'

export const serializeStudentPublic = R.curry((student) =>
  R.pipe(
    R.pick(['id', 'email', 'username', 'displayName', 'metadata', 'stats']),
    R.evolve({
      metadata: serializeStudentMetadata,
      stats: R.curry((stats) => R.unless(R.isNil, R.map(R.pick(['rating', 'cmsVideoGameHandleId'])))(stats)),
    }),
  )(student),
)
