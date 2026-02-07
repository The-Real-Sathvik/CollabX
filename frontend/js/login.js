// Login Logic
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = this.querySelector('.submit-btn');

    // Reset error states
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());

    // Basic validation
    if (!email || !password) {
        if (!email) {
            const emailInput = document.getElementById('email');
            emailInput.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Email is required';
            emailInput.parentElement.appendChild(errorMsg);
        }
        if (!password) {
            const passwordInput = document.getElementById('password');
            passwordInput.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Password is required';
            passwordInput.parentElement.appendChild(errorMsg);
        }
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const emailInput = document.getElementById('email');
        emailInput.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please enter a valid email address';
        emailInput.parentElement.appendChild(errorMsg);
        return;
    }

    // Call API
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        const response = await fetch(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token
            setAuthToken(data.token);
            
            // Save user data
            localStorage.setItem('userData', JSON.stringify(data.user));
            localStorage.setItem('collabx_email', email);
            
            alert('Login successful!');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error
            const passwordInput = document.getElementById('password');
            passwordInput.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = data.message || 'Invalid credentials';
            passwordInput.parentElement.appendChild(errorMsg);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Network error. Please check your connection and try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log In';
    }
});

// Clear error state on input
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorMsg = this.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
});

// Remember email (optional enhancement)
const savedEmail = localStorage.getItem('collabx_email');
if (savedEmail) {
    document.getElementById('email').value = savedEmail;
}
