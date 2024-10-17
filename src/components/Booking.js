import React, { useState, useEffect } from 'react';
//import { bookTickets } from './utils/supabaseService'; // Import your ticket booking function
//import { supabase } from './utils/supabaseService';  // Supabase client
import { supabase, bookTickets } from '../utils/supabaseService';


const Booking = () => {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [numberOfTickets, setNumberOfTickets] = useState(1);

  useEffect(() => {
    // Fetch the concerts list from Supabase
    const fetchConcerts = async () => {
      const { data, error } = await supabase
        .from('concerts')
        .select('*');

      if (error) console.error('Error fetching concerts:', error);
      else setConcerts(data);
    };

    fetchConcerts();
  }, []);

  const handleBookTickets = async () => {
    if (selectedConcert) {
      await bookTickets(selectedConcert.id, numberOfTickets);  // Book the tickets for the selected concert
    } else {
      console.log('No concert selected');
    }
  };

  return (
    <div>
      <h1>Book Your Tickets</h1>

      {/* Display available concerts in a dropdown */}
      <select
        value={selectedConcert ? selectedConcert.id : ''}
        onChange={(e) =>
          setSelectedConcert(concerts.find((concert) => concert.id === Number(e.target.value)))
        }
      >
        <option value="" disabled>Select a concert</option>
        {concerts.map((concert) => (
          <option key={concert.id} value={concert.id}>
            {concert.artist} at {concert.venue} on {new Date(concert.event_date).toDateString()}
          </option>
        ))}
      </select>

      {/* Input to select the number of tickets */}
      <input
        type="number"
        value={numberOfTickets}
        onChange={(e) => setNumberOfTickets(Number(e.target.value))}
        min="1"
        placeholder="Number of tickets"
      />

      {/* Button to book tickets */}
      <button onClick={handleBookTickets}>Book Tickets</button>
    </div>
  );
};

export default Booking;

