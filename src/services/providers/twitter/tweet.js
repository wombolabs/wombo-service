import { TwitterApi } from 'twitter-api-v2'

export const tweet = async (credentials, text) => {
  const twitterClient = new TwitterApi({ ...credentials })
  await twitterClient.v2.tweet({ text })
}
