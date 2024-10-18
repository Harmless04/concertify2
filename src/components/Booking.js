import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { QRCodeCanvas } from 'qrcode.react';
import './Booking.css'; // Include the CSS file for black-and-white styling

function Booking() {
  const [concerts, setConcerts] = useState([]); // To store concerts from the database
  const [quantity, setQuantity] = useState({}); // Store ticket quantity for each concert
  const [error, setError] = useState(null); // To handle errors
  const [loading, setLoading] = useState(true); // To handle loading state
  const [ticketDetails, setTicketDetails] = useState(null); // State to hold ticket details after booking

  // Mapping concert IDs to image file names
  const concertImages = {
    1: 'concertify1.png',
    2: 'concertify2.png',
    3: 'concertify3.png',
    4: 'concertify4.png',
    5: 'concertify5.png',
    6: 'concertify6.png',
  };

  // Fetch concerts from the database
  useEffect(() => {
    const fetchConcerts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('concerts').select('*');
      if (error) {
        setError(error.message);
      } else {
        setConcerts(data || []); // Set the concert data to the state
      }
      setLoading(false);
    };
    fetchConcerts();
  }, []);

  const handleBooking = async (concert) => {
    const user_id = localStorage.getItem('user_id');
    const user_name = localStorage.getItem('user_name');
    const selectedQuantity = quantity[concert.id] || 1;

    // Check if the user is logged in
    if (!user_id) {
      setError('You need to log in to book a concert.');
      return;
    }

    // Check if enough tickets are available
    if (concert.available_tickets < selectedQuantity) {
      setError('Not enough tickets available.');
      return;
    }

    // Insert booking into Supabase
    const { data, error: bookingError } = await supabase.from('bookings').insert({
      user_id,
      concert_id: concert.id,
      quantity: selectedQuantity,
      booked_at: new Date(),
    });

    if (bookingError) {
      setError(bookingError.message);
    } else {
      // Update the available tickets in the concerts table
      const { error: updateError } = await supabase
        .from('concerts')
        .update({ available_tickets: concert.available_tickets - selectedQuantity })
        .eq('id', concert.id);

      if (updateError) {
        setError(updateError.message);
      } else {
        alert(`Booking successful for ${user_name}!`);

        // Set ticket details to display the ticket
        setTicketDetails({
          concertTitle: concert.title,
          concertArtist: concert.artist,
          quantity: selectedQuantity,
          bookedAt: new Date().toLocaleString(),
          userName: user_id,
        });

        // Reset quantity for the booked concert
        setQuantity((prev) => ({ ...prev, [concert.id]: 1 }));
      }
    }
  };

  const handleQuantityChange = (id, value) => {
    setQuantity((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="booking-page">
      <h2>Book a Concert</h2>

      {ticketDetails ? (
        <div className="ticket-container">
          <h3>Your Ticket</h3>
          <p><strong>Concert:</strong> {ticketDetails.concertTitle}</p>
          <p><strong>Artist:</strong> {ticketDetails.concertArtist}</p>
          <p><strong>Quantity:</strong> {ticketDetails.quantity}</p>
          <p><strong>Booked by:</strong> {ticketDetails.userName}</p>
          <p><strong>Date of Booking:</strong> {ticketDetails.bookedAt}</p>
          <QRCodeCanvas
            value={JSON.stringify(ticketDetails)} // QR code value is the ticket details
            size={150}
          />
        </div>
      ) : (
        <>
          {loading ? (
            <p>Loading concerts...</p>
          ) : concerts.length > 0 ? (
            <div className="concerts-container">
              {concerts.map((concert, index) => (
                <div key={concert.id} className="concert-card">
                  <img
                    src={`/images/${concertImages[index + 1]}`} // Map concert to corresponding image
                    alt={`${concert.title} by ${concert.artist}`}
                    className="concert-image"
                  />
                  <h3>{concert.title}</h3>
                  <p><strong>Artist:</strong> {concert.artist}</p>
                  <p><strong>Available Tickets:</strong> {concert.available_tickets}</p>
                  <label htmlFor={`quantity-${concert.id}`}>Ticket Quantity:</label>
                  <input
                    id={`quantity-${concert.id}`}
                    type="number"
                    value={quantity[concert.id] || 1}
                    onChange={(e) => handleQuantityChange(concert.id, Number(e.target.value))}
                    min="1"
                    className="quantity-input"
                  />
                  <button onClick={() => handleBooking(concert)} className="book-button">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No concerts available at the moment.</p>
          )}
        </>
      )}

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Booking;
