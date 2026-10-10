import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/jobService';

const PostJobPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salaryRange: '',
    skillsRequired: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createJob(formData);
    navigate('/');
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <div className="card">
        <h2>Post a New Job Opening</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Job Title</label>
            <input type="text" required style={{ width: '100%', padding: '8px' }} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Location</label>
            <input type="text" required style={{ width: '100%', padding: '8px' }} value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Salary Range</label>
            <input type="text" style={{ width: '100%', padding: '8px' }} value={formData.salaryRange} onChange={(e) => setFormData({...formData, salaryRange: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Skills Required</label>
            <input type="text" style={{ width: '100%', padding: '8px' }} value={formData.skillsRequired} onChange={(e) => setFormData({...formData, skillsRequired: e.target.value})} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Job Description</label>
            <textarea required style={{ width: '100%', height: '120px', padding: '8px' }} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" className="btn">Post Opening</button>
        </form>
      </div>
    </div>
  );
};

export default PostJobPage;