import R from 'ramda'
import { DEFAULT_STAT_FIELDS } from '~/services/stats'

export const serializeStat = R.curry((stats) =>
  R.pipe(
    R.assoc('username', stats.owner?.username),
    R.assoc('totalMatches', stats.matchesWon + stats.matchesDraw + stats.matchesLost),
    R.assoc('winRate', Math.round((stats.matchesWon / (stats.matchesWon + stats.matchesLost)) * 100)),
    R.assoc(
      'avgOpponentsRating',
      Math.round(stats.accOpponentsRating / (stats.matchesWon + stats.matchesDraw + stats.matchesLost))
    ),
    R.assoc('matchesGoalsDifference', stats.matchesGoalsFor - stats.matchesGoalsAgainst),
    R.pick([...DEFAULT_STAT_FIELDS])
  )(stats)
)
