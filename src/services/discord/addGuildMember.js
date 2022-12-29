import axios from 'axios'
import { discord } from '~/config'
import { axiosLoggerError } from '~/utils'

export const addGuildMember = async (discordUserId, discordUserAccessToken) => {
  const url = `https://discord.com/api/guilds/${discord.guildWombo}/members/${discordUserId}`
  try {
    const { data } = await axios.put(
      url,
      {
        access_token: discordUserAccessToken,
      },
      {
        headers: {
          Authorization: `Bot ${discord.botToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('addGuildMember | response=', data)
  } catch (error) {
    axiosLoggerError(error)
  }
}
