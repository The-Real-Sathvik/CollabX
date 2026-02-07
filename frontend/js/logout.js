// Logout functionality
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        removeAuthToken();
        window.location.href = 'login.html';
    }
}

// Make it globally available
window.logout = logout;
