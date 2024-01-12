import R from 'ramda'
import { DEFAULT_STAT_FIELDS } from '~/services/stats'

export const serializeStat = R.curry((stat) =>
  R.unless(
    R.isNil,
    R.pipe(
      R.assoc('student', {
        username: stat.owner?.username,
        countryCode: stat.owner?.metadata?.profile?.geoInfo?.countryCode ?? {},
      }),
      R.assoc('totalMatches', stat.matchesWon + stat.matchesDraw + stat.matchesLost),
      R.assoc(
        'avgOpponentsRating',
        Math.round(stat.accOpponentsRating / (stat.matchesWon + stat.matchesDraw + stat.matchesLost)),
      ),
      R.assoc('matchesGoalsDifference', stat.matchesGoalsFor - stat.matchesGoalsAgainst),
      R.pick([...DEFAULT_STAT_FIELDS]),
    ),
  )(stat),
)
