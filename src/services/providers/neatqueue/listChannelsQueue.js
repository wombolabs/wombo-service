import axios from 'axios'
import R from 'ramda'
import { axiosLoggerError } from '~/utils'

const getChannelQueue = async (neatQueueApiKey, channelName, channelId) => {
  const url = `https://host.neatqueue.com:2000/api/queue/${channelId}/players`
  try {
    const { data = {} } = await axios.get(url, {
      headers: {
        Authorization: neatQueueApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': '*',
      },
    })

    return {
      name: channelName,
      queue: R.pipe(
        R.groupBy(R.prop('role')),
        R.map((r) => {
          const len = r.length
          return len > 2 ? `2/2 +${len - 2}` : `${len}/2`
        })
      )(data?.players ?? []),
      length: data?.players?.length ?? 0,
    }
  } catch (error) {
    axiosLoggerError(error)
    return {}
  }
}

export const listChannelsQueue = async (neatQueueApiKey, channels) => {
  const result = await Promise.all(
    R.map(({ name, channelId }) => getChannelQueue(neatQueueApiKey, name, channelId))(channels)
  )
  return R.filter(R.complement(R.isEmpty))(result)
}
