export const jwt = {
  secret: process.env.JWT_SECRET,
  options: {
    sign: {
      algorithm: 'HS256',
    },
    verify: {
      algorithms: ['HS256'],
    },
  },
}
