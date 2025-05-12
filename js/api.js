/**
 * API client for my-ecommerce-site
 * Handles AJAX communication with the backend
 */

const API = {
  baseUrl: 'http://localhost:5000/api',

  /**
   * Send a contact form message
   * @param {Object} contactData - Contact form data
   * @returns {Promise} - Promise object with the contact form response
   */
  contact: async (contactData) => {
    const response = await fetch(`${API.baseUrl}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contactData)
    });
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return await response.json();
  },
  
  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} - Promise object with the login response
   */
  login : async (email, password) => {
    const response = await fetch(`${API.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return await response.json();
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Promise object with the registration response
   */
  register: async (userData) => {
    const response = await fetch(`${API.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      return response.json().then(err => Promise.reject(err));
    }
    return await response.json();
  }
};
