const prisma = require('../prisma')

const createStudentWithCredentials = async () => {
  const data = {
    email: 'info@wombo.gg',
    password: '$P$BTP/Ahe1laiJQ/Yz.rANer2GM5YnOa.',
  }
  await prisma.student.create({ data })
  console.log(`Added student ${data.email}`)
}

module.exports = {
  createStudentWithCredentials,
}
