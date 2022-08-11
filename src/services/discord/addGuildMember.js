import axios from 'axios'
import { discord } from '~/config'

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
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
  }
}
