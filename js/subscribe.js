document.addEventListener('DOMContentLoaded', () => {
    const subscribeForm = document.getElementById('subscribeForm');
    const subscribeEmail = document.getElementById('subscribeEmail');
    const subscribeStatus = document.createElement('div');
    subscribeStatus.className = 'mt-2';
    
    if (subscribeForm && subscribeEmail) {
        subscribeEmail.parentElement.appendChild(subscribeStatus);
        
        subscribeForm.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = subscribeEmail.value.trim();
            
            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                subscribeStatus.className = 'mt-2 text-danger';
                subscribeStatus.textContent = 'Please enter a valid email address';
                return;
            }
            
            try {
                subscribeForm.disabled = true;
                subscribeStatus.className = 'mt-2 text-info';
                subscribeStatus.textContent = 'Subscribing...';
                
                const response = await API.subscribe(email);
                subscribeStatus.className = 'mt-2 text-success';
                subscribeStatus.textContent = 'Thank you for subscribing!';
                subscribeEmail.value = '';
            } catch (error) {
                subscribeStatus.className = 'mt-2 text-danger';
                subscribeStatus.textContent = error.message || 'Failed to subscribe. Please try again.';
            } finally {
                subscribeForm.disabled = false;
            }
        });
    }
});
