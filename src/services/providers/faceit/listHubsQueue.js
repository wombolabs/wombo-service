import axios from 'axios'
import R from 'ramda'
import { faceit as faceitConfig } from '~/config'

const getHubQueue = async (hubName, hubId) => {
  const url = `https://api.faceit.com/queue/v1/player/${hubId}`
  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${faceitConfig.userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
    return { name: hubName, queue: R.prop('payload')(data) }
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

export const listHubsQueue = async () => {
  const result = await Promise.all(R.map(({ name, id }) => getHubQueue(name, id))(faceitConfig.hubs))
  return R.filter(R.complement(R.isEmpty))(result)
}
