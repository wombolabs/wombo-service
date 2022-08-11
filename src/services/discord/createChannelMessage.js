import axios from 'axios'
import { discord } from '~/config'

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
  return response?.data
}
