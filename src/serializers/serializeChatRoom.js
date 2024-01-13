import R from 'ramda'
import { DEFAULT_STUDENT_CHAT_ROOM_FIELDS } from '~/services/students'

const serializeMetadataProfile = R.curry((profile) =>
  R.unless(
    R.isNil,
    R.pipe(
      R.pick(['picture', 'geoInfo']),
      R.evolve({
        geoInfo: R.curry((geoInfo) => R.unless(R.isNil, R.pick(['countryCode']))(geoInfo)),
      }),
    ),
  )(profile),
)

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

export const serializeChatRoom = R.curry((chatRoom) =>
  R.pipe(
    R.pick([...DEFAULT_STUDENT_CHAT_ROOM_FIELDS]),
    R.evolve({
      members: serializeMembers,
    }),
  )(chatRoom),
)
