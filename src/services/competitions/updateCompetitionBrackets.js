import { BracketsManager } from 'brackets-manager'
import { InMemoryDatabase } from 'brackets-memory-db'

import { notNilNorEmpty } from '~/utils'

import { createChallenge } from '../challenges'
import { addChallengeToCompetition } from './addChallengeToCompetition'
import { getCompetitionById } from './getCompetitionById'
import { updateCompetitionById } from './updateCompetitionById'

export const updateCompetitionBrackets = async (challengeData) => {
  const competition = await getCompetitionById(challengeData?.competitionId)
  if (notNilNorEmpty(competition?.metadata?.brackets)) {
    const matchId = challengeData?.metadata?.bracketMatchId
    const matchIndex = competition.metadata.brackets.match.findIndex((m) => m.id === matchId)
    if (matchIndex >= 0) {
      const { ownerId, ownerScore, challengerScore } = challengeData
      const match = competition.metadata.brackets.match[matchIndex]
      if (match?.opponent1?.id === ownerId) {
        match.opponent1.score = ownerScore
        match.opponent2.score = challengerScore
        match.opponent1.result = ownerScore > challengerScore ? 'win' : 'loss'
        match.opponent2.result = ownerScore > challengerScore ? 'loss' : 'win'
      } else {
        match.opponent1.score = challengerScore
        match.opponent2.score = ownerScore
        match.opponent1.result = ownerScore > challengerScore ? 'loss' : 'win'
        match.opponent2.result = ownerScore > challengerScore ? 'win' : 'loss'
      }

      const storage = new InMemoryDatabase()
      storage.setData(competition.metadata.brackets)
      const manager = new BracketsManager(storage)

      await manager.update.match(match)

      const brackets = await manager.get.stageData(0)

      await updateCompetitionById(challengeData.competitionId, {
        metadata: { ...(competition?.metadata || {}), brackets },
      })

      const nextMatch = (await manager.find.nextMatches(matchId))?.[0]
      if (notNilNorEmpty(nextMatch?.opponent1?.id) && notNilNorEmpty(nextMatch?.opponent2?.id)) {
        const challenge = await createChallenge(
          nextMatch.opponent1.id,
          {
            videoGame: challengeData.videoGame,
            metadata: { ...(challengeData.metadata || {}), bracketMatchId: nextMatch.id },
            cmsVideoGameHandleId: challengeData.cmsVideoGameHandleId,
            status: 'in_progress',
          },
          nextMatch.opponent2.id,
        )
        await addChallengeToCompetition(competition.codename, challenge.id)
      }
    }
  }
}
