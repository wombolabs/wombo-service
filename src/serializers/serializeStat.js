import R from 'ramda'
import { DEFAULT_STAT_FIELDS } from '~/services/stats'

export const serializeStat = R.curry((stats) =>
  R.pipe(
    R.assoc('student', {
      username: stats.owner?.username,
      country: stats.owner?.metadata?.profile?.country,
    }),
    R.assoc('totalMatches', stats.matchesWon + stats.matchesDraw + stats.matchesLost),
    R.assoc(
      'avgOpponentsRating',
      Math.round(stats.accOpponentsRating / (stats.matchesWon + stats.matchesDraw + stats.matchesLost)),
    ),
    R.assoc('matchesGoalsDifference', stats.matchesGoalsFor - stats.matchesGoalsAgainst),
    R.pick([...DEFAULT_STAT_FIELDS]),
  )(stats),
)
