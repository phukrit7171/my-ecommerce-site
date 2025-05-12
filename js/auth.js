/**
 * Authentication module for my-ecommerce-site
 * Handles login and registration form interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements references
  const contactForm = document.querySelector('#contact-us form');
  const registerForm = document.querySelector('#register form');
  const loginForm = document.querySelector('#sign-In form');
  const messageContainer = document.createElement('div');
  messageContainer.className = 'message-container';
  document.querySelector('.contact-wrap').appendChild(messageContainer);
  
  // Add event listeners
  if (contactForm) {
    contactForm.addEventListener('submit', handleContact);
  }

  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Handle contact form submission
  async function handleContact(event) {
    event.preventDefault();
    
    const contactData = {
      firstName: contactForm.querySelector('input[placeholder="First name"]').value,
      lastName: contactForm.querySelector('input[placeholder="Last name"]').value,
      subject: contactForm.querySelector('input[placeholder="Subject"]').value,
      email: contactForm.querySelector('input[placeholder="Email"]').value,
      message: contactForm.querySelector('textarea').value
    };

    try {
      showMessage('Sending message...', 'info');
      await API.contact(contactData);
      showMessage('Message sent successfully!', 'success');
      contactForm.reset();
    } catch (error) {
      showMessage(error.message || 'Failed to send message. Please try again.', 'error');
    }
  }
  
  /**
   * Handle login form submission
   * @param {Event} event - The form submit event
   */
  async function handleLogin(event) {
    event.preventDefault();
    
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
    // Show loading indicator
    showMessage('Logging in...', 'info');
    
    API.login(email, password)
      .then(response => {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        showMessage('Login successful!', 'success');
        updateUIAfterLogin(response.user);
      })
      .catch(error => {
        showMessage(error.message || 'Login failed. Please try again.', 'error');
      });
  }
  
  /**
   * Handle registration form submission
   * @param {Event} event - The form submit event
   */
  async function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
      firstName: registerForm.querySelector('input[placeholder="First name"]').value,
      lastName: registerForm.querySelector('input[placeholder="Last name"]').value,
      category: registerForm.querySelector('#occupation-category').value,
      occupation: registerForm.querySelector('#occupation').value,
      email: registerForm.querySelector('input[type="email"]').value,
      password: registerForm.querySelector('input[type="password"]').value
    };
    
    // Show loading indicator
    showMessage('Processing registration...', 'info');
    
    API.register(userData)
      .then(response => {
        showMessage('Registration successful! You can now log in.', 'success');
        // Optionally redirect to login or auto-login the user
        // switchToLoginTab();
      })
      .catch(error => {
        showMessage(error.message || 'Registration failed. Please try again.', 'error');
      });
  }
  
  /**
   * Handle logout button click
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    updateUIAfterLogout();
    showMessage('You have been logged out successfully.', 'success');
  }
  
  /**
   * Display a message to the user
   * @param {string} message - The message to display
   * @param {string} type - The type of message (success, error, info)
   */
  function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.textContent = message;
    
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageDiv);
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  
    authMessage.textContent = message;
    authMessage.className = ''; // Clear previous classes
    authMessage.classList.add('message', type);
    
    // Hide message after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        authMessage.textContent = '';
        authMessage.className = '';
      }, 5000);
    }
  }
  
  /**
   * Check if user is already logged in
   */
  const checkAuthStatus = () => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        updateUIAfterLogin(user);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
      }
    }
  }
  
  /**
   * Update UI after successful login
   * @param {Object} user - The logged in user data
   */
  const updateUIAfterLogin = (user) => {
    // Hide auth forms if they exist
    if (document.querySelector('.auth-container')) {
      document.querySelector('.auth-container').style.display = 'none';
    }
    
    // Show user profile if it exists
    if (userProfileSection) {
      userProfileSection.style.display = 'block';
      const userEmail = userProfileSection.querySelector('.user-email');
      if (userEmail) {
        userEmail.textContent = user.email;
      }
    }
    
    // Update navigation items
    updateNavigation(true);
  }
  
  /**
   * Update UI after logout
   */
  const updateUIAfterLogout = () => {
    // Show auth forms if they exist
    if (document.querySelector('.auth-container')) {
      document.querySelector('.auth-container').style.display = 'block';
    }
    
    // Hide user profile if it exists
    if (userProfileSection) {
      userProfileSection.style.display = 'none';
    }
    
    // Update navigation items
    updateNavigation(false);
  }
  
  /**
   * Update navigation items based on auth status
   * @param {boolean} isLoggedIn - Whether user is logged in
   */
  const updateNavigation = (isLoggedIn) => {
    const authNav = document.querySelector('.auth-nav');
    if (!authNav) return;
    
    const loginLink = authNav.querySelector('.login-link');
    const registerLink = authNav.querySelector('.register-link');
    const profileLink = authNav.querySelector('.profile-link');
    const logoutLink = authNav.querySelector('.logout-link');
    
    if (isLoggedIn) {
      if (loginLink) loginLink.style.display = 'none';
      if (registerLink) registerLink.style.display = 'none';
      if (profileLink) profileLink.style.display = 'inline-block';
      if (logoutLink) logoutLink.style.display = 'inline-block';
    } else {
      if (loginLink) loginLink.style.display = 'inline-block';
      if (registerLink) registerLink.style.display = 'inline-block';
      if (profileLink) profileLink.style.display = 'none';
      if (logoutLink) logoutLink.style.display = 'none';
    }
  }
});
