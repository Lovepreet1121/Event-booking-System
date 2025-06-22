// routes/events.js

const express = require("express");
const router = express.Router();
const Event = require("../models/Event"); // Ensure Event model is imported

// ➕ POST /api/events - CREATE NEW EVENT
router.post("/", async (req, res) => {
  try {
    const { title, description, timeSlots } = req.body;
    const event = new Event({
      title,
      description,
      timeSlots,
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ message: "Error creating event", error: err.message });
  }
});

// 📋 GET /api/events - GET ALL EVENTS
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Error getting events:", err);
    res.status(500).json({ message: "Error getting events", error: err.message });
  }
});

// 📄 GET /api/events/:id - GET SINGLE EVENT BY ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    console.error("Error getting single event:", err);
    res.status(500).json({ message: "Error getting event", error: err.message });
  }
});

module.exports = router;