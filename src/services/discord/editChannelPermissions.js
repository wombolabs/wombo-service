import axios from 'axios'
import { discord } from '~/config'
import { axiosLoggerError } from '~/utils'

export const editChannelPermissions = async (channelId, userId) => {
  // https://discord.com/developers/docs/resources/channel#edit-channel-permissions
  const url = `https://discord.com/api/v9//channels/${channelId}/permissions/${userId}`
  let response
  try {
    response = await axios.put(
      url,
      {
        type: 1, // 0 role | 1 member
        allow: '3072',
        deny: '0',
      },
      {
        headers: {
          Authorization: `Bot ${discord.botToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('editChannelPermissions | status=', response?.status)
  } catch (error) {
    axiosLoggerError(error)
  }
  return response?.status
}
