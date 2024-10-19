import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Booking from './components/Booking';
import './App.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  // Function to handle successful login/registration
  const handleAuthentication = () => {
    setIsAuthenticated(true);
    navigate('/booking'); // Redirect to booking after authentication
  };

  return (
    <div className="app-container">
      <div className="parallax">
        <h1 className="app-heading">Concertify</h1>
        <p className="app-description">
          Your one-stop destination for booking concert tickets with ease. Join us and experience the music like never before!
        </p>
      </div>

      <nav>
        <ul className="nav-links">
          {/* Only show the buttons if not on the Booking page */}
          {location.pathname !== '/booking' && (
            <>
              <li>
                <button onClick={handleLoginRedirect} className="login-button">Login</button>
              </li>
              <li>
                <button onClick={handleRegisterRedirect} className="register-button">Register</button>
              </li>
            </>
          )}
          {isAuthenticated && ( // Show Book Tickets link only if authenticated
            <li>
              <Link to="/booking" className="book-tickets-link">Book Tickets</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/login" element={<Login onAuthenticate={handleAuthentication} />} />
          <Route path="/register" element={<Register onAuthenticate={handleAuthentication} />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>

      <div className="footer">
        <p>© 2024 Concertify. All rights reserved.</p>
      </div>
    </div>
  );
}

export default App;
