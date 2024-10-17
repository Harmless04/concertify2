import React, { useState, useEffect, useRef } from 'react';
import supabase from '../supabaseClient';
import './Login.css'; // Import the CSS styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Reference to the login form section
  const loginFormRef = useRef(null);

  // Automatically scroll to the login form on page load
  useEffect(() => {
    if (loginFormRef.current) {
      loginFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Query the users table to check if the user exists
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError || !user) {
        setError('User not found');
        return;
      }

      // Check if the entered password matches the user's password
      if (user.password === password) {
        // Store user id and name in localStorage
        localStorage.setItem('user_id', user.user_id);
        localStorage.setItem('user_name', user.name || ''); // Storing the name if available

        alert('Login successful!');
        window.open('/booking', '_blank'); // Redirect to booking page
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box" ref={loginFormRef}> {/* Reference for scroll */}
        <h2 className="login-heading">Login to Concertify</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
