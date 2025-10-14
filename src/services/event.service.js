const eventRepo = require("../models/event.model");

async function listEvents(where) {
  return eventRepo.findMany(where);
}

async function getEvent(id) {
  const event = await eventRepo.findById(id);
  if (!event) {
    const err = new Error("Not found");
    err.status = 404;
    throw err;
  }
  return event;
}

async function reduceSeats(id, seats) { //reduce seats when tickets are brought
    const event = await getEvent(id)

    if (!event) {
    const err = new Error("Event does not exist");
    err.status = 409;
    throw err;
    }

    event.availableSeats = event.availableSeats - seats
    event.bookedSeats = event.bookedSeats + seats
    const updatedEvent = await updateEvent(id, event)

    return updatedEvent
}

async function createEvent({ eventName, eventDescription, eventLocation, eventDateAndTime, availableSeats, bookedSeats, ticketPrices, EventDuration, EventCategory , imageUrl}){
  // Example rule: unique email
  const existingEvent = eventName ? await eventRepo.findByEventName(eventName) : null;
  if (existingEvent) {
    const err = new Error("Event already exists");
    err.status = 409;
    throw err;
  }
  return eventRepo.create({  eventName, eventDescription, eventLocation, eventDateAndTime, availableSeats, bookedSeats, ticketPrices, EventDuration ,EventCategory , imageUrl});
}

async function getEventByCategory(category) {
  return eventRepo.findManyEventCategory(category)
}

async function updateEvent(id, { eventName, eventDescription, eventLocation, eventDateAndTime, availableSeats, bookedSeats, ticketPrices, EventDuration,EventCategory, imageUrl  }) {
  // Optional: prevent dup email on update
  if (eventName) {
    const existing = await eventRepo.findByEventName(eventName);
    if (existing && existing.id !== id) {
      const err = new Error("Event already exists");
      err.status = 409;
      throw err;
    }
  }
  return eventRepo.updateById(id, { eventName, eventDescription, eventLocation, eventDateAndTime, availableSeats, bookedSeats, ticketPrices, EventDuration,EventCategory, imageUrl  });
}

async function deleteEvent(id) {
  await eventRepo.deleteById(id);
}

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,reduceSeats,getEventByCategory,
};