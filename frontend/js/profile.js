// Profile Page Integration

// Check if user is logged in
if (!isLoggedIn()) {
    alert('Please login first');
    window.location.href = 'login.html';
}

// Skills Management
const skills = [];
const skillInput = document.getElementById('skillInput');
const skillsContainer = document.getElementById('skillsContainer');

function addSkill(skill) {
    if (skill && !skills.includes(skill)) {
        skills.push(skill);
        renderSkills();
    }
}

function removeSkill(skill) {
    const index = skills.indexOf(skill);
    if (index > -1) {
        skills.splice(index, 1);
        renderSkills();
    }
}

function renderSkills() {
    skillsContainer.innerHTML = skills.map(skill => `
        <div class="skill-tag">
            <span>${skill}</span>
            <button type="button" onclick="removeSkill('${skill}')">&times;</button>
        </div>
    `).join('');
}

skillInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const skill = this.value.trim();
        if (skill) {
            addSkill(skill);
            this.value = '';
        }
    }
});

// Make removeSkill available globally
window.removeSkill = removeSkill;

// Project Management
let projectCount = 1;
const projectList = document.getElementById('projectList');
const addProjectBtn = document.getElementById('addProjectBtn');

addProjectBtn.addEventListener('click', function() {
    projectCount++;
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    projectItem.innerHTML = `
        <input 
            type="url" 
            name="project[]" 
            placeholder="GitHub Repo / Live Project Link"
        >
        <button type="button" class="remove-button" onclick="removeProject(this)">&times;</button>
    `;
    projectList.appendChild(projectItem);
});

window.removeProject = function(button) {
    if (projectList.children.length > 1) {
        button.parentElement.remove();
        projectCount--;
    }
};

// Load existing profile data
async function loadProfile() {
    try {
        const response = await fetch(API_ENDPOINTS.GET_ME, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const user = data.user;

            // Populate form with existing data
            if (user.name) document.getElementById('fullname').value = user.name;
            if (user.bio) document.getElementById('bio').value = user.bio;
            if (user.availability) document.getElementById('availability').value = user.availability;
            if (user.contact?.mobile) document.getElementById('mobile').value = user.contact.mobile;
            if (user.contact?.linkedin) document.getElementById('linkedin').value = user.contact.linkedin;

            // Load skills
            if (user.skills && user.skills.length > 0) {
                user.skills.forEach(skill => addSkill(skill));
            }

            // Load projects
            if (user.projects && user.projects.length > 0) {
                projectList.innerHTML = ''; // Clear default
                user.projects.forEach((project, index) => {
                    const projectItem = document.createElement('div');
                    projectItem.className = 'project-item';
                    projectItem.innerHTML = `
                        <input 
                            type="url" 
                            name="project[]" 
                            value="${project}"
                            placeholder="GitHub Repo / Live Project Link"
                        >
                        ${index > 0 ? '<button type="button" class="remove-button" onclick="removeProject(this)">&times;</button>' : ''}
                    `;
                    projectList.appendChild(projectItem);
                });
                projectCount = user.projects.length;
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Load profile on page load
loadProfile();

// Skip Button
document.getElementById('skipBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to skip profile creation? You can complete it later from your dashboard.')) {
        window.location.href = 'discover.html';
    }
});

// Form Submission
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const profileData = {
        name: formData.get('fullname'),
        bio: formData.get('bio'),
        skills: skills,
        projects: formData.getAll('project[]').filter(p => p.trim() !== ''),
        availability: formData.get('availability'),
        contact: {
            mobile: formData.get('mobile'),
            linkedin: formData.get('linkedin')
        }
    };

    // Basic validation
    if (!profileData.name) {
        alert('Please enter your full name');
        document.getElementById('fullname').focus();
        return;
    }

    if (skills.length === 0) {
        alert('Please add at least one skill');
        skillInput.focus();
        return;
    }

    if (!profileData.availability) {
        alert('Please specify your availability');
        document.getElementById('availability').focus();
        return;
    }

    // Call API
    try {
        const submitBtn = this.querySelector('.btn-primary');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        const response = await fetch(API_ENDPOINTS.GET_ME, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Profile saved successfully!');
            // Redirect to discover page
            window.location.href = 'discover.html';
        } else {
            alert(data.message || 'Failed to save profile');
        }
    } catch (error) {
        console.error('Profile save error:', error);
        alert('Network error. Please check your connection and try again.');
    } finally {
        const submitBtn = this.querySelector('.btn-primary');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save & Continue';
    }
});

// Form validation helpers
document.querySelectorAll('input[type="url"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !this.value.match(/^https?:\/\/.+/)) {
            this.setCustomValidity('Please enter a valid URL starting with http:// or https://');
        } else {
            this.setCustomValidity('');
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9+\-() ]/g, '');
    });
});
