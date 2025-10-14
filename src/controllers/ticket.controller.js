const service = require("../services/ticket.service");
const QRservice = require("../services/QRcode.service");
const Eventservice = require("../services/event.service");
const { parseId } = require("../middlewares/utils");
const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();


async function createTicket(req, res, next) {
    try {
        const { userId, eventId, price } = req.body;
        const QR = await QRservice.createQRcode();
        qrCodeId = QR.id

        //reduce available seats

        await Eventservice.reduceSeats(eventId, 1)

        const qr = await QRservice.getQRcode(QR.id) // adding the qr code object

        const ticket = await service.createTicket({ userId, eventId, price, qrCodeId });

        res.status(201).json({ticket, qr: qr} );
    } catch (e) {
        next(e); 
    }
}


async function viewTicket(req, res, next) {
  try {
    const id = req.params.id;

    
    const ticket = await service.getTicket(parseId(id));
    console.log(ticket.qrCodeId);
    

    //get the qr from the database 
    const qr = await QRservice.getQRcode(ticket.qrCodeId)
    
    res.status(201).json({ ticket, qr: qr });


  } catch (e) {
    next(e);
  }
}

//get users tickets
async function getUserTickets(req, res, next) {
  try {
    const userId = req.params.id;

    const tickets = await service.getUserTickets( parseId(userId));
    //console.log(tickets);

    
    
    res.status(201).json(tickets);


  } catch (e) {
    next(e);
  }
}

async function debugTicketIssue(req, res, next) {
  try {
    const tokenId = req.params.tokenId;
    console.log("=== COMPREHENSIVE TICKET DEBUG ===");
    console.log("1. Token ID being searched:", tokenId);
    
    // Step 1: Get the ticket with raw query
    const ticket = await service.getTicketByToken(tokenId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    
    console.log("2. TICKET DATA FROM PRISMA:");
    console.log("   Ticket ID:", ticket.id);
    console.log("   Event ID:", ticket.eventId);
    console.log("   Event Name:", ticket.event.eventName);
    console.log("   Raw eventDateAndTime:", ticket.event.eventDateAndTime);
    console.log("   Type of eventDateAndTime:", typeof ticket.event.eventDateAndTime);
    console.log("   Event createdAt:", ticket.event.createdAt);
    console.log("   Event updatedAt:", ticket.event.updatedAt);
    
    // Step 2: Run a raw SQL query to compare
    console.log("3. RUNNING RAW SQL QUERY...");
    
    // Raw SQL query to get the actual stored values
    const rawResult = await prisma.$queryRaw`
      SELECT 
        e.id,
        e."eventName",
        e."eventDateAndTime",
        e."eventDateAndTime"::text as date_as_text,
        EXTRACT(timezone_hour FROM e."eventDateAndTime") as tz_hour,
        EXTRACT(timezone_minute FROM e."eventDateAndTime") as tz_minute,
        e."createdAt",
        t.id as ticket_id,
        qr."tokenId"
      FROM "Event" e
      JOIN "Ticket" t ON e.id = t."eventId"  
      JOIN "QRCode" qr ON t."qrCodeId" = qr.id
      WHERE qr."tokenId" = ${tokenId}
    `;
    
    console.log("4. RAW SQL RESULT:");
    console.log(JSON.stringify(rawResult, null, 2));
    
    // Step 3: Check all events for this user/recent events
    console.log("5. CHECKING RECENT EVENTS:");
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        tickets: {
          include: {
            qrCode: true
          }
        }
      }
    });
    
    recentEvents.forEach((event, index) => {
      console.log(`   Event ${index + 1}:`);
      console.log(`     ID: ${event.id}`);
      console.log(`     Name: ${event.eventName}`);
      console.log(`     Date/Time: ${event.eventDateAndTime}`);
      console.log(`     Created: ${event.createdAt}`);
      if (event.tickets.length > 0) {
        console.log(`     Tickets: ${event.tickets.length}`);
        event.tickets.forEach(t => {
          if (t.qrCode) {
            console.log(`       Token: ${t.qrCode.tokenId}`);
          }
        });
      }
    });
    
    // Step 4: Check if there are multiple events with the same ticket somehow
    console.log("6. CHECKING FOR DUPLICATE TOKEN IDS:");
    const tokenCheck = await prisma.qRCode.findMany({
      where: {
        tokenId: tokenId
      },
      include: {
        ticket: {
          include: {
            event: true
          }
        }
      }
    });
    
    console.log(`   Found ${tokenCheck.length} QR codes with this token:`);
    tokenCheck.forEach((qr, index) => {
      console.log(`     QR ${index + 1}:`);
      console.log(`       QR ID: ${qr.id}`);
      console.log(`       Token: ${qr.tokenId}`);
      console.log(`       Ticket ID: ${qr.ticket?.id}`);
      console.log(`       Event ID: ${qr.ticket?.event?.id}`);
      console.log(`       Event Date: ${qr.ticket?.event?.eventDateAndTime}`);
    });
    
    console.log("=== END DEBUG ===");
    
    return res.json({
      debug: "Complete debug info logged to console",
      ticketId: ticket.id,
      eventId: ticket.eventId,
      eventDate: ticket.event.eventDateAndTime,
      tokenId: tokenId
    });
    
  } catch (err) {
    console.error("Debug error:", err);
    res.status(500).json({ error: "Debug failed", details: err.message });
  }
}

// Also add this to your scanTicket function at the very beginning:
async function scanTicket(req, res, next) {
  try {
    const tokenId = req.params.tokenId;
    // get ticket
    const ticket = await service.getTicketByToken(tokenId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
      const eventDate = new Date(ticket.event.eventDateAndTime); // stored as UTC in DB
      const HalfEventDuration = ticket.event.EventDuration / 2;
      const ValidTill = new Date(eventDate.getTime() + HalfEventDuration * 60 * 1000); 
    //console.log(ticket)
    const now = new Date();
     
    const diffHours = (eventDate - now) / (1000 * 60 * 60);
    // Allow scanning only within 1 hour before the event
    if ((diffHours <= 1 && diffHours >= 0) || (now <= ValidTill))  {
      const Qcode = await QRservice.scanQRcode(tokenId);
      if (!Qcode) {
        return res.status(400).json({ error: "Qcode does not exist" });
      }
      if (ticket.IsScanned) {
        
         return res.status(400).json({ error: "Ticket already scanned once" });
      }
      await service.scanTicket(ticket.id)
      

      return res.json({ valid: true, message: "Ticket scanned successfully" });
    }else {
    return res.status(403).json({ error: "Scanning not allowed at this time" });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}



module.exports = {
  createTicket,scanTicket,debugTicketIssue,viewTicket,getUserTickets
};