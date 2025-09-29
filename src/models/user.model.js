const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// Raw data helpers
async function create(data) {
  return prisma.user.create({ data });
}

async function findMany() {
  return prisma.user.findMany({ orderBy: { id: "asc" } });
}

async function findById(id) {
  return prisma.user.findUnique({ where: { id } });
}

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function updateById(id, data) {
  return prisma.user.update({ where: { id }, data });
}

async function deleteById(id) {
  return prisma.user.delete({ where: { id } });
}

async function healthCheck() {
  return prisma.$queryRaw`SELECT 1`;
}

module.exports = {
  create,
  findMany,
  findById,
  findByEmail,
  updateById,
  deleteById,
  healthCheck,
  prisma, // exported in case you need graceful shutdown
};