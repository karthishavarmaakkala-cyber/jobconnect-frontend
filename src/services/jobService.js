import axios from 'axios';

const API_URL = 'http://localhost:8081/api/jobs';

// Fetch all jobs or search jobs
export const fetchJobs = async (search = '') => {
  const url = search && search.trim() !== '' 
    ? `${API_URL}?search=${encodeURIComponent(search.trim())}` 
    : API_URL;
  const response = await axios.get(url);
  return response.data;
};

// Fetch single job by ID
export const fetchJobById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Apply for a job
export const applyForJob = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/${id}/apply`,
    {},
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  );
  return response.data;
};

// Create a new job post
export const createJob = async (jobData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL, jobData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return response.data;
};

// Fetch applications submitted by logged-in user
export const fetchMyApplications = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/applications/me`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return response.data;
};

// Fetch applications for recruiter's job postings
export const fetchJobApplications = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/applications/recruiter`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  return response.data;
};

// Update status of an application
export const updateApplicationStatus = async (applicationId, status) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/applications/${applicationId}`,
    { status },
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  );
  return response.data;
};

export default {
  fetchJobs,
  fetchJobById,
  applyForJob,
  createJob,
  fetchMyApplications,
  fetchJobApplications,
  updateApplicationStatus,
};