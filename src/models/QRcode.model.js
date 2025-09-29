const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// Raw data helpers
async function create(data) {
  return prisma.qRCode.create({ data });
}

async function findById(id) {
  const qr = await prisma.qRCode.findUnique({ where: { id } })
 
  return qr ;
}

async function findByTokenId(tokenId) {
  const qr = await prisma.qRCode.findUnique({ where: { tokenId } })
  return qr ;
}

module.exports = {
  create,
  findById,
  findByTokenId,
  prisma, // exported in case you need graceful shutdown
};