/* eslint-disable no-param-reassign */
import { generateUserToken } from '~/services/generateUserToken'
import { updateStudentByEmail, upsertStudent } from '~/services/students'
import { buildHandler } from '~/utils'
import { addGuildMember } from '~/services/discord'
import { InsufficientDataError } from '~/errors'

const handler = async ({ body }, res) => {
  if (body.discord?.id == null || body.discord?.accessToken == null || !body.discord?.scope.includes('guilds.join')) {
    throw new InsufficientDataError(
      `Discord required fields are missing for student ${body.email || body.username}.`,
      400,
      body
    )
  }

  if (body.email == null) {
    body.email = `${body.discord.id}@autogenerated.wombo.gg`
  }

  body.lastLogin = new Date()

  const { id, email, discord, discordJoinDate } = await upsertStudent(body)

  console.log(`signup | student=${id}, isDiscordMember=${discordJoinDate != null}`)
  if (discordJoinDate == null) {
    await addGuildMember(discord.id, discord.accessToken)

    await updateStudentByEmail(email, { discordJoinDate: new Date() })
  }

  return res.json({
    accessToken: generateUserToken({ id, email }),
  })
}

export const signupStudentHandler = buildHandler('/students/signup', 'post', handler)
