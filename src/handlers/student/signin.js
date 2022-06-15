import { AuthenticationError, InsufficientDataError } from '~/errors'
import { generateUserToken } from '~/services/generateUserToken'
import { getStudentByEmail, updateStudentByEmail } from '~/services/students'
import { buildHandler, comparePasswordHash } from '~/utils'

const handler = async ({ body }, res) => {
  if (body.email == null || body.password == null) {
    throw new InsufficientDataError()
  }

  const { id, email, password, displayName, isDiscordMember, timeZone, createdAt } = await getStudentByEmail(
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
      isDiscordMember,
      timeZone,
      createdAt,
    }),
  })
}

export const signinStudentHandler = buildHandler('/students/signin', 'post', handler)
