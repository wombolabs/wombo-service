import R from 'ramda'
import prisma from '~/services/prisma'
import { discord } from '~/config'
import { InsufficientDataError } from '~/errors'
import { createGuildChannel, editChannelPermissions } from '../discord'
import { createChannelMessage } from '../discord/createChannelMessage'

const CHANNEL_USER_LIMIT = {
  player_vs_player: 2,
  two_vs_two: 4,
  team_vs_team: 10,
}
const PROFILE_URL = 'https://wombo.gg/p/'

export const createChallengeOnDiscord = async (challengeId) => {
  const {
    videoGame,
    type,
    owner = {},
    challenger = {},
  } = await prisma.challenge.findUnique({
    where: {
      id: challengeId,
    },
    select: {
      videoGame: true,
      type: true,
      owner: { select: { username: true, discord: true } },
      challenger: { select: { username: true, discord: true } },
    },
  })

  if (R.isEmpty(owner) || R.isEmpty(challenger)) {
    throw new InsufficientDataError('Challenge owner and challenger data are required.')
  }

  const challengePublicId = challengeId.split('-')[4]
  const guildChannelName = `${challengePublicId}-${videoGame?.toLowerCase().replaceAll(' ', '')}`

  const { id: guildChannelId } = await createGuildChannel({
    name: guildChannelName,
    type: discord.channelTypes.guildText,
    parentId: discord.guildCategories.challenges,
    userLimit: CHANNEL_USER_LIMIT[type],
  })

  if (guildChannelId) {
    const ownerId = owner?.discord?.id
    const challengerId = challenger?.discord?.id

    await Promise.all([
      editChannelPermissions(guildChannelId, ownerId),
      editChannelPermissions(guildChannelId, challengerId),
    ])

    const messageContent = {
      // eslint-disable-next-line max-len
      content: `DesafioID: ${challengePublicId}\nJuego: ${videoGame}\nParticipantes: <@${ownerId}> vs <@${challengerId}>`,
      embeds: [
        {
          title: owner.username,
          url: `${PROFILE_URL}${owner?.username}`,
          description: 'Wombo Perfil',
        },
        {
          title: challenger.username,
          url: `${PROFILE_URL}${challenger?.username}`,
          description: 'Wombo Perfil',
        },
      ],
    }
    await createChannelMessage(guildChannelId, messageContent)
  }
}
