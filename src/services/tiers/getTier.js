import prisma from '~/services/prisma'

export const getTier = async (tierId) => {
  const tier = await prisma.tier.findUnique({
    where: { id: tierId },
    select: {
      billingInterval: true,
      discordRoleIds: true,
    },
  })
  if (tier == null) {
    throw new Error('Tier not found.')
  }
  return tier
}
