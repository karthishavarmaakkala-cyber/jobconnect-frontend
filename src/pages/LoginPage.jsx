import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await API.post('/auth/login', { email, password });
      const userEmail = data.email || email;
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', data.role || 'APPLICANT');
      localStorage.setItem('token', data.token || '');
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data || 'Unable to connect to the JobConnect server');
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6f9',
        width: '100vw'
      }}
    >
      <div 
        style={{
          width: '520px',
          maxWidth: '90%',
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '16px',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', textAlign: 'center', marginBottom: '24px' }}>
          Login to JobConnect
        </h2>

        {error && (
          <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '10px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px', color: '#2d3748' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '28px', textAlign: 'left' }}>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '1.1rem', marginBottom: '8px', color: '#2d3748' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e0',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button 
            type="submit" 
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#0066cc',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 102, 204, 0.2)'
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;