import { updateStudentByEmail } from '~/services/students'
import { buildHandler } from '~/utils'
import { authenticationMiddleware } from '~/middlewares'
import prisma from '~/services/prisma'

const handler = async ({ user, body }, res) => {
  const { videoGames, user: { birthdate, displayName, country } = {} } = body
  const payload = { displayName, metadata: { videoGames, birthdate, country } }
  await updateStudentByEmail(user.email?.toLowerCase(), payload)

  const validFrom = new Date()
  const validTill = new Date()
  validTill.setMonth(validFrom.getMonth() + 1)
  const order = {
    student: {
      connect: { id: user.id },
    },
    type: 'subscription',
    stripe: {},
    tierId: '64bb8490-04fb-4d56-ac57-788ed03e43bd',
    validFrom,
    validTill,
    billingInterval: 'month',
    billingAmount: 0,
    billingCurrency: 'usd',
    status: 'active',
    livemode: true,
    metadata: { freeWomboPass: true },
  }
  await prisma.order.create({ data: order })

  return res.json({ activated: true })
}

export const setStudentMeFreePassHandler = buildHandler('/students/me/freepass', 'post', handler, {
  middlewares: [authenticationMiddleware],
})
