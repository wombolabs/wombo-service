import R from 'ramda'
import { buildHandler } from '~/utils'
import { getStudentByUsername } from '~/services/students'
import { CHALLENGE_STATUSES, listChallenges } from '~/services/challenges'

const handler = async ({ params: { username } }, res) => {
  const { id: studentId } = await getStudentByUsername(username)

  const challenges = await listChallenges({
    studentId,
    isActive: true,
    isBelongCompetition: false,
    status: CHALLENGE_STATUSES.FINISHED,
    isPaid: true,
  })

  const matches = {
    totalGames: challenges?.length || 0,
    matchesPlayed: 0, // MP | GP = stand for matches played
    gamesWon: 0, // W
    gamesDraw: 0, // D
    gamesLost: 0, // L
    goalsFor: 0, // GF | F = number of goals the team has scored across all matches played
    goalsAgainst: 0, // GA | A = number of goals the team has conceded across all of their matches
    goalDifference: 0, // GD
    points: 0,
    winRate: 0, // %
  }

  if (R.isEmpty(challenges)) return res.json(matches)

  R.forEach((v) => {
    if (v.owner.username === username) {
      if (v.ownerScore > v.challengerScore) {
        matches.gamesWon += 1
      } else if (v.ownerScore === v.challengerScore) {
        matches.gamesDraw += 1
      } else {
        matches.gamesLost += 1
      }
      matches.goalsFor += v.ownerScore
      matches.goalsAgainst += v.challengerScore
      matches.matchesPlayed += 1
    } else if (v.challenger.username === username) {
      if (v.challengerScore > v.ownerScore) {
        matches.gamesWon += 1
      } else if (v.challengerScore === v.ownerScore) {
        matches.gamesDraw += 1
      } else {
        matches.gamesLost += 1
      }
      matches.goalsFor += v.challengerScore
      matches.goalsAgainst += v.ownerScore
      matches.matchesPlayed += 1
    }
  })(challenges)

  matches.goalDifference = matches.goalsFor - matches.goalsAgainst
  matches.points = matches.gamesWon * 3 + matches.gamesDraw
  matches.winRate = Math.round((matches.gamesWon / (matches.gamesWon + matches.gamesLost)) * 100)

  return res.json(matches)
}

export const getStatsByUsernameHandler = buildHandler('/students/:username/stats', 'get', handler)
