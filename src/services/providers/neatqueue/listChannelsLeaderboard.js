import axios from 'axios'
import R from 'ramda'
import { neatQueue as neatQueueConfig, discord as discordConfig } from '~/config'

const getChannelLeaderboard = async (channelName, channelId) => {
  const url = `https://host.neatqueue.com:2000/api/channelstats/${discordConfig.guildWombo}/${channelId}`
  try {
    const { data = [] } = await axios.get(url, {
      headers: {
        Authorization: neatQueueConfig.apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!R.isEmpty(data)) {
      data.length = 10
    }

    const items = R.map(
      R.applySpec({
        id: R.prop('id'),
        num: R.prop('num'),
        username: R.prop('name'),
        mmr: R.path(['data', 'mmr']),
        wins: R.path(['data', 'wins']),
        losses: R.path(['data', 'losses']),
        streak: R.path(['data', 'streak']),
        totalGames: R.path(['data', 'totalgames']),
      })
    )(data)

    return { name: channelName, items }
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

export const listChannelsLeaderboard = async () => {
  const result = await Promise.all(
    R.map(async ({ name, channelId }) => getChannelLeaderboard(name, channelId))(neatQueueConfig.channels)
  )
  return R.filter(R.complement(R.isEmpty))(result)
}
