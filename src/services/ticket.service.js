const ticketRepo = require("../models/ticket.model");
const qrCodeRepo = require("../models/QRcode.model");
const QRservice = require("../services/QRcode.service");

async function createTicket({ userId, eventId, price }) {

    const Ticket = await ticketRepo.create({ userId, eventId, price, qrCodeId })
    if (!Ticket) {
        const err = new Error("Ticket not purchased");
        err.status = 400;
        throw err
    }
    return Ticket


}

async function getTicket(Id) {
    const Ticket = await ticketRepo.findById(Id)
    if (!Ticket) {
        const err = new Error("Ticket does not exist")
        err.status = 404;
        throw err
    }
    return Ticket
} 

//get user tickets

async function getUserTickets(userId) {

    const Tickets = await ticketRepo.getUserTickets(userId)

    //inside each of the tickets also add qrcode image to be scanned

    for (const ticket of Tickets) {
        const qr = await QRservice.getQRcode(ticket.qrCodeId)
       
        //scannable qr u have to add not just qr object
        ticket.qr= qr

    }

    if (!Tickets) {
        const err = new Error("User has not purchased any tickets")
        err.status = 400;
        throw err
    }return Tickets
    
}

async function getTicketByToken(tokenId) {
    //get qr code from token id
    
    const qrCode = await qrCodeRepo.findByTokenId(tokenId);



    const Ticket = await ticketRepo.findByQRcodeId(qrCode.id);
    console.log(qrCode.id)

    if (!Ticket || !qrCode) {
        const err = new Error("Ticket or QRcode does not exist")
        err.status = 400;
        throw err
    }

    return Ticket

}


async function scanTicket(id) {
    if (id) {
        const existing = await ticketRepo.findById(id);
        if (!existing) {
          const err = new Error("Ticket does not exist");
          err.status = 409;
          throw err;
        }
      }
      return ticketRepo.updateById(id, { IsScanned:true });
    
    
}
module.exports = {
  createTicket, getTicket,getTicketByToken,getUserTickets,scanTicket,
};