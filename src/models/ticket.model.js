const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

// Raw data helpers
async function create(data) {
  return prisma.ticket.create({
    data,
    include: {
      event: true,
      user: true,
      qrCode: true,
    },
  });
}


async function updateById(id, data) {
  return prisma.ticket.update({ where: { id }, data });
}

//get user tickets


async function getUserTickets(userId) {
  return prisma.ticket.findMany({
    where: { userId }, // exact match on number
    orderBy: {
      event :{
      eventDateAndTime: 'desc'
    },
    },
   include: {
      event: true,
      user: true,
      qrCode: false,
    },
  });
}

async function findById(Id) {
    const ticket = await prisma.ticket.findUnique({
  where: { id: Id },
  include: {
    event: true,   // include full event object
    user: true,    // include full user object
    qrCode: false,  // include qrCode if exists
        },
  
 
    });
     return ticket

}
async function findByQRcodeId(qrCodeId) {
    const ticket = await prisma.ticket.findFirst({
  where: { qrCodeId: qrCodeId },
  include: {
    event: true,   // include full event object
    user: true,    // include full user object
    qrCode: true,  // include qrCode if exists
        },
  
 
    });
     return ticket

}

async function findByTokenId(eventTokenId) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      event: {
        is: {
          tokenId: eventTokenId
        }
      }
    },
    include: {
      event: true,
      user: true,
      qrCode: true,
    },
  });
  return ticket;
}


module.exports = {
    create, prisma,findById,findByTokenId,findByQRcodeId,getUserTickets,updateById,
}