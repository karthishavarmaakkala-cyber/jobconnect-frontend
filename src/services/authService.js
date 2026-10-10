import API from './api';

export const login = async (credentials) => {
  const res = await API.post('/auth/login', credentials);
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data));
  }
  return res.data;
};

export const register = async (userData) => {
  const res = await API.post('/auth/register', userData);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};