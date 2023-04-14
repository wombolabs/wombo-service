import axios from 'axios'
import { discord } from '~/config'
import { axiosLoggerError } from '~/utils'

export const createGuildChannel = async ({ name, type, topic, userLimit, parentId }) => {
  // https://discord.com/developers/docs/resources/guild#create-guild-channel
  const url = `https://discord.com/api/v9/guilds/${discord.guildWombo}/channels`
  let response
  try {
    response = await axios.post(
      url,
      {
        name,
        type,
        topic,
        user_limit: userLimit,
        parent_id: parentId
      },
      {
        headers: {
          Authorization: `Bot ${discord.botToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('createGuildChannel | response=', response?.data)
  } catch (error) {
    axiosLoggerError(error)
  }
  return response?.data
}
