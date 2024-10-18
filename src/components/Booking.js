import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { QRCodeCanvas } from 'qrcode.react';


function Booking() {
  const [concerts, setConcerts] = useState([]); // To store concerts from the database
  const [quantity, setQuantity] = useState(1); // For ticket quantity
  const [selectedConcert, setSelectedConcert] = useState(null); // To store selected concert
  const [error, setError] = useState(null); // To handle errors
  const [loading, setLoading] = useState(true); // To handle loading state
  const [ticketDetails, setTicketDetails] = useState(null); // New state to hold ticket details after booking

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
    const user_id = localStorage.getItem('user_id');
    const user_name = localStorage.getItem('user_name');
    // Check if the user is logged in
    if (!user_id) {
        setError('You need to log in to book a concert.');
        return;
    }

    // Ensure a concert is selected
    if (!selectedConcert) {
        setError('Please select a concert.');
        return;
    }

    // Convert selectedConcert to the same type as concert.id (assuming concert.id is a number)
    const selectedConcertId = parseInt(selectedConcert, 10);
    console.log("Selected Concert ID:", selectedConcertId); // Debugging

    // Get concert details for the ticket
    const selectedConcertDetails = concerts.find(concert => concert.id === selectedConcertId);
    console.log("Selected Concert Details:", selectedConcertDetails); // Debugging

    // Check if the selected concert is valid
    if (!selectedConcertDetails) {
        setError('Selected concert not found.');
        return;
    }

    // Check if enough tickets are available
    if (selectedConcertDetails.available_tickets < quantity) {
        setError('Not enough tickets available.');
        return;
    }

    // Insert booking into Supabase
    const { data, error: bookingError } = await supabase.from('bookings').insert({
        user_id,
        concert_id: selectedConcertId,
        quantity,
        booked_at: new Date(),
    });

    if (bookingError) {
        setError(bookingError.message);
    } else {
        // Update the available tickets in the concerts table
        const { error: updateError } = await supabase
            .from('concerts')
            .update({ available_tickets: selectedConcertDetails.available_tickets - quantity })
            .eq('id', selectedConcertId); // Ensure we update the correct concert

        if (updateError) {
            setError(updateError.message);
        } else {
            alert(`Booking successful for ${user_name}!`);

            // Set ticket details to display the ticket
            setTicketDetails({
                concertTitle: selectedConcertDetails.title,
                concertArtist: selectedConcertDetails.artist,
                quantity,
                bookedAt: new Date().toLocaleString(),
                userName: user_id,
            });

            // Reset form inputs
            setQuantity(1);
            setSelectedConcert(null);
        }
    }
};

  

  return (
    <div>
      <h2>Book a Concert</h2>

      {ticketDetails ? (
        // Display the ticket UI when booking is successful
        <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
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
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Booking;