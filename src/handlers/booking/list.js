import R from 'ramda'
import * as Sentry from '@sentry/serverless'
import { listPrivateSessions } from '~/services/booking'
import { buildHandler } from '~/utils'
import { serializePrivateSessions } from '~/serializers'
import { listCoaches } from '~/services/coaches'

const handler = async (_, res) => {
  let sessions = []
  try {
    sessions = await listPrivateSessions(true)
  } catch (error) {
    Sentry.captureException(error)
  }

  const coaches = await listCoaches({ isActive: true })

  const mapBookingUserId = R.pipe(R.indexBy(R.prop('id')), R.map(R.path(['metadata', 'bookingUserId'])))(coaches)

  const bookingUserIds = R.values(mapBookingUserId)

  const mapCoachId = R.invertObj(mapBookingUserId)

  sessions = R.reduce(
    (acc, s) => (R.includes(s.userId)(bookingUserIds) ? acc.concat(R.assoc('coachId', mapCoachId[s.userId])(s)) : acc),
    []
  )(sessions)

  return res.json(serializePrivateSessions(['coachId'])(sessions))
}

export const listBookingSessionsHandler = buildHandler('/booking/sessions', 'get', handler)
