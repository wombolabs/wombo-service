import R from 'ramda'
import { DEFAULT_COMPETITION_FIELDS } from '~/services/competitions'
import { serializeChallenges } from './serializeChallenges'

const serializeParticipants = R.curry((participants) =>
  R.map(
    R.pipe(
      R.pick(['id', 'username', 'metadata', 'stats']),
      R.evolve({
        metadata: R.curry((metadata) =>
          R.pipe(
            R.pick(['profile']),
            R.evolve({
              profile: R.curry((profile) => R.pick(['picture', 'country'])(profile)),
            }),
          )(metadata),
        ),
        stats: R.curry((stats) => R.unless(R.isNil, R.map(R.pick(['rating', 'cmsVideoGameHandleId'])))(stats)),
      }),
    ),
  )(participants),
)

export const serializeCompetition = R.curry((competition) =>
  R.pipe(
    R.pick([...DEFAULT_COMPETITION_FIELDS]),
    R.evolve({
      participants: serializeParticipants,
      challenges: serializeChallenges,
    }),
  )(competition),
)
