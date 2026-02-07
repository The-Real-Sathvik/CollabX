// Discover Partners Integration

// Check if user is logged in
if (!isLoggedIn()) {
    alert('Please login first');
    window.location.href = 'login.html';
}

// Load and display partners
async function loadPartners() {
    try {
        const response = await fetch(API_ENDPOINTS.GET_USERS, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            displayPartners(data.users);
        } else if (response.status === 401) {
            alert('Session expired. Please login again.');
            removeAuthToken();
            window.location.href = 'login.html';
        } else {
            console.error('Error loading partners');
        }
    } catch (error) {
        console.error('Error loading partners:', error);
        alert('Network error. Please check your connection.');
    }
}

function displayPartners(users) {
    const partnersGrid = document.querySelector('.partners-grid');
    
    if (!users || users.length === 0) {
        partnersGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <h3 style="font-size: 24px; margin-bottom: 12px;">No partners found</h3>
                <p style="color: var(--color-text-secondary);">Check back later or adjust your search</p>
            </div>
        `;
        return;
    }

    partnersGrid.innerHTML = users.map(user => createPartnerCard(user)).join('');
    
    // Add event listeners to connect buttons
    document.querySelectorAll('.btn-connect').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.dataset.userId;
            sendCollaborationRequest(userId, this);
        });
    });

    // Initialize Lucide icons
    if (window.lucide) {
        lucide.createIcons();
    }
}

function createPartnerCard(user) {
    const skills = user.skills && user.skills.length > 0 
        ? user.skills.slice(0, 4).map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')
        : '<span class="skill-tag">No skills listed</span>';

    const projects = user.projects && user.projects.length > 0
        ? user.projects.slice(0, 2).map(project => {
            const url = project.includes('github.com') 
                ? project 
                : (project.includes('http') ? project : `http://${project}`);
            const icon = project.includes('github.com') ? 'github' : 'globe';
            return `
                <a href="${escapeHtml(url)}" class="card-link" target="_blank" rel="noopener">
                    <i data-lucide="${icon}" size="14"></i>
                    ${getDomain(project)}
                </a>
            `;
        }).join('')
        : '';

    return `
        <div class="partner-card">
            <div class="card-header">
                <div class="partner-avatar">
                    <img src="images/avatar${(Math.floor(Math.random() * 4) + 1)}.jpg" alt="${escapeHtml(user.name)}">
                </div>
                <div class="partner-info">
                    <h3>${escapeHtml(user.name)}</h3>
                    <p>Availability: ${escapeHtml(user.availability || 'Not specified')}</p>
                </div>
            </div>
            <div class="skills-list">
                ${skills}
            </div>
            ${projects ? `<div class="card-links">${projects}</div>` : ''}
            <div class="card-actions">
                <button class="btn-connect" data-user-id="${user._id}">Connect</button>
            </div>
        </div>
    `;
}

async function sendCollaborationRequest(userId, button) {
    try {
        button.disabled = true;
        button.textContent = 'Sending...';

        const response = await fetch(API_ENDPOINTS.SEND_REQUEST, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ toUserId: userId })
        });

        if (response.ok) {
            button.textContent = 'Request Sent';
            button.classList.remove('btn-connect');
            button.classList.add('btn-sent');
            button.disabled = true;
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to send request');
            button.disabled = false;
            button.textContent = 'Connect';
        }
    } catch (error) {
        console.error('Error sending request:', error);
        alert('Network error. Please try again.');
        button.disabled = false;
        button.textContent = 'Connect';
    }
}

// Helper functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function getDomain(url) {
    try {
        const urlObj = new URL(url.includes('http') ? url : `http://${url}`);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return url.slice(0, 30);
    }
}

// Search functionality
const searchInput = document.querySelector('.search-input');
let allUsers = [];

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayPartners(allUsers);
        return;
    }

    const filtered = allUsers.filter(user => {
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            (user.bio && user.bio.toLowerCase().includes(searchTerm)) ||
            (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchTerm)))
        );
    });

    displayPartners(filtered);
});

// Store users for search
async function loadPartnersWithSearch() {
    try {
        const response = await fetch(API_ENDPOINTS.GET_USERS, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            allUsers = data.users;
            displayPartners(allUsers);
        } else if (response.status === 401) {
            alert('Session expired. Please login again.');
            removeAuthToken();
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error loading partners:', error);
        alert('Network error. Please check your connection.');
    }
}

// Load partners on page load
loadPartnersWithSearch();
