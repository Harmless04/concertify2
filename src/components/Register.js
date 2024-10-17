import React, { useState } from 'react';
import supabase from '../supabaseClient'; // Import supabase client

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    // Insert the user data into the users table
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ email, password }]); // Inserting directly into the users table

    if (insertError) {
      setError(insertError.message);
    } else {
      alert('Registration successful');
      // Redirect to login page or dashboard after registration
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
