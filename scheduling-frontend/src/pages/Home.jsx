// scheduling-frontend/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // To link to event details
import API_BASE_URL from '../config/api'; // Import your API base URL

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // The empty array ensures this effect runs only once after the initial render

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (events.length === 0) {
    return <p>No events found. Time to create one!</p>;
  }

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {events.map(event => (
          <li key={event._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
            <h3>
              {/* Link to the EventDetails page */}
              <Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                {event.title}
              </Link>
            </h3>
            <p>{event.description}</p>
            <p>Available Slots: {event.timeSlots.length}</p>
            {/* You can add more details here later */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;