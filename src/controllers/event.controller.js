const service = require("../services/event.service");
const { parseId } = require("../middlewares/utils");

async function createEvent(req, res, next) {
  try {
    const { eventName, eventDescription, eventLocation, availableSeats, bookedSeats, ticketPrices, EventDuration, EventCategory,eventDateAndTime, imageUrl } = req.body;

    const now = new Date();
    //const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in ms
      //const istTime = new Date(now.getTime() + istOffset + 30 * 60 * 1000);
      
      //const eventDateAndTime = new Date(now.getTime() - 30 * 60 * 1000);

    const event = await service.createEvent({
      eventName,
      eventDescription,
      eventLocation,
      eventDateAndTime,
      availableSeats,
      bookedSeats,
      ticketPrices, EventDuration,EventCategory, imageUrl
    });

    res.status(201).json(event);
  } catch (e) {
    next(e);
  }
}

async function listEvents(req, res, next) {
  try {
    const { search, category } = req.query;

    let where = {};

    // 🔎 support category filter
    if (category && category !== "all") {
      where.EventCategory = {
        equals: category,
        mode: "insensitive",
      };
    }

    // 🔎 support search filter
    if (search) {
      where = {
        ...where,
        OR: [
          { eventName: { contains: search, mode: "insensitive" } },
          { eventDescription: { contains: search, mode: "insensitive" } },
          { eventLocation: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const events = await service.listEvents(where);

    res.json(events);
  } catch (e) {
    next(e);
  }
}

async function getEvent(req, res, next) {
    try {
      const id = parseId(req.params.id);
      console.log(id);
        const event = await service.getEvent(id);
        res.json(event);
    } catch (e) {
        next(e);
    }
}

async function getEventByCategory(req, res, next) {
  try {
    const category = req.params.category;
    const event = await service.getEventByCategory(category);
    res.json(event)
  } catch (e) {
    next(e);
  }
  
}

async function updateEvent(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const { eventName, eventDescription, eventLocation, eventDateAndTime, availableSeats, bookedSeats, ticketPrices , EventDuration,EventCategory } = req.body;
    const event = await service.updateEvent(id, {  eventName, eventDescription, eventLocation, eventDateAndTime, availableSeats, bookedSeats, ticketPrices, EventDuration,EventCategory  });
    res.json(event);
  } catch (e) {
    next(e);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const id = parseId(req.params.id);
    await service.deleteEvent(id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  deleteEvent,getEventByCategory,
};