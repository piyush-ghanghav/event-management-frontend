// src/pages/GuestLogin.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuestLogin = () => {
  const navigate = useNavigate();

  // When the guest logs in, set a flag in localStorage
  const handleGuestLogin = () => {
    // localStorage.setItem('guest', 'true');
    // Optionally, remove any auth token to be safe
    localStorage.removeItem('token');
    navigate('/dashboard'); // Navigate to the Dashboard
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Continue as Guest</h2>
      <p className="mb-4">
        As a guest, you can view public events and use basic search functionality. Note that guest users cannot create events or view private events. For full access, please register.
      </p>
      <button
        onClick={handleGuestLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue as Guest
      </button>
      <p className="mt-4">
        Want full access? <a href="/register" className="text-blue-500 underline">Register here</a>.
      </p>
    </div>
  );
};

export default GuestLogin;
