import { serializePrivateSessions } from '~/serializers'
import pg from '~/services/pg'

export const listPrivateSessionsByUserId = async (userId, hidden = false) => {
  if (userId == null) {
    return []
  }

  const query = {
    name: 'fetch-user-private-sessions',
    text: `SELECT * FROM public."EventType" where "userId" = $1 and "hidden" = $2::bool and "title" not like '%[P]%'`,
    values: [userId, hidden],
  }
  const result = await pg.query(query)
  return serializePrivateSessions([], result?.rows)
}
