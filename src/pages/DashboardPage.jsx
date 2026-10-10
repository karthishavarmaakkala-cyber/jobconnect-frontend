import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  const getStoredUserData = () => {
    try {
      const email = localStorage.getItem('email') || '';
      const role = localStorage.getItem('role') || 'APPLICANT';
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsed = JSON.parse(userStr);
        return {
          email: parsed?.email || email || 'User',
          role: parsed?.role || role
        };
      }

      return {
        email: email || 'User',
        role: role
      };
    } catch (e) {
      return {
        email: localStorage.getItem('email') || 'User',
        role: 'APPLICANT'
      };
    }
  };

  const user = getStoredUserData();

  useEffect(() => {
    const activeEmail = user.email || localStorage.getItem('email');
    const userStorageKey = `appliedJobs_${activeEmail}`;

    // 1. First, check local storage
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        setAppliedJobs(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Error reading local applied jobs');
    }

    // 2. Fetch from Spring Boot backend to restore data even after logout
    if (activeEmail && activeEmail !== 'User') {
      fetch(`http://localhost:8081/api/applications?email=${encodeURIComponent(activeEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setAppliedJobs(data);
            // Re-sync local storage
            localStorage.setItem(userStorageKey, JSON.stringify(data));
          }
        })
        .catch(() => console.log('Backend offline, displaying cached applications'));
    }
  }, [user.email]);

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', textAlign: 'left' }}>
      <div 
        style={{ 
          backgroundColor: '#ffffff', 
          padding: '32px', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
          User Dashboard
        </h2>
        <p style={{ color: '#718096', marginBottom: '24px', fontSize: '1.1rem' }}>
          Welcome back to JobConnect!
        </p>

        <div style={{ backgroundColor: '#f7fafc', padding: '20px', borderRadius: '8px', border: '1px solid #edf2f7' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#2d3748' }}>
            <strong>Email:</strong> {user.email}
          </p>
          <p style={{ margin: 0, fontSize: '1rem', color: '#2d3748' }}>
            <strong>Account Role:</strong> <span style={{ color: '#2b6cb0', fontWeight: 'bold' }}>{user.role}</span>
          </p>
        </div>
      </div>

      <div 
        style={{ 
          backgroundColor: '#ffffff', 
          padding: '32px', 
          borderRadius: '12px', 
          border: '1px solid #e2e8f0', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2d3748', margin: 0 }}>
            Applied Applications ({appliedJobs.length})
          </h3>
          <Link 
            to="/jobs" 
            style={{ 
              backgroundColor: '#3182ce', 
              color: '#ffffff', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            + Browse More Jobs
          </Link>
        </div>

        {appliedJobs.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#718096' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '1.1rem' }}>You haven't applied to any jobs yet on this account.</p>
            <Link to="/jobs" style={{ color: '#3182ce', fontWeight: 'bold', textDecoration: 'none' }}>
              Click here to view available job listings
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {appliedJobs.map((job, index) => (
              <div 
                key={job.id || index} 
                style={{ 
                  padding: '24px', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '10px', 
                  backgroundColor: '#f8fafc'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', color: '#2d3748' }}>{job.title}</h4>
                    <p style={{ margin: '0 0 6px 0', color: '#4a5568', fontWeight: '600' }}>
                      {job.companyName || job.company} — {job.location}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#718096' }}>
                      Applied Date: {job.appliedDate || 'Today'}
                    </p>
                  </div>
                  <span 
                    style={{ 
                      backgroundColor: '#c6f6d5', 
                      color: '#22543d', 
                      padding: '6px 14px', 
                      borderRadius: '20px', 
                      fontWeight: 'bold',
                      fontSize: '0.85rem' 
                    }}
                  >
                    Submitted ✓
                  </span>
                </div>

                {job.applicantInfo && (
                  <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e0', marginTop: '12px' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#2d3748', fontSize: '0.95rem' }}>Submitted Candidate Profile:</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.9rem', color: '#4a5568' }}>
                      <p style={{ margin: 0 }}><strong>Name:</strong> {job.applicantInfo.fullName}</p>
                      <p style={{ margin: 0 }}><strong>Email:</strong> {job.applicantInfo.email}</p>
                      <p style={{ margin: 0 }}><strong>Phone:</strong> {job.applicantInfo.phone}</p>
                      <p style={{ margin: 0 }}><strong>Graduation:</strong> {job.applicantInfo.graduation}</p>
                      <p style={{ margin: 0 }}><strong>CGPA:</strong> {job.applicantInfo.cgpa}</p>
                      <p style={{ margin: 0 }}><strong>Occupation:</strong> {job.applicantInfo.occupation}</p>
                      {job.applicantInfo.resumeName && (
                        <p style={{ margin: 0, gridColumn: 'span 2' }}><strong>Resume File:</strong> {job.applicantInfo.resumeName}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;