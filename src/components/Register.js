import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import supabase from '../supabaseClient'; // Import supabase client
import './Register.css'; // Import the CSS styles for Register (optional)

const Register = ({ onAuthenticate }) => { // Accept onAuthenticate prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reference to the register form section
  const registerFormRef = useRef(null);
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Automatically scroll to the register form on page load
  useEffect(() => {
    if (registerFormRef.current) {
      registerFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    const { error: insertError } = await supabase
      .from('users')
      .insert([{ email, password }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      alert('Registration successful');
      localStorage.setItem('user_email', email); // Optionally store email or user info
      onAuthenticate(); // Notify the App component about successful authentication
      navigate('/booking'); // Redirect to booking page after successful registration
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-box" ref={registerFormRef}> {/* Reference for scroll */}
        <h2 className="register-heading">Register for Concertify</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleRegister}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" className="submit-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
