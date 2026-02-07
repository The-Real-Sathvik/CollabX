// Dashboard Integration

// Check if user is logged in
if (!isLoggedIn()) {
    alert('Please login first');
    window.location.href = 'login.html';
}

// Load dashboard data
async function loadDashboard() {
    try {
        const response = await fetch(API_ENDPOINTS.GET_REQUESTS, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            displayMatches(data.matches);
            displayReceivedRequests(data.receivedRequests);
            displaySentRequests(data.sentRequests);
            
            // Initialize Lucide icons after rendering
            if (window.lucide) {
                lucide.createIcons();
            }
        } else if (response.status === 401) {
            alert('Session expired. Please login again.');
            removeAuthToken();
            window.location.href = 'login.html';
        } else {
            console.error('Error loading dashboard');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Network error. Please check your connection.');
    }
}

function displayMatches(matches) {
    const matchesSection = document.querySelector('.dashboard-section:first-of-type');
    const firstCard = matchesSection.querySelector('.card');
    
    if (!matches || matches.length === 0) {
        firstCard.innerHTML = `
            <div style="text-align: center; padding: 40px; width: 100%;">
                <p style="color: var(--color-text-secondary); font-size: 16px;">No matches yet. Keep connecting with partners!</p>
            </div>
        `;
        return;
    }

    // Clear existing cards
    const parent = firstCard.parentElement;
    parent.innerHTML = '';

    // Add match cards
    matches.forEach(match => {
        const partner = match.fromUserId._id === getUserId() ? match.toUserId : match.fromUserId;
        parent.innerHTML += createMatchCard(partner);
    });
}

function displayReceivedRequests(requests) {
    const receivedSection = document.querySelectorAll('.dashboard-section')[1];
    const firstCard = receivedSection.querySelector('.card');
    const parent = firstCard.parentElement;
    
    if (!requests || requests.length === 0) {
        parent.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <p style="color: var(--color-text-secondary); font-size: 16px;">No pending requests</p>
            </div>
        `;
        return;
    }

    // Filter only pending requests
    const pendingRequests = requests.filter(req => req.status === 'pending');
    
    if (pendingRequests.length === 0) {
        parent.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <p style="color: var(--color-text-secondary); font-size: 16px;">No pending requests</p>
            </div>
        `;
        return;
    }

    parent.innerHTML = '';
    pendingRequests.forEach(request => {
        parent.innerHTML += createReceivedRequestCard(request);
    });

    // Add event listeners
    document.querySelectorAll('.btn-accept').forEach(btn => {
        btn.addEventListener('click', function() {
            respondToRequest(this.dataset.requestId, 'accept', this);
        });
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
        btn.addEventListener('click', function() {
            respondToRequest(this.dataset.requestId, 'reject', this);
        });
    });
}

function displaySentRequests(requests) {
    const sentSection = document.querySelectorAll('.dashboard-section')[2];
    const firstCard = sentSection.querySelector('.card');
    const parent = firstCard.parentElement;
    
    if (!requests || requests.length === 0) {
        parent.innerHTML = `
            <div class="card" style="text-align: center; padding: 40px;">
                <p style="color: var(--color-text-secondary); font-size: 16px;">No sent requests</p>
            </div>
        `;
        return;
    }

    parent.innerHTML = '';
    requests.forEach(request => {
        parent.innerHTML += createSentRequestCard(request);
    });
}

function createMatchCard(user) {
    const skills = user.skills && user.skills.length > 0 
        ? user.skills.slice(0, 3).map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')
        : '';

    return `
        <div class="card">
            <div class="card-left">
                <div class="card-avatar">
                    <img src="images/avatar${(Math.floor(Math.random() * 4) + 1)}.jpg" alt="${escapeHtml(user.name)}">
                </div>
                <div class="card-info">
                    <h3>${escapeHtml(user.name)}</h3>
                    <p>Availability: ${escapeHtml(user.availability || 'Not specified')}</p>
                </div>
            </div>
            <div class="card-middle">
                <div class="skills-container">
                    ${skills}
                </div>
            </div>
            <div class="card-right">
                <div class="contact-box">
                    <div class="contact-label">Contact Details</div>
                    <div class="contact-item">${escapeHtml(user.contact?.mobile || 'Not provided')}</div>
                    <div class="contact-item">
                        <a href="${escapeHtml(user.contact?.linkedin || '#')}" target="_blank" rel="noopener">
                            ${user.contact?.linkedin ? formatLinkedIn(user.contact.linkedin) : 'Not provided'}
                            ${user.contact?.linkedin ? '<i data-lucide="external-link" size="12"></i>' : ''}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createReceivedRequestCard(request) {
    const user = request.fromUserId;
    const skills = user.skills && user.skills.length > 0 
        ? user.skills.slice(0, 3).map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')
        : '';

    return `
        <div class="card">
            <div class="card-left">
                <div class="card-avatar">
                    <img src="images/avatar${(Math.floor(Math.random() * 4) + 1)}.jpg" alt="${escapeHtml(user.name)}">
                </div>
                <div class="card-info">
                    <h3>${escapeHtml(user.name)}</h3>
                    <p>Availability: ${escapeHtml(user.availability || 'Not specified')}</p>
                </div>
            </div>
            <div class="card-middle">
                <div class="skills-container">
                    ${skills}
                </div>
            </div>
            <div class="card-right">
                <div class="actions-container">
                    <button class="btn btn-reject" data-request-id="${request._id}">Reject</button>
                    <button class="btn btn-accept" data-request-id="${request._id}">Accept</button>
                </div>
            </div>
        </div>
    `;
}

function createSentRequestCard(request) {
    const user = request.toUserId;
    const skills = user.skills && user.skills.length > 0 
        ? user.skills.slice(0, 3).map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')
        : '';

    let statusBadge = '';
    if (request.status === 'pending') {
        statusBadge = '<span class="status-badge">Pending</span>';
    } else if (request.status === 'rejected') {
        statusBadge = '<span class="status-badge rejected">Rejected</span>';
    }

    return `
        <div class="card">
            <div class="card-left">
                <div class="card-avatar">
                    <img src="images/avatar${(Math.floor(Math.random() * 4) + 1)}.jpg" alt="${escapeHtml(user.name)}">
                </div>
                <div class="card-info">
                    <h3>${escapeHtml(user.name)}</h3>
                    <p>Availability: ${escapeHtml(user.availability || 'Not specified')}</p>
                </div>
            </div>
            <div class="card-middle">
                <div class="skills-container">
                    ${skills}
                </div>
            </div>
            <div class="card-right">
                ${statusBadge}
            </div>
        </div>
    `;
}

async function respondToRequest(requestId, action, button) {
    try {
        const card = button.closest('.card');
        const allButtons = card.querySelectorAll('button');
        allButtons.forEach(btn => btn.disabled = true);

        const response = await fetch(API_ENDPOINTS.RESPOND_REQUEST(requestId), {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ action })
        });

        if (response.ok) {
            // Reload dashboard
            loadDashboard();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to respond to request');
            allButtons.forEach(btn => btn.disabled = false);
        }
    } catch (error) {
        console.error('Error responding to request:', error);
        alert('Network error. Please try again.');
        const card = button.closest('.card');
        card.querySelectorAll('button').forEach(btn => btn.disabled = false);
    }
}

// Helper functions
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatLinkedIn(url) {
    try {
        const urlObj = new URL(url.includes('http') ? url : `https://${url}`);
        return urlObj.hostname + urlObj.pathname.slice(0, 20);
    } catch {
        return url.slice(0, 30);
    }
}

function getUserId() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        return JSON.parse(userData).id;
    }
    return null;
}

// Load dashboard on page load
loadDashboard();
