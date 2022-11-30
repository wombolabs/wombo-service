import axios from 'axios'
import R from 'ramda'
import { neatQueue as neatQueueConfig } from '~/config'

const getChannelQueue = async (channelName, channelId) => {
  const url = `https://host.neatqueue.com:2000/api/queue/${channelId}/players`
  try {
    const { data = {} } = await axios.get(url, {
      headers: {
        Authorization: neatQueueConfig.apiKey,
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
    return {}
  }
}

export const listChannelsQueue = async () => {
  const result = await Promise.all(
    R.map(({ name, channelId }) => getChannelQueue(name, channelId))(neatQueueConfig.channels)
  )
  return R.filter(R.complement(R.isEmpty))(result)
}
