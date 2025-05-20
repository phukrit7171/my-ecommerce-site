/**
 * Authentication and related forms module for the website.
 * Handles login, registration, contact form submissions, and occupation loading.
 */
document.addEventListener('DOMContentLoaded', () => {

  // --- Element Selection ---
  // เลือกฟอร์มด้วย ID ที่เรากำหนดใน HTML
  const contactForm = document.querySelector('#contact-us form'); // หา form ใน tab contact-us
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');

  // เลือกพื้นที่แสดงข้อความสำหรับแต่ละฟอร์ม
  const contactMessageArea = document.getElementById('contact-message-area'); // คุณต้องเพิ่ม div นี้ใน contact form tab ของ HTML
  const registerMessageArea = document.getElementById('register-message-area');
  const loginMessageArea = document.getElementById('login-message-area');
  const globalMessageArea = document.getElementById('global-message-area');

  // เลือก <select> สำหรับ occupation
  const occupationCategorySelect = document.getElementById('occupation-category');
  const occupationSelect = document.getElementById('occupation');

  // --- Function Definitions ---

  /**
   * Displays a message to the user in a specified area.
   * @param {string} message - The message text.
   * @param {'success'|'info'|'error'} type - The type of message (success, info, error/danger).
   * @param {HTMLElement} targetElement - The HTML element where the message should be displayed.
   */
  function showMessage(message, type, targetElement) {
      // ใช้ global area ถ้าไม่ได้ระบุ target หรือ target ไม่มีอยู่
      const displayArea = targetElement || globalMessageArea;
      if (!displayArea) {
          console.error("Message display area not found!");
          return;
      }

      displayArea.innerHTML = ''; // Clear previous messages in that specific area
      const messageDiv = document.createElement('div');
      // เปลี่ยน 'error' เป็น 'danger' สำหรับ Bootstrap alert classes
      const alertType = type === 'error' ? 'danger' : type;
      messageDiv.className = `alert alert-${alertType} my-3`; // ใช้ Bootstrap alert classes
      messageDiv.textContent = message;
      displayArea.appendChild(messageDiv);

      // Auto-hide message after 5 seconds
      setTimeout(() => {
          // ตรวจสอบก่อนลบ เผื่อมีข้อความใหม่แสดงทับไปแล้ว
          if (messageDiv.parentNode === displayArea) {
              displayArea.removeChild(messageDiv);
          }
      }, 10000);
  }

  /**
   * Loads occupation categories from JSON and populates the category select dropdown.
   */
  function loadOccupationCategories() {
      if (!occupationCategorySelect) return; // Exit if select element doesn't exist

      fetch('/json/occupation-cat.json') // ใช้ fetch แทน XMLHttpRequest
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
              if (data && data['occupation-categories']) {
                  data['occupation-categories'].forEach(category => {
                      const option = document.createElement('option');
                      option.value = category.toLowerCase().replace(/\s+/g, '-'); // สร้าง value ที่เหมาะกับชื่อไฟล์
                      option.textContent = category;
                      occupationCategorySelect.appendChild(option);
                  });
              } else {
                   console.error('Occupation categories data is missing or malformed.');
              }
          })
          .catch(error => {
              console.error('Error loading occupation categories:', error);
              // อาจแสดงข้อความบอกผู้ใช้ด้วย showMessage
              // showMessage('Could not load occupation categories.', 'error', registerMessageArea);
          });
  }

  /**
   * Loads specific occupations based on the selected category.
   * @param {string} categoryValue - The value of the selected occupation category (e.g., 'technology').
   */
  function loadOccupations(categoryValue) {
      if (!categoryValue || !occupationSelect) return;

      // Clear previous options and disable select while loading
      occupationSelect.innerHTML = '<option value="" disabled selected>Loading occupations...</option>';
      occupationSelect.disabled = true;

      fetch(`/json/${categoryValue}.json`) // ใช้ categoryValue ที่แปลงแล้วเป็นชื่อไฟล์
          .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(data => {
               occupationSelect.innerHTML = '<option value="" disabled selected>Select your occupation</option>'; // Reset placeholder
              if (data && data.occupations) {
                  data.occupations.forEach(occupation => {
                      const option = document.createElement('option');
                      // ควรมี value ที่ไม่ซ้ำกัน อาจใช้ occupation name เอง หรือถ้ามี id จะดีกว่า
                      option.value = occupation.toLowerCase().replace(/\s+/g, '-');
                      option.textContent = occupation;
                      occupationSelect.appendChild(option);
                  });
                  occupationSelect.disabled = false; // Enable select
              } else {
                  occupationSelect.innerHTML = '<option value="" disabled selected>No occupations found</option>';
                   console.error('Occupations data is missing or malformed for category:', categoryValue);
              }
          })
          .catch(error => {
              console.error('Error loading occupations:', error);
               occupationSelect.innerHTML = '<option value="" disabled selected>Error loading occupations</option>';
               showMessage(`Could not load occupations for ${categoryValue}.`, 'error', registerMessageArea);
          });
  }

  /**
   * Handles the contact form submission.
   * @param {Event} event - The form submit event.
   */
  async function handleContact(event) {
      event.preventDefault();
      if (!contactMessageArea) {
           console.error("Contact message area not found!");
           return;
      }

      // ดึงข้อมูลจากฟอร์มโดยใช้ name attribute
      const form = event.target;
      const contactData = {
          fname: form.elements['contactFirstName'].value,
          lname: form.elements['contactLastName'].value,
          subject: form.elements['contactSubject'].value,
          email: form.elements['contactEmail'].value,
          message: form.elements['contactMessage'].value
      };

      showMessage('Sending message...', 'info', contactMessageArea);

      try {
          const result = await API.contact(contactData); // API.contact ถูกกำหนดใน api.js
          showMessage(result.message || 'Message sent successfully!', 'success', contactMessageArea);
          form.reset(); // เคลียร์ฟอร์มหลังส่งสำเร็จ
      } catch (error) {
          console.error('Contact form error:', error);
          showMessage(error.message || 'Failed to send message. Please try again.', 'error', contactMessageArea);
      }
  }

  /**
   * Handles the registration form submission.
   * @param {Event} event - The form submit event.
   */
  async function handleRegister(event) {
      event.preventDefault();
       if (!registerMessageArea) {
           console.error("Register message area not found!");
           return;
       }

      const form = event.target;
      // ดึงข้อมูลจาก register form โดยใช้ name attribute ที่เราเพิ่มใน HTML
      const userData = {
          firstName: form.elements['registerFirstName'].value,
          lastName: form.elements['registerLastName'].value,
          category: form.elements['occupation-category'].value, // ใช้ id หรือ name ก็ได้
          occupation: form.elements['occupation'].value,      // ใช้ id หรือ name ก็ได้
          email: form.elements['registerEmail'].value,
          password: form.elements['registerPassword'].value
      };

      // Basic client-side validation (can add more)
      if (!userData.firstName || !userData.lastName || !userData.category || !userData.occupation || !userData.email || !userData.password) {
           showMessage('Please fill in all required fields.', 'error', registerMessageArea);
           return;
      }

      showMessage('Processing registration...', 'info', registerMessageArea);

      try {
          const result = await API.register(userData); // API.register ถูกกำหนดใน api.js
          showMessage(result.message || 'Registration successful! You can now log in.', 'success', registerMessageArea);
          form.reset();
          occupationSelect.innerHTML = '<option value="" disabled selected>Select your occupation</option>';
          occupationSelect.disabled = true;
          // อาจจะสลับไปที่ Tab Sign-In โดยอัตโนมัติ
          // bootstrap.Tab.getInstance(document.getElementById('sign-in-tab')).show(); // หากใช้ Bootstrap 5
      } catch (error) {
          console.error('Registration error:', error);
          showMessage(error.message || 'Registration failed. Please try again.', 'error', registerMessageArea);
      }
  }

  /**
   * Handles the login form submission.
   * @param {Event} event - The form submit event.
   */
  async function handleLogin(event) {
      event.preventDefault();
      if (!loginMessageArea) {
          console.error("Login message area not found!");
          return;
      }

      const form = event.target;
      // ดึงข้อมูลจาก login form โดยใช้ name attribute
      const email = form.elements['loginEmail'].value;
      const password = form.elements['loginPassword'].value;

       // Basic client-side validation
       if (!email || !password) {
           showMessage('Please enter both email and password.', 'error', loginMessageArea);
           return;
       }

      showMessage('Logging in...', 'info', loginMessageArea);

      try {
          const response = await API.login(email, password); // API.login ถูกกำหนดใน api.js
          showMessage(response.message || 'Login successful!', 'success', loginMessageArea);
          // บันทึกข้อมูล user ลง localStorage (ควรพิจารณาใช้ session/token ที่ปลอดภัยกว่าในระยะยาว)
          localStorage.setItem('user', JSON.stringify(response.user));
          updateUIAfterLogin(response.user);
          // อาจจะ redirect ไปหน้า profile หรือ dashboard
          // window.location.href = '/dashboard.html';
      } catch (error) {
          console.error('Login error:', error);
          showMessage(error.message || 'Login failed. Invalid email or password.', 'error', loginMessageArea);
      }
  }

   /**
    * Handles the logout action.
    */
  function handleLogout() {
      localStorage.removeItem('user');
      updateUIAfterLogout();
      // อาจจะแสดงข้อความยืนยัน logout ใน global area หรือ redirect กลับหน้าหลัก
      showMessage('You have been logged out successfully.', 'success', globalMessageArea);
      // window.location.href = '/index.html';
  }


  /**
   * Updates the UI elements after a successful login.
   * Hides login/register forms, shows user info/profile link, logout button etc.
   * NOTE: Selectors used here ('.auth-container', '#user-profile', etc.)
   * must match your actual HTML structure.
   * @param {Object} user - The logged-in user data (e.g., { email: '...' }).
   */
  function updateUIAfterLogin(user) {
      console.log('Updating UI for logged-in user:', user.email);

      // ตัวอย่าง: ซ่อนส่วนของฟอร์มทั้งหมด (อาจจะต้องปรับ selector)
      const authTabs = document.getElementById('myTab');
      if (authTabs) {
           // อาจจะซ่อน tab หรือ ซ่อน content ทั้งหมด
           // authTabs.style.display = 'none'; // ซ่อน Tabs
           const tabContent = document.getElementById('myTabContent');
         tabContent.style.display = 'none'; // ซ่อน Content
         showMessage('Login successful!', 'success', globalMessageArea);
      }

      // ตัวอย่าง: แสดงส่วนข้อมูลผู้ใช้ (คุณต้องสร้างส่วนนี้ใน HTML)
      const userProfileSection = document.getElementById('user-profile-section'); // สร้าง <div id="user-profile-section"> ใน HTML
      if (userProfileSection) {
          userProfileSection.style.display = 'block'; // แสดงผล
          userProfileSection.innerHTML = `
              <p>Welcome, ${user.email}!</p>
              <button id="logout-button" class="btn btn-danger btn-sm">Logout</button>
          `;
          // Add event listener to the newly created logout button
          const logoutButton = document.getElementById('logout-button');
          if (logoutButton) {
              logoutButton.addEventListener('click', handleLogout);
          }
      }

      // อัปเดต Navigation Bar (ถ้ามี)
      updateNavigation(true);
  }

  /**
   * Updates the UI elements after logging out.
   * Shows login/register forms, hides user info/profile link, etc.
   * NOTE: Selectors used here must match your actual HTML structure.
   */
  function updateUIAfterLogout() {
      console.log('Updating UI for logged-out user');

       // ตัวอย่าง: แสดงส่วนของฟอร์มอีกครั้ง
      const authTabs = document.getElementById('myTab');
       if (authTabs) {
           // authTabs.style.display = 'flex'; // หรือ 'block' ขึ้นอยู่กับ CSS เดิม
           const tabContent = document.getElementById('myTabContent');
           if(tabContent) tabContent.style.display = 'block';
       }


      // ตัวอย่าง: ซ่อนส่วนข้อมูลผู้ใช้
      const userProfileSection = document.getElementById('user-profile-section');
      if (userProfileSection) {
          userProfileSection.style.display = 'none';
          userProfileSection.innerHTML = ''; // Clear content
      }

      // อัปเดต Navigation Bar (ถ้ามี)
      updateNavigation(false);
  }

  /**
   * Updates navigation links based on login status.
   * NOTE: Selectors used here ('.auth-nav', '.login-link', etc.)
   * must match your actual HTML structure for navigation.
   * @param {boolean} isLoggedIn - Whether the user is logged in.
   */
  function updateNavigation(isLoggedIn) {
      // คุณต้องมี element เหล่านี้ใน HTML navbar ของคุณ
      const loginLink = document.querySelector('.login-nav-link'); // ตัวอย่าง selector
      const registerLink = document.querySelector('.register-nav-link'); // ตัวอย่าง selector
      const profileLink = document.querySelector('.profile-nav-link'); // ตัวอย่าง selector
      const logoutLink = document.querySelector('.logout-nav-link'); // ตัวอย่าง selector

      console.log('Updating navigation state, isLoggedIn:', isLoggedIn);

      if (isLoggedIn) {
          if (loginLink) loginLink.style.display = 'none';
          if (registerLink) registerLink.style.display = 'none';
          if (profileLink) profileLink.style.display = 'inline-block'; // หรือ 'block'
          if (logoutLink) logoutLink.style.display = 'inline-block'; // หรือ 'block'
      } else {
          if (loginLink) loginLink.style.display = 'inline-block';
          if (registerLink) registerLink.style.display = 'inline-block';
          if (profileLink) profileLink.style.display = 'none';
          if (logoutLink) logoutLink.style.display = 'none';
      }
       // ถ้าปุ่ม logout ถูกสร้างแบบ dynamic ใน updateUIAfterLogin
       // อาจจะไม่ต้องจัดการ logoutLink ที่นี่โดยตรง แต่จัดการผ่านการแสดง/ซ่อน userProfileSection
  }

   /**
   * Checks authentication status on page load based on localStorage.
   */
  function checkAuthStatus() {
      const userData = localStorage.getItem('user');
      if (userData) {
          try {
              const user = JSON.parse(userData);
              if (user && user.email) { // Basic check if user data seems valid
                  console.log('User found in localStorage, updating UI.');
                  updateUIAfterLogin(user);
              } else {
                  console.log('Invalid user data in localStorage.');
                  localStorage.removeItem('user');
                  updateUIAfterLogout(); // Ensure UI is in logged-out state
              }
          } catch (error) {
              console.error('Failed to parse user data from localStorage:', error);
              localStorage.removeItem('user');
              updateUIAfterLogout(); // Ensure UI is in logged-out state
          }
      } else {
          console.log('No user data in localStorage, setting logged-out UI.');
          updateUIAfterLogout(); // Set UI to logged-out state explicitly
      }
  }


  // --- Event Listeners and Initial Setup ---

  // Load categories as soon as the DOM is ready
  loadOccupationCategories();

  // Add listener for category changes to load specific occupations
  if (occupationCategorySelect) {
      occupationCategorySelect.addEventListener('change', function() {
          loadOccupations(this.value); // Pass the selected value (e.g., 'technology')
      });
  }

  // Add form submit listeners
  if (contactForm) {
      contactForm.addEventListener('submit', handleContact);
  } else {
      console.warn("Contact form not found.");
  }

  if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
  } else {
      console.warn("Register form not found.");
  }

  if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
  } else {
      console.warn("Login form not found.");
  }

  // Add listener for dynamically created logout button (if needed elsewhere)
  // If logout button is always inside #user-profile-section, the listener
  // added in updateUIAfterLogin is sufficient.

  // Check login status when the page loads
  checkAuthStatus();

}); // End of DOMContentLoaded