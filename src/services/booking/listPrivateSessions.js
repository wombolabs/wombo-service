import pg from '~/services/pg'

export const listPrivateSessions = async (hidden = false) => {
  const query = {
    name: 'fetch-private-sessions',
    text: 'SELECT * FROM public."EventType" where "hidden" = $1::bool',
    values: [hidden],
  }
  const result = await pg.query(query)
  return result?.rows
}
