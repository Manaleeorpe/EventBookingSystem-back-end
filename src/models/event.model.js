const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// Raw data helpers
async function create(data) {
  return prisma.event.create({ data });
}

async function findManyEventCategory(category) {
  return prisma.event.findMany({ 
    where: {
      EventCategory: {
        equals:category, mode: 'insensitive'
      }
    },
    orderBy: {
      id:"asc"
    }
   });
}

async function findMany(where) {
  return prisma.event.findMany({where, orderBy: { id: "asc" } });
}

async function findById(id) {
  return prisma.event.findUnique({ where: { id } });
}

async function findByEventName(eventName) {
  return prisma.event.findUnique({ where: { eventName} });
}

async function updateById(id, data) {
  return prisma.event.update({ where: { id }, data });
}

async function deleteById(id) {
  return prisma.event.delete({ where: { id } });
}

module.exports = {
  create,
  findMany,
  findById,
  findByEventName,
  updateById,
  deleteById,findManyEventCategory,
  prisma, // exported in case you need graceful shutdown
};