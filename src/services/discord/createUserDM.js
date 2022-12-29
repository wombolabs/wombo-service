import axios from 'axios'
import { discord } from '~/config'
import { axiosLoggerError } from '~/utils'

export const createUserDM = async (discordUserId) => {
  const url = 'https://discord.com/api/users/@me/channels'
  let response
  try {
    response = await axios.post(
      url,
      {
        recipient_id: discordUserId,
      },
      {
        headers: {
          Authorization: `Bot ${discord.botToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('createUserDM | response=', response?.data)
  } catch (error) {
    axiosLoggerError(error)
  }
  return response?.data
}
