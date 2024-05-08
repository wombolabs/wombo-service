import R from 'ramda'
import { DEFAULT_COMPETITION_FIELDS } from '~/services/competitions'
import { serializeChallenges } from './serializeChallenges'

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

const serializeParticipants = R.curry((participants) =>
  R.map(
    R.pipe(
      R.pick(['id', 'username', 'metadata', 'stats']),
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
        stats: R.curry((stats) => R.unless(R.isNil, R.map(R.pick(['rating', 'cmsVideoGameHandleId'])))(stats)),
      }),
    ),
  )(participants),
)

const serializePredictions = R.curry((predictions) =>
  R.map(
    R.pipe(
      R.pick(['id', 'metadata', 'createdAt', 'owner']),
      R.evolve({
        owner: R.curry((owner) =>
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
          )(owner),
        ),
      }),
    ),
  )(predictions),
)

export const serializeCompetition = R.curry((competition) =>
  R.pipe(
    R.pick([...DEFAULT_COMPETITION_FIELDS]),
    R.evolve({
      participants: serializeParticipants,
      challenges: serializeChallenges,
      predictions: serializePredictions,
    }),
  )(competition),
)
