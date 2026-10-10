import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobById, applyForJob } from '../services/jobService';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        const data = await fetchJobById(id);
        setJob(data);
      } catch (err) {
        setError('Failed to load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getJobDetails();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await applyForJob(id);
      setApplyMessage('Application submitted successfully!');
    } catch (err) {
      setApplyMessage('Failed to submit application. Please try again.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading job details...</div>;
  if (error) return <div className="container" style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!job) return <div className="container" style={{ padding: '2rem' }}>Job not found.</div>;

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="btn-secondary" 
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}
      >
        &larr; Back
      </button>

      <div className="job-details-card" style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2>{job.title}</h2>
        <p className="company-location" style={{ color: '#555', fontSize: '1.1rem', marginBottom: '1rem' }}>
          <strong>{job.company}</strong> ({job.location})
        </p>

        <p style={{ margin: '0.5rem 0' }}>
          <strong>Salary:</strong> {job.salary || 'Not specified'}
        </p>
        <p style={{ margin: '0.5rem 0' }}>
          <strong>Required Skills:</strong> {job.skills || 'Not specified'}
        </p>

        <hr style={{ margin: '1.5rem 0', borderColor: '#eee' }} />

        <h3>Job Description</h3>
        <p className="description" style={{ lineHeight: '1.6', color: '#333', marginBottom: '1.5rem' }}>
          {job.description}
        </p>

        {applyMessage && (
          <p style={{ color: applyMessage.includes('successfully') ? 'green' : 'red', marginBottom: '1rem' }}>
            {applyMessage}
          </p>
        )}

        <button 
          onClick={handleApply} 
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetailsPage;