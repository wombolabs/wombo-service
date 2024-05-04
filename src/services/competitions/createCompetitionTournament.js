import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import { notNilNorEmpty } from '~/utils'
import { createChallenge } from '../challenges'
import { addChallengeToCompetition } from './addChallengeToCompetition'
import { getCompetitionByCodename } from './getCompetitionByCodename'

export const createCompetitionTournament = async (codename, challengeData = {}) => {
  if (!codename) {
    throw new InsufficientDataError('Codename field are required.')
  }

  const competition = await getCompetitionByCodename(codename, { withParticipants: true })
  if (!competition) {
    throw new ResourceNotFoundError(`Competition not found with codename ${codename}.`)
  }

  const { participants } = competition
  if (notNilNorEmpty(participants) && participants.length >= 2) {
    const challenges = []

    // Create challenges for each pair of participants
    for (let i = 0; i < participants.length - 1; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        challenges.push([participants[i], participants[j]])
      }
    }

    await Promise.all(
      challenges.map(async ([owner, challenger]) => {
        const challenge = await createChallenge(owner.id, challengeData, challenger.id)

        await addChallengeToCompetition(codename, challenge.id)
      })
    )
  }
}
