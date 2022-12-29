import axios from 'axios'
import { discord } from '~/config'
import { axiosLoggerError } from '~/utils'

export const createChannelMessage = async (channelId, content) => {
  const url = `https://discord.com/api/channels/${channelId}/messages`
  let response
  try {
    response = await axios.post(
      url,
      {
        content,
      },
      {
        headers: {
          Authorization: `Bot ${discord.botToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('createChannelMessage | response=', response?.data)
  } catch (error) {
    axiosLoggerError(error)
  }
  return response?.data
}
