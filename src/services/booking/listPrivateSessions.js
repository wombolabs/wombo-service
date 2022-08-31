import pg from '~/services/pg'

export const listPrivateSessions = async (hidden = false) => {
  const query = {
    name: 'fetch-private-sessions',
    text: `SELECT et."title", et."slug", et."description", et."currency", et."price", et."length", et."userId"
      FROM public."EventType" AS et
      LEFT JOIN public."users" AS u
      ON et."userId" = u."id"
      WHERE et."hidden" = $1::bool
      AND et."title" NOT LIKE '%[P]%'
      AND u."away" = false`,
    values: [hidden],
  }
  const result = await pg.query(query)
  return result?.rows
}
