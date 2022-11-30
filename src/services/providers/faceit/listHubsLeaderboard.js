import axios from 'axios'
import R from 'ramda'
import { faceit as faceitConfig } from '~/config'

const getOngoingHubLeaderboard = async (hubId) => {
  const url = `https://open.faceit.com/data/v4/leaderboards/hubs/${hubId}?limit=10`
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${faceitConfig.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': '*',
      },
    })
    return R.pipe(
      R.filter((l) => l.status === 'ONGOING' && l.leaderboard_type !== 'hub_general'),
      R.head,
      R.when(
        R.isNil,
        R.always(
          R.pipe(
            R.filter((l) => l.leaderboard_type === 'hub_general'),
            R.head
          )(data?.items)
        )
      )
    )(data?.items ?? [])
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

const getHubGeneralLeaderboard = async (hubName, hubId) => {
  const url = `https://open.faceit.com/data/v4/leaderboards/hubs/${hubId}/general?offset=0&limit=10`
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${faceitConfig.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': '*',
      },
    })
    return { name: hubName, ...R.pick(['items'])(data) }
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

const getHubSeasonLeaderboard = async (hubName, hubId, season) => {
  const url = `https://open.faceit.com/data/v4/leaderboards/hubs/${hubId}/seasons/${season}?offset=0&limit=10`
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${faceitConfig.apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Accept-Encoding': '*',
      },
    })
    return { name: hubName, ...R.pick(['items'])(data) }
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

export const listHubsLeaderboard = async () => {
  const result = await Promise.all(
    R.map(async ({ name, entityId }) => {
      const leaderboard = await getOngoingHubLeaderboard(entityId)
      if (leaderboard?.season) {
        return getHubSeasonLeaderboard(name, entityId, leaderboard.season)
      }
      return getHubGeneralLeaderboard(name, entityId)
    })(faceitConfig.hubs)
  )
  return R.filter(R.complement(R.isEmpty))(result)
}
