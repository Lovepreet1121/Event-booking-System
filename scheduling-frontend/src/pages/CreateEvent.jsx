// scheduling-frontend/src/pages/CreateEvent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect after creation
import API_BASE_URL from '../config/api'; // Import your API base URL

function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // For simplicity, we'll take time slots as a comma-separated string initially
  const [timeSlotsInput, setTimeSlotsInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setMessage(''); // Clear previous messages
    setError('');   // Clear previous errors

    try {
      // Parse time slots from the input string
      // Expecting format like: "2025-07-01T09:00:00Z, 2025-07-01T10:00:00Z"
      const parsedTimeSlots = timeSlotsInput.split(',').map(slotStr => {
        const trimmedSlot = slotStr.trim();
        // Basic validation: ensure it's not empty and seems like a date
        if (!trimmedSlot || !Date.parse(trimmedSlot)) {
            throw new Error(`Invalid time slot format: "${trimmedSlot}". Use ISO 8601 (e.g., 2025-07-01T09:00:00Z)`);
        }
        return { startTime: trimmedSlot, maxBookings: 5 }; // Default maxBookings for now
      }).filter(slot => slot.startTime !== ''); // Filter out any empty strings from split

      if (parsedTimeSlots.length === 0 && timeSlotsInput.trim() !== '') {
          throw new Error("No valid time slots could be parsed. Check format.");
      } else if (parsedTimeSlots.length === 0 && timeSlotsInput.trim() === '') {
          throw new Error("Time slots are required.");
      }

      const newEvent = {
        title,
        description,
        timeSlots: parsedTimeSlots,
      };

      const response = await axios.post(`${API_BASE_URL}/events`, newEvent);
      setMessage(`Event "${response.data.title}" created successfully!`);
      setError(''); // Clear any previous errors

      // Clear the form
      setTitle('');
      setDescription('');
      setTimeSlotsInput('');

      // Optional: Redirect to the home page after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('Error creating event:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err.message.includes("Invalid time slot format") || err.message.includes("Time slots are required") || err.message.includes("No valid time slots")) {
          setError(`Input Error: ${err.message}`);
      }
      else {
        setError('An unexpected error occurred. Please try again.');
      }
      setMessage(''); // Clear any success messages
    }
  };

  return (
    <div>
      <h2>Create New Event</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Event Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }}
          ></textarea>
        </div>
        <div>
          <label htmlFor="timeSlots" style={{ display: 'block', marginBottom: '5px' }}>
            Time Slots (comma-separated ISO 8601, e.g., 2025-07-01T09:00:00Z, 2025-07-01T10:00:00Z):
          </label>
          <textarea
            id="timeSlots"
            value={timeSlotsInput}
            onChange={(e) => setTimeSlotsInput(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '100px' }}
          ></textarea>
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;