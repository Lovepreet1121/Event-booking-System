 const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const timeSlotSchema = new mongoose.Schema({
  startTime: Date, // stored in UTC
  maxBookings: Number,
  bookings: [bookingSchema], // people who booked
});

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  timeSlots: [timeSlotSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
