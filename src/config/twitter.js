export const twitter = {
  account: {
    wombotValorant: {
      credentials: {
        appKey: process.env.TWITTER_BOT_VAL_APP_TOKEN,
        appSecret: process.env.TWITTER_BOT_VAL_APP_SECRET,
        accessToken: process.env.TWITTER_BOT_VAL_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_BOT_VAL_ACCESS_SECRET,
      },
    },
    wombotLeagueOfLegends: {
      credentials: {
        appKey: process.env.TWITTER_BOT_LOL_APP_TOKEN,
        appSecret: process.env.TWITTER_BOT_LOL_APP_SECRET,
        accessToken: process.env.TWITTER_BOT_LOL_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_BOT_LOL_ACCESS_SECRET,
      },
    },
  },
}
