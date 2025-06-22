// scheduling-frontend/src/pages/EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/api';

function EventDetails() {
  const { id } = useParams(); // Gets the event ID from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for booking form
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Function to fetch event details
  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${id}`);
      setEvent(response.data);
      setLoading(false);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to load event details. Please check the URL or try again.");
      setLoading(false);
      setEvent(null); // Ensure event is null on error
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]); // Re-fetch if ID changes

  // Function to handle booking a slot
  const handleBooking = async (slotTime) => {
    setBookingMessage(''); // Clear previous messages
    setBookingError('');   // Clear previous errors

    if (!bookingName || !bookingEmail) {
      setBookingError("Please enter your name and email to book.");
      return;
    }

    try {
      const bookingData = {
        slotTime: slotTime, // The specific time slot to book
        name: bookingName,
        email: bookingEmail,
      };
      await axios.post(`${API_BASE_URL}/events/${id}/book`, bookingData);

      setBookingMessage('Booking successful!');
      setBookingError('');
      setBookingName(''); // Clear form fields
      setBookingEmail('');

      // After successful booking, refresh event details to show updated availability
      fetchEventDetails();

    } catch (err) {
      console.error("Error booking slot:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setBookingError(`Booking Failed: ${err.response.data.message}`);
      } else {
        setBookingError('An unexpected error occurred during booking.');
      }
      setBookingMessage('');
    }
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!event) {
    return <p>No event found with this ID.</p>;
  }

  return (
    <div>
      <h2>{event.title}</h2>
      <p><strong>Description:</strong> {event.description}</p>

      <h3>Available Time Slots:</h3>
      {bookingMessage && <p style={{ color: 'green' }}>{bookingMessage}</p>}
      {bookingError && <p style={{ color: 'red' }}>{bookingError}</p>}

      <div style={{ marginBottom: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9', maxWidth: '400px', margin: '15px auto' }}>
        <h4>Your Booking Information:</h4>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="bookingName" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            id="bookingName"
            value={bookingName}
            onChange={(e) => setBookingName(e.target.value)}
            placeholder="Your Name"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label htmlFor="bookingEmail" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="bookingEmail"
            value={bookingEmail}
            onChange={(e) => setBookingEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {event.timeSlots.length > 0 ? (
          event.timeSlots.map(slot => (
            <li key={slot._id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px', borderRadius: '5px', backgroundColor: '#fff' }}>
              <strong>Time:</strong> {new Date(slot.startTime).toLocaleString()}
              <br />
              <strong>Booked:</strong> {slot.bookings.length} / {slot.maxBookings}
              <br />
              {slot.bookings.length >= slot.maxBookings ? (
                <span style={{ color: 'red', fontWeight: 'bold' }}>Fully Booked</span>
              ) : (
                <button
                  onClick={() => handleBooking(slot.startTime)}
                  style={{
                    marginTop: '10px',
                    padding: '8px 15px',
                    backgroundColor: '#28a745', // Green color for available
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Book Now
                </button>
              )}
              {slot.bookings.length > 0 && (
                <div style={{ marginTop: '5px', fontSize: '0.9em', color: '#555' }}>
                  Booked by:
                  <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
                    {slot.bookings.map((booking, index) => (
                      <li key={index}>{booking.name} ({booking.email})</li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No time slots defined for this event.</p>
        )}
      </ul>
    </div>
  );
}

export default EventDetails;