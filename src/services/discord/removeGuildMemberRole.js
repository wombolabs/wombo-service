import axios from 'axios'
import { discord } from '~/config'
import { axiosLoggerError } from '~/utils'

export const removeGuildMemberRole = async (discordUserId, discordRoleId) => {
  const url = `https://discord.com/api/guilds/${discord.guildWombo}/members/${discordUserId}/roles/${discordRoleId}`
  try {
    const { data } = await axios.delete(url, null, {
      headers: {
        Authorization: `Bot ${discord.botToken}`,
        'Content-Type': 'application/json',
      },
    })
    console.log('removeGuildMemberRole | response=', data)
  } catch (error) {
    axiosLoggerError(error)
  }
}
