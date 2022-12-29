import axios from 'axios'
import { discord } from '~/config'
import { axiosLoggerError } from '~/utils'

export const addGuildMemberRole = async (discordUserId, discordRoleId) => {
  const url = `https://discord.com/api/guilds/${discord.guildWombo}/members/${discordUserId}/roles/${discordRoleId}`
  try {
    const { data } = await axios.put(url, null, {
      headers: {
        Authorization: `Bot ${discord.botToken}`,
        'Content-Type': 'application/json',
      },
    })
    console.log('addGuildMemberRole | response=', data)
  } catch (error) {
    axiosLoggerError(error)
  }
}
