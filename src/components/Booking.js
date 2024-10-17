import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';

function Booking() {
  const [concerts, setConcerts] = useState([]); // To store concerts from the database
  const [quantity, setQuantity] = useState(1); // For ticket quantity
  const [selectedConcert, setSelectedConcert] = useState(null); // To store selected concert
  const [error, setError] = useState(null); // To handle errors
  const [loading, setLoading] = useState(true); // To handle loading state

  // Fetch concerts from the database
  useEffect(() => {
    const fetchConcerts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('concerts').select('*');
      console.log('Fetched concerts:', data); // Debugging log
      console.log('Error fetching concerts:', error); // Debugging log

      if (error) {
        setError(error.message);
      } else {
        setConcerts(data || []); // Set the concert data to the state
      }
      setLoading(false);
    };
    fetchConcerts();
  }, []);

  const handleBooking = async () => {
    // Retrieve user data from localStorage
    const user_id = localStorage.getItem('user_id');
    const user_name = localStorage.getItem('user_name');

    // Check if the user is logged in by confirming presence of user_id
    if (!user_id) {
      setError('You need to log in to book a concert.');
      return;
    }

    // Ensure a concert is selected
    if (!selectedConcert) {
      setError('Please select a concert.');
      return;
    }

    // Insert booking into Supabase
    const { data, error: bookingError } = await supabase.from('bookings').insert({
      user_id, // Use the user ID from localStorage
      concert_id: selectedConcert,
      quantity,
      booked_at: new Date(), // This will use the current date/time
    });

    if (bookingError) {
      setError(bookingError.message);
    } else {
      alert(`Booking successful for ${user_name}!`);
      console.log('Booking details:', data);
      // Reset the state after successful booking
      setQuantity(1);
      setSelectedConcert(null);
    }
  };

  return (
    <div>
      <h2>Book a Concert</h2>
      {loading ? (
        <p>Loading concerts...</p>
      ) : concerts.length > 0 ? (
        <>
          <label htmlFor="concerts">Select a concert:</label>
          <select
            id="concerts"
            onChange={(e) => setSelectedConcert(e.target.value)}
            value={selectedConcert || ''} // Setting a default value
          >
            <option value="" disabled>Select a concert</option> {/* Placeholder */}
            {concerts.map((concert) => (
              <option key={concert.id} value={concert.id}>
                {concert.title} - {concert.artist}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="quantity">Ticket Quantity:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Ticket Quantity"
            min="1"
          />
          <br />
          <button onClick={handleBooking}>Book Now</button>
        </>
      ) : (
        <p>No concerts available at the moment.</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Booking;
