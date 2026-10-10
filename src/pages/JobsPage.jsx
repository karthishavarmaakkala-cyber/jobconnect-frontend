import React, { useState, useEffect } from 'react';

const JobsPage = () => {
  const defaultJobs = [
    {
      id: 1,
      title: 'Java Backend Developer',
      companyName: 'Tech Corp',
      location: 'Hyderabad',
      description: 'Looking for a skilled Java Developer with Spring Boot experience to design scalable microservices and manage REST APIs.',
      skills: 'Java, Spring Boot, MySQL, REST API',
      salary: '₹12,00,000 / year (12 LPA)',
      experience: '2-4 Years',
      jobType: 'Full-time'
    },
    {
      id: 2,
      title: 'Frontend React Developer',
      companyName: 'WebWorks Inc',
      location: 'Remote',
      description: 'Looking for a skilled React Developer to build dynamic interfaces, manage client-side state, and optimize web applications.',
      skills: 'React, JavaScript, CSS3, HTML5',
      salary: '₹10,50,000 / year (10.5 LPA)',
      experience: '1-3 Years',
      jobType: 'Full-time'
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      companyName: 'CloudTech',
      location: 'Bangalore',
      description: 'Looking for Node.js, Spring Boot, and React expertise to deliver end-to-end features across web services.',
      skills: 'Node.js, React, Java, MongoDB',
      salary: '₹15,00,000 / year (15 LPA)',
      experience: '3-5 Years',
      jobType: 'Full-time'
    }
  ];

  const [jobs, setJobs] = useState(defaultJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobsMap, setAppliedJobsMap] = useState({});
  const [notification, setNotification] = useState('');

  const currentUserEmail = localStorage.getItem('email') || 'guest';
  const userStorageKey = `appliedJobs_${currentUserEmail}`;

  const [applyingJob, setApplyingJob] = useState(null);
  const [applicantForm, setApplicantForm] = useState({
    fullName: '',
    email: currentUserEmail,
    phone: '',
    graduation: '',
    cgpa: '',
    occupation: '',
    address: '',
    resumeName: ''
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(userStorageKey);
      if (stored) {
        const parsedList = JSON.parse(stored);
        const map = {};
        parsedList.forEach((j) => {
          map[j.id] = true;
        });
        setAppliedJobsMap(map);
      }
    } catch (e) {
      console.log('Error reading applied jobs for active user');
    }

    fetch('http://localhost:8081/api/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setJobs(data);
        }
      })
      .catch(() => console.log('Using default jobs fallback'));
  }, [userStorageKey]);

  const openApplyModal = (job) => {
    setApplyingJob(job);
    setApplicantForm({
      fullName: '',
      email: currentUserEmail,
      phone: '',
      graduation: '',
      cgpa: '',
      occupation: '',
      address: '',
      resumeName: ''
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setApplicantForm((prev) => ({ ...prev, resumeName: file.name }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    const job = applyingJob;

    setAppliedJobsMap((prev) => ({
      ...prev,
      [job.id]: true
    }));

    const applicationData = {
      ...job,
      jobId: job.id,
      appliedDate: new Date().toLocaleDateString(),
      userEmail: currentUserEmail,
      applicantInfo: { ...applicantForm }
    };

    try {
      const existing = JSON.parse(localStorage.getItem(userStorageKey) || '[]');
      const isAlreadySaved = existing.some((item) => item.id === job.id);

      if (!isAlreadySaved) {
        const updated = [...existing, applicationData];
        localStorage.setItem(userStorageKey, JSON.stringify(updated));
      }
    } catch (err) {
      console.log('Error saving user applied job details');
    }

    fetch('http://localhost:8081/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(applicationData)
    })
      .then((res) => res.json())
      .then((data) => console.log('Successfully saved to Spring Boot Database:', data))
      .catch(() => console.log('Backend sync offline - application saved to user session'));

    setNotification(`Application for "${job.title}" submitted successfully!`);
    setApplyingJob(null);

    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchTerm.toLowerCase();
    const titleMatch = job.title?.toLowerCase().includes(query);
    const companyMatch = (job.companyName || job.company || '').toLowerCase().includes(query);
    const locationMatch = job.location?.toLowerCase().includes(query);
    const skillsMatch = job.skills?.toLowerCase().includes(query);

    return titleMatch || companyMatch || locationMatch || skillsMatch;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif', position: 'relative' }}>
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#2b6cb0',
            color: '#ffffff',
            padding: '14px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            fontWeight: 'bold',
            fontSize: '1rem',
            zIndex: 1000
          }}
        >
          ✓ {notification}
        </div>
      )}

      {applyingJob && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
            padding: '20px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: '28px',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '550px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              textAlign: 'left'
            }}
          >
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', color: '#1a202c' }}>
              Apply for {applyingJob.title}
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#718096', fontSize: '0.95rem' }}>
              {applyingJob.companyName || applyingJob.company}
            </p>

            <form onSubmit={handleFormSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={applicantForm.fullName}
                  onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={applicantForm.email}
                    onChange={(e) => setApplicantForm({ ...applicantForm, email: e.target.value })}
                    placeholder="name@example.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantForm.phone}
                    onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                    Graduation / Degree *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantForm.graduation}
                    onChange={(e) => setApplicantForm({ ...applicantForm, graduation: e.target.value })}
                    placeholder="e.g. B.Tech CSE"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                    CGPA / Marks *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantForm.cgpa}
                    onChange={(e) => setApplicantForm({ ...applicantForm, cgpa: e.target.value })}
                    placeholder="e.g. 8.5"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                  Current Occupation *
                </label>
                <input
                  type="text"
                  required
                  value={applicantForm.occupation}
                  onChange={(e) => setApplicantForm({ ...applicantForm, occupation: e.target.value })}
                  placeholder="e.g. Student, Fresher, Software Engineer"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                  Full Address *
                </label>
                <textarea
                  required
                  rows="2"
                  value={applicantForm.address}
                  onChange={(e) => setApplicantForm({ ...applicantForm, address: e.target.value })}
                  placeholder="City, State, Country"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e0', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px', color: '#2d3748', fontSize: '0.9rem' }}>
                  Upload Resume (PDF / DOCX) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ width: '100%', padding: '6px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  style={{
                    backgroundColor: '#edf2f7',
                    color: '#4a5568',
                    border: '1px solid #cbd5e0',
                    padding: '9px 16px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#3182ce',
                    color: '#ffffff',
                    border: 'none',
                    padding: '9px 20px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '24px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', color: '#1a202c' }}>
          Explore Open Roles
        </h2>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, company, location, or skills..."
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '1rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredJobs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p style={{ color: '#718096', fontSize: '1.1rem', margin: 0 }}>
              No matching jobs found for "<strong>{searchTerm}</strong>".
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedJobsMap[job.id];

            return (
              <div
                key={job.id}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', color: '#2d3748' }}>{job.title}</h3>
                    <p style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#4a5568' }}>
                      {job.companyName || job.company} — {job.location}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                      style={{
                        backgroundColor: '#edf2f7',
                        color: '#2d3748',
                        border: '1px solid #cbd5e0',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedJob?.id === job.id ? 'Hide Details' : 'View Details'}
                    </button>

                    <button
                      onClick={() => openApplyModal(job)}
                      disabled={isApplied}
                      style={{
                        backgroundColor: isApplied ? '#38a169' : '#3182ce',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 18px',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: isApplied ? 'default' : 'pointer',
                        opacity: isApplied ? 0.9 : 1
                      }}
                    >
                      {isApplied ? 'Applied ✓' : 'Apply'}
                    </button>
                  </div>
                </div>

                <p style={{ margin: '0 0 12px 0', color: '#718096' }}>{job.description}</p>

                <p style={{ margin: '0 0 6px 0', fontSize: '0.95rem' }}>
                  <strong>Skills:</strong> {job.skills}
                </p>

                <p style={{ margin: '0', fontSize: '1rem', color: '#2b6cb0', fontWeight: 'bold' }}>
                  Salary: {job.salary}
                </p>

                {selectedJob?.id === job.id && (
                  <div
                    style={{
                      marginTop: '16px',
                      paddingTop: '16px',
                      borderTop: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px'
                    }}
                  >
                    <h4 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Job Specifications</h4>
                    <p style={{ margin: '0 0 6px 0', color: '#4a5568' }}>
                      <strong>Experience Level:</strong> {job.experience || 'Not specified'}
                    </p>
                    <p style={{ margin: '0 0 6px 0', color: '#4a5568' }}>
                      <strong>Job Type:</strong> {job.jobType || 'Full-time'}
                    </p>
                    <p style={{ margin: '0', color: '#4a5568' }}>
                      <strong>Full Description:</strong> {job.description} Candidates must have strong problem-solving skills and clean code practices.
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default JobsPage;