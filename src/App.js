// src/App.js
// src/App.js
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';       
import Register from './components/Register';
import Booking from './components/Booking';
import './App.css';

function App() {
  const navigate = useNavigate();

  // Redirect to login page
  const handleLoginRedirect = () => {
    navigate('/login'); // Redirect to the login page when the button is clicked
  };

  return (
    <div className="app-container">
      <div className="parallax">
        <h1 className="app-heading">Concertify</h1>
        <p className="app-description">
          Your one-stop destination for booking concert tickets with ease. Join us and experience the music like never before!
        </p>
      </div>

      {/* Navigation Links */}
      <nav>
        <ul className="nav-links">
          <li>
            <button onClick={handleLoginRedirect} className="login-button">Login</button> {/* Redirect to Login */}
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/booking">Book Tickets</Link>
          </li>
        </ul>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="/login" element={<Login />} />  {/* Route for the dedicated login page */}
        <Route path="/register" element={<Register />} />
        <Route path="/booking" element={<Booking />} />
      </Routes>
    </div>
  );
}

export default App;
