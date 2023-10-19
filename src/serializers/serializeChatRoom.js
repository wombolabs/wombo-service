import R from 'ramda'
import { DEFAULT_STUDENT_CHAT_ROOM_FIELDS } from '~/services/students'

const serializeMembers = R.curry((members) =>
  R.map((m) =>
    R.pipe(
      R.pick(['id', 'username', 'metadata', 'stat']),
      R.evolve({
        metadata: R.curry((metadata) =>
          R.pipe(
            R.pick(['profile']),
            R.evolve({
              profile: R.curry((profile) => R.pick(['picture', 'country'])(profile)),
            }),
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
