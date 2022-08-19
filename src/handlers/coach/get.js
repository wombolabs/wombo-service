import R from 'ramda'
import { getCoachByUsername } from '~/services/coaches'
import { buildHandler } from '~/utils'
import { serializeCoach } from '~/serializers'
import { listPrivateSessionsByUserId } from '~/services/booking'

const handler = async ({ params: { username }, query }, res) => {
  const { withPrivateSessions } = query

  const result = await getCoachByUsername(username, query)
  let coach = serializeCoach(result)

  const bookingUserId = result?.metadata?.bookingUserId
  if (typeof withPrivateSessions === 'boolean' && withPrivateSessions && bookingUserId) {
    const privateSessions = await listPrivateSessionsByUserId(bookingUserId)
    coach = R.assoc('privateSessions', privateSessions)(coach)
  }

  return res.json(coach)
}

export const getCoachHandler = buildHandler('/coaches/:username', 'get', handler)
