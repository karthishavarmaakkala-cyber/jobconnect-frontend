import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'ROLE_JOB_SEEKER',
    companyName: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Try a different email.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '40px' }}>
      <div className="card">
        <h2>Register Account</h2>
        {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Full Name</label>
            <input type="text" required style={{ width: '100%', padding: '8px' }} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input type="email" required style={{ width: '100%', padding: '8px' }} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password</label>
            <input type="password" required style={{ width: '100%', padding: '8px' }} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>I am a:</label>
            <select style={{ width: '100%', padding: '8px' }} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
              <option value="ROLE_JOB_SEEKER">Job Seeker</option>
              <option value="ROLE_RECRUITER">Recruiter</option>
            </select>
          </div>
          {formData.role === 'ROLE_RECRUITER' && (
            <div style={{ marginBottom: '15px' }}>
              <label>Company Name</label>
              <input type="text" required style={{ width: '100%', padding: '8px' }} value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
            </div>
          )}
          <button type="submit" className="btn" style={{ width: '100%' }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;