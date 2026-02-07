// Sign Up Logic
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const email = document.getElementById('email').value;
    const fullname = document.getElementById('fullname').value;

    // Reset error states
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());

    // Validate passwords match
    if (password !== confirmPassword) {
        const confirmInput = document.getElementById('confirm-password');
        confirmInput.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Passwords do not match';
        confirmInput.parentElement.appendChild(errorMsg);
        return;
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
        const passwordInput = document.getElementById('password');
        passwordInput.classList.add('error');
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Password must be at least 6 characters';
        passwordInput.parentElement.appendChild(errorMsg);
        return;
    }

    // Call API
    try {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        const response = await fetch(API_ENDPOINTS.SIGNUP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: fullname,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token
            setAuthToken(data.token);
            
            alert('Account created successfully!');
            
            // Redirect to profile creation
            window.location.href = 'profile.html';
        } else {
            // Show error
            const emailInput = document.getElementById('email');
            emailInput.classList.add('error');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = data.message || 'Failed to create account';
            emailInput.parentElement.appendChild(errorMsg);
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Network error. Please check your connection and try again.');
    } finally {
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
    }
});

// Real-time password match validation
document.getElementById('confirm-password').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    
    if (confirmPassword && password !== confirmPassword) {
        this.classList.add('error');
    } else {
        this.classList.remove('error');
    }
});
