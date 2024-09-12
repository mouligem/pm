import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import '../App.css'; // Import the CSS file

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or user data if applicable
    localStorage.removeItem('token');
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="logout-container">
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default Logout;
