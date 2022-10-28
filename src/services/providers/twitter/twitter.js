import { TwitterApi } from 'twitter-api-v2'
import { twitter as twitterConfig } from '~/config'

// eslint-disable-next-line import/no-mutable-exports
let twitterClient

if (twitterClient == null) {
  twitterClient = new TwitterApi({ ...twitterConfig.credentials })
}

export default twitterClient
