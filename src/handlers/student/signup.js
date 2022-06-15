import { generateUserToken } from '~/services/generateUserToken'
import { updateStudentByEmail, upsertStudent } from '~/services/students'
import { buildHandler } from '~/utils'
import { addGuildMember } from '~/services/discord'
import R from 'ramda'
import { InsufficientDataError } from '~/errors'

const handler = async ({ body }, res) => {
  if (body.email == null || R.isEmpty(body.discord) || body.lastLogin == null) {
    throw new InsufficientDataError()
  }

  const { id, email, displayName, discord, discordJoinDate, timeZone, createdAt } = await upsertStudent(body)

  console.log('signup | email=', email, 'isDiscordMember=', discordJoinDate != null)
  if (discordJoinDate == null && !R.isEmpty(discord)) {
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
      createdAt,
    }),
  })
}

export const signupStudentHandler = buildHandler('/students/signup', 'post', handler)
