const { PrismaClient } = require('@prisma/client')

let prisma

if (prisma == null) {
  prisma = new PrismaClient()
}

module.exports = prisma
