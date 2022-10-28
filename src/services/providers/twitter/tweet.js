import twitterClient from './twitter'

export const tweet = async (text) => {
  await twitterClient.v2.tweet({ text })
}
