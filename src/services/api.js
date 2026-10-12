import axios from 'axios';

// Base API instance pointing to backend server
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
});

// Automatically attach JWT token to every outgoing request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;