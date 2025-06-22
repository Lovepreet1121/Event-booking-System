// app.js

const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, '.env');

if (!fs.existsSync(envFilePath)) {
    console.error(`ERROR: .env file not found at ${envFilePath}`);
    console.error("Please make sure your .env file is directly in the 'scheduling-backend' folder.");
    console.error("Also, ensure it's named '.env' (without any .txt or other extensions).");
    process.exit(1);
} else {
    console.log(`.env file found at: ${envFilePath}`);
}

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Event = require("./models/Event"); // <<< NEW: Import Event model here for direct route

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Essential for parsing JSON bodies

// Import Routes
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/bookings"); // Keep this import, even if bookings.js is empty for now

// Use Routes
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

// Optional: A simple test route
app.get("/", (req, res) => {
    res.send("Backend server is running and attempting to connect to MongoDB...");
});

// --- CRITICAL FIX: BOOKING ROUTE DEFINED DIRECTLY HERE ---
// This ensures the route is recognized without issues from router nesting
app.post("/api/events/:id/book", async (req, res) => {
    try {
        const { slotTime, name, email } = req.body;
        const eventId = req.params.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const targetSlot = event.timeSlots.find(
            (slot) => new Date(slot.startTime).toISOString() === new Date(slotTime).toISOString()
        );

        if (!targetSlot) {
            return res.status(404).json({ message: "Time slot not found within this event." });
        }

        if (targetSlot.bookings.length >= targetSlot.maxBookings) {
            return res.status(400).json({ message: "This time slot is fully booked." });
        }

        const alreadyBooked = targetSlot.bookings.some(
            (booking) => booking.email.toLowerCase() === email.toLowerCase()
        );

        if (alreadyBooked) {
            return res.status(409).json({ message: "You have already booked this time slot." });
        }

        targetSlot.bookings.push({ name, email });
        await event.save();

        res.status(200).json({ message: "Booking successful!", event });
    } catch (err) {
        console.error("Error booking slot:", err);
        res.status(500).json({ message: "Error booking time slot", error: err.message });
    }
});
// --- END CRITICAL FIX ---


// MongoDB Connection
console.log("Attempting to connect to MongoDB with URI:", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(5000, () => {
            console.log("Server running at http://localhost:5000");
            console.log("MongoDB connected successfully!");
        });
    })
    .catch(err => {
        console.log("Error connecting to MongoDB. Please check your MONGO_URL in .env file and network access.");
        console.log("MongoDB connection error details:", err);
    });