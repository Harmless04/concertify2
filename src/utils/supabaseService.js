import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qocsnijckjfgplvujqcc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvY3NuaWpja2pmZ3BsdnVqcWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMDM5ODQsImV4cCI6MjA0NDU3OTk4NH0.ooqDBeFf0XNITnM3DO80cDmw9ztwEJP-WKXYEwQI7ik';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const bookTickets = async (concertId, numberOfTickets) => {
  const { data: concert, error } = await supabase
    .from('concerts')
    .select('available_tickets')
    .eq('id', concertId)
    .single();

  if (error) {
    console.error('Error fetching concert:', error);
    return;
  }

  const currentTickets = concert.available_tickets;

  if (currentTickets < numberOfTickets) {
    console.log('Not enough tickets available');
    return;
  }

  const { data, updateError } = await supabase
    .from('concerts')
    .update({ available_tickets: currentTickets - numberOfTickets })
    .eq('id', concertId);

  if (updateError) {
    console.error('Error updating tickets:', updateError);
  } else {
    console.log('Tickets successfully booked:', data);
  }
};