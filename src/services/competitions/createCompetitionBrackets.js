import { BracketsManager } from 'brackets-manager'
import { InMemoryDatabase } from 'brackets-memory-db'

import { InsufficientDataError, ResourceNotFoundError } from '~/errors'
import prisma from '~/services/prisma'
import { isNilOrEmpty, notNilNorEmpty } from '~/utils'

import { createChallenge } from '../challenges'
import { addChallengeToCompetition } from './addChallengeToCompetition'

// Calculate the smallest power of 2 greater than or equal to n
const nextPowerOf2 = (num) => {
  let n = num
  let count = 0

  // First n in the below condition is for the case where n is 0
  if (n && !(n & (n - 1))) return n

  while (n !== 0) {
    n >>= 1
    count += 1
  }

  return 1 << count
}

const createBrackets = async (competitionId, competitionCodename, participants) => {
  const storage = new InMemoryDatabase()
  const manager = new BracketsManager(storage)

  await manager.create.stage({
    name: competitionCodename,
    tournamentId: competitionId,
    type: 'single_elimination',
    seeding: participants?.map((p) => ({ id: p.id, name: p.username })),
    settings: {
      balanceByes: true,
      size: nextPowerOf2(participants?.length),
    },
  })

  const brackets = await manager.get.stageData(0)
  return brackets
}

/**
 * Creates a competition bracket for a given competition codename
 *
 * @param {string} codename
 * @param {object} challengeData
 *  @param {string} challengeData.videoGame
 *  @param {object} challengeData.metadata
 *   @param {uuid} challengeData.metadata.cmsHandleId
 *  @param {uuid} challengeData.cmsVideoGameHandleId
 * @returns {Promise<void>}
 */
export const createCompetitionBrackets = async (codename, challengeData) => {
  if (isNilOrEmpty(codename)) {
    throw new InsufficientDataError('Codename field is required.')
  }

  const competition = await prisma.competition.findFirst({
    where: { codename: { equals: codename.trim(), mode: 'insensitive' } },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
  if (!competition) {
    throw new ResourceNotFoundError(`Competition not found with codename ${codename}.`)
  }

  const brackets = await createBrackets(competition.id, codename, competition.participants)

  await prisma.competition.update({
    where: {
      codename,
    },
    data: {
      metadata: {
        brackets,
        ...(competition.metadata || {}),
      },
    },
  })

  await Promise.all(
    brackets.match
      ?.filter(
        (m) =>
          (m.round_id === 0 || m.round_id === 1) && notNilNorEmpty(m.opponent1?.id) && notNilNorEmpty(m.opponent2?.id),
      )
      .map(async (match) => {
        const challenge = await createChallenge(
          match.opponent1.id,
          {
            videoGame: challengeData.videoGame,
            metadata: { bracketMatchId: match.id, ...challengeData.metadata },
            cmsVideoGameHandleId: challengeData.cmsVideoGameHandleId,
            status: 'in_progress',
          },
          match.opponent2.id,
        )
        await addChallengeToCompetition(codename, challenge.id)
      }),
  )
}
