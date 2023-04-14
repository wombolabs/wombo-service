import R from 'ramda'
import prisma from '~/services/prisma'
import { discord } from '~/config'
import { InsufficientDataError } from '~/errors'
import { createGuildChannel, editChannelPermissions } from '../discord'

const CHANNEL_USER_LIMIT = {
  player_vs_player: 2,
  two_vs_two: 4,
  team_vs_team: 10,
}

export const createChallengeOnDiscord = async (challengeId) => {
  const {
    type,
    owner = {},
    challenger = {},
  } = await prisma.challenge.findUnique({
    where: {
      id: challengeId,
    },
    select: {
      type: true,
      owner: { select: { discord: true } },
      challenger: { select: { discord: true } },
    },
  })

  if (R.isEmpty(owner) || R.isEmpty(challenger)) {
    throw new InsufficientDataError('Challenge owner and challenger data are required.')
  }

  const { id: guildChannelId } = await createGuildChannel({
    name: challengeId,
    type: discord.channelTypes.guildVoice,
    parentId: discord.guildCategories.challenges,
    userLimit: CHANNEL_USER_LIMIT[type],
  })

  if (guildChannelId) {
    await Promise.all([
      editChannelPermissions(guildChannelId, owner?.discord?.id),
      editChannelPermissions(guildChannelId, challenger?.discord?.id),
    ])
  }
}
