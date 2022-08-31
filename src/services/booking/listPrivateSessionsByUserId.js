import { serializePrivateSessions } from '~/serializers'
import pg from '~/services/pg'

export const listPrivateSessionsByUserId = async (userId, hidden = false) => {
  if (userId == null) {
    return []
  }

  const query = {
    name: 'fetch-user-private-sessions',
    text: `SELECT et."title", et."slug", et."description", et."currency", et."price", et."length", et."userId"
      FROM public."EventType" as et
      WHERE et."userId" = $1
      AND et."hidden" = $2::bool
      AND et."title" NOT LIKE '%[P]%'`,
    values: [userId, hidden],
  }
  const result = await pg.query(query)
  return serializePrivateSessions([], result?.rows)
}
