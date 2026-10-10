import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Selective logout: Removes active session keys without wiping applied application history
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    localStorage.removeItem('role');

    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a202c',
        padding: '16px 32px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      {/* Brand Logo */}
      <Link to="/jobs" style={{ textDecoration: 'none', color: '#ffffff' }}>
        <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 'bold' }}>JobConnect</h1>
      </Link>

      {/* Navigation Links & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link
          to="/dashboard"
          style={{
            color: '#e2e8f0',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/jobs"
          style={{
            color: '#e2e8f0',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '1rem'
          }}
        >
          Jobs
        </Link>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e53e3e',
            color: '#ffffff',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;