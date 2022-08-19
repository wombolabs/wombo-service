export const booking = {
  pg: {
    connectionString: process.env.BOOKING_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  }
}
