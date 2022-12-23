import axios from 'axios'
import R from 'ramda'

const getChannelLeaderboard = async (discordGuild, neatQueueApiKey, channelName, channelId) => {
  const url = `https://host.neatqueue.com:2000/api/channelstats/${discordGuild}/${channelId}`
  try {
    const { data = [] } = await axios.get(url, {
      headers: {
        Authorization: neatQueueApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': '*',
      },
    })

    if (!R.isEmpty(data)) {
      data.length = 10
    }

    const items = R.map(
      R.applySpec({
        index: R.prop('num'),
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

export const listChannelsLeaderboard = async (discordGuild, neatQueueApiKey, channels) => {
  const result = await Promise.all(
    R.map(async ({ name, channelId }) => getChannelLeaderboard(discordGuild, neatQueueApiKey, name, channelId))(
      channels
    )
  )
  return R.filter(R.complement(R.isEmpty))(result)
}
