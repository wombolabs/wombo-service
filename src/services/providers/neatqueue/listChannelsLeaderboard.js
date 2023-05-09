import axios from 'axios'
import R from 'ramda'
import { axiosLoggerError } from '~/utils'

const mapIndexed = R.addIndex(R.map)

const getChannelLeaderboard = async (discordGuild, neatQueueApiKey, channelName, channelId) => {
  const url = `https://host.neatqueue.com:443/api/channelstats/${discordGuild}/${channelId}`
  try {
    const { data = {} } = await axios.get(url, {
      headers: {
        Authorization: neatQueueApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': '*',
      },
    })

    const items = mapIndexed((value, index) =>
      R.applySpec({
        id: R.prop('id'),
        index: R.always(index),
        username: R.prop('name'),
        mmr: R.path(['data', 'mmr']),
        wins: R.path(['data', 'wins']),
        losses: R.path(['data', 'losses']),
        streak: R.path(['data', 'streak']),
        totalGames: R.path(['data', 'totalgames']),
      })(value)
    )(data?.alltime ?? [])

    return { name: channelName, items }
  } catch (error) {
    axiosLoggerError(error)
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
