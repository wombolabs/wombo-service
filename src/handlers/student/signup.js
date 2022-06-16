import { generateUserToken } from '~/services/generateUserToken'
import { updateStudentByEmail, upsertStudent } from '~/services/students'
import { buildHandler } from '~/utils'
import { addGuildMember } from '~/services/discord'
import { InsufficientDataError } from '~/errors'

const handler = async ({ body }, res) => {
  if (body.email == null) {
    throw new InsufficientDataError('Email field is required.')
  }
  if (body.discord?.id == null || body.discord?.accessToken == null || !body.discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(`Discord required fields are missing for student ${body.email}.`)
  }

  // eslint-disable-next-line no-param-reassign
  body.lastLogin = new Date()

  const { id, email, displayName, discord, discordJoinDate, timeZone, createdAt } = await upsertStudent(body)

  console.log(`signup | student=${id}, isDiscordMember=${discordJoinDate != null}`)
  if (discordJoinDate == null) {
    await addGuildMember(discord.id, discord.accessToken)

    await updateStudentByEmail(email, { discordJoinDate: new Date() })
  }

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

export const signupStudentHandler = buildHandler('/students/signup', 'post', handler)
