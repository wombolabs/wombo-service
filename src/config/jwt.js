const issuer = 'wombo gaming inc.'

export const jwt = {
  secret: process.env.JWT_SECRET,
  options: {
    sign: {
      algorithm: 'HS256',
      issuer,
      expiresIn: '1y', // https://github.com/vercel/ms
    },
    verify: {
      algorithms: ['HS256'],
      issuer,
    },
  },
}
