import R from 'ramda'
import { DEFAULT_CHALLENGE_FIELDS } from '~/services/challenges'

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

const serializeStudent = R.curry((student) =>
  R.unless(
    R.isNil,
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
  )(student),
)

export const serializeChallenge = R.curry((challenge) =>
  R.pipe(
    R.pick([...DEFAULT_CHALLENGE_FIELDS]),
    R.evolve({
      owner: serializeStudent,
      challenger: serializeStudent,
    }),
  )(challenge),
)
