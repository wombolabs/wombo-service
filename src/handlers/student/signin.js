import { AuthenticationError, InsufficientDataError } from '~/errors'
import { generateUserToken } from '~/services/generateUserToken'
import { getStudentByEmail, updateStudentByEmail } from '~/services/students'
import { buildHandler, comparePasswordHash } from '~/utils'

const handler = async ({ body }, res) => {
  if (body.email == null || body.password == null) {
    throw new InsufficientDataError('Email and password are required.')
  }

  // eslint-disable-next-line no-param-reassign
  body.lastLogin = new Date()

  const { id, email, password, displayName, discordJoinDate, timeZone, createdAt } = await getStudentByEmail(
    body.email?.toLowerCase()
  )

  const isValid = comparePasswordHash(body.password, password)
  if (!isValid) {
    throw new AuthenticationError()
  }

  await updateStudentByEmail(email, { lastLogin: new Date() })

  return res.json({
    accessToken: generateUserToken({
      id,
      email,
      displayName,
      discordJoinDate,
      timeZone,
      signUpDate: createdAt,
    }),
  })
}

export const signinStudentHandler = buildHandler('/students/signin', 'post', handler)
