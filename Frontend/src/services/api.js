// services/api.js
const API_URL = 'https://document-app-a9qh.onrender.com/api';

const request = async (endpoint, method = 'GET', data = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'An error occurred');
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export const performLogin = async (credentials) => {
  return request('/auth/login', 'POST', credentials);
};

export const performRegister = async (userData) => {
  return request('/auth/register', 'POST', userData);
};

export const refreshToken = async () => {
  return request('/auth/refresh-token', 'POST', null, localStorage.getItem('token'));
};


export const getDocuments = async (token) => {
  return request('/documents', 'GET', null, token);
};

export const getDocumentById = async (documentId, token) => {
  return request(`/documents/${documentId}`, 'GET', null, token);
};

export const updateDocument = async (documentId, data, token) => {
  return request(`/documents/${documentId}`, 'PUT', data, token);
};

export const createDocument = async (data, token) => {
  return request('/documents', 'POST', data, token);
};

export const deleteDocument = async (documentId, token) => {
  return request(`/documents/${documentId}`, 'DELETE', null, token);
};
