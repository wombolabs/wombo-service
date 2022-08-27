import R from 'ramda'
import { getCoachByUsername } from '~/services/coaches'
import { buildHandler } from '~/utils'
import { serializeCoach } from '~/serializers'
import { listPrivateSessionsByUserId } from '~/services/booking'

const userBookingIds = {
  '793cc48a-0151-45ba-b90d-9636093be900': 4,
  'a38c77fa-c6fe-4d5a-8177-675641cc9c4e': 5,
  '1eb975fb-ba1a-4fff-a686-a831a5d116a5': 6,
  '7c940f00-90bf-4ca7-9ee9-f92ea08aa60b': 7,
  '37e096f7-4506-4637-994c-409c01b12a8a': 3,
  '37ecebc9-f39b-4591-b346-d5aca7f4766c': 14,
  'f5cdf27b-1fb1-42b1-8685-fa98cedf4d53': 15,
  '1669b52c-6375-4693-aaba-6606cb8b780d': 16,
  'ef4d07f6-af1b-491e-8a05-cc4bdc301dcf': 18,
  '53845be2-17de-476e-89c1-dc7002a6b08c': 21,
  '126adacc-ce40-4b2a-9720-21da0ede7423': 17,
  '7d058de1-6eb0-48f6-9137-c737257ec3da': 19,
  'c9829376-a5dd-49cd-be74-41f3d2b761e4': 20,
  '692412a4-78a9-45c3-a819-3efceaeb173b': 22,
  '3663929c-0aae-4284-9102-59bf88ec3748': 23,
  'a970bcbc-4d97-47f0-9947-2c65a07fdc61': 24,
  'afc54bb8-4a03-4602-947d-461616b2fbc5': 25,
  '396f84b4-2fd8-4a63-bd4c-b0948b747927': 27,
  '3ce948a6-3edc-46b7-a892-aabfe334c358': 26,
  '905fcd76-05b4-4a2f-96f0-63f1c243964b': 28,
  '5bb04c5b-e74d-4107-8db3-d8bbad97e4c4': 30,
  '4b57e72f-6747-4743-815b-7a380b7856c9': 29,
  'bdc5c317-3039-404b-819d-781b938ad4e8': 13,
}

const handler = async ({ params: { username }, query }, res) => {
  const { withPrivateSessions } = query

  const result = await getCoachByUsername(username, query)
  let coach = serializeCoach(result)

  // const bookingUserId = result?.metadata?.bookingUserId // TODO do database migration
  const bookingUserId = userBookingIds[coach.id]
  if (typeof withPrivateSessions === 'boolean' && withPrivateSessions && bookingUserId) {
    const privateSessions = await listPrivateSessionsByUserId(bookingUserId)
    coach = R.assoc('privateSessions', privateSessions)(coach)
  }

  return res.json(coach)
}

export const getCoachHandler = buildHandler('/coaches/:username', 'get', handler)
