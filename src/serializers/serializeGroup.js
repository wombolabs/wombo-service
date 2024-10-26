import R from 'ramda'

import { DEFAULT_GROUP_FIELDS } from '~/services/groups'

const serializeMetadataProfile = R.curry((profile) => R.unless(R.isNil, R.pipe(R.pick(['picture'])))(profile))

const serializeMembers = R.curry((members) =>
  R.map((m) =>
    R.pipe(
      R.pick(['id', 'username', 'metadata']),
      R.evolve({
        metadata: R.curry((metadata) =>
          R.unless(
            R.isNil,
            R.pipe(
              R.pick(['profile']),
              R.evolve({
                profile: serializeMetadataProfile,
              }),
            ),
          )(metadata),
        ),
      }),
    )(m.student),
  )(members),
)

export const serializeGroup = R.curry((group) =>
  R.pipe(
    R.pick([...DEFAULT_GROUP_FIELDS]),
    R.evolve({
      members: serializeMembers,
    }),
  )(group),
)
