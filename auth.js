// Authentication utility functions
class AuthManager {
    constructor() {
        this.checkAuthStatus();
    }
    
    checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        if (isLoggedIn && userData) {
            this.showLoggedInState(userData);
        } else {
            this.showLoggedOutState();
        }
    }
    
    showLoggedInState(userData) {
        // Update navigation
        const accountLink = document.getElementById('account-link');
        const userStatus = document.getElementById('user-status');
        const userNameDisplay = document.getElementById('user-name-display');
        
        if (accountLink) accountLink.textContent = 'Dashboard';
        if (userStatus) {
            userStatus.style.display = 'inline';
            if (userNameDisplay) userNameDisplay.textContent = userData.name;
        }
        
        // Add user-specific content if available
        this.addUserContent(userData);
    }
    
    showLoggedOutState() {
        const accountLink = document.getElementById('account-link');
        const userStatus = document.getElementById('user-status');
        
        if (accountLink) accountLink.textContent = 'Account';
        if (userStatus) userStatus.style.display = 'none';
        
        // Remove user-specific content
        this.removeUserContent();
    }
    
    addUserContent(userData) {
        // Add personalized welcome message
        const heroContent = document.querySelector('.hero-content p');
        if (heroContent) {
            heroContent.innerHTML = `Hi ${userData.name}! I'm Oduro Ezekiel Hayford, a passionate web developer creating beautiful and functional websites. Welcome back!`;
        }
        
        // Add user-specific project recommendations
        const projectsSection = document.querySelector('.projects-gallery');
        if (projectsSection) {
            const userProjectsDiv = document.createElement('div');
            userProjectsDiv.className = 'user-projects';
            userProjectsDiv.innerHTML = `
                <h3 style="color: #6a1b9a; margin-top: 2rem; border-top: 2px solid #f0f0f0; padding-top: 1rem;">
                    Recommended for ${userData.name}
                </h3>
                <p style="color: #666; font-style: italic;">Based on your profile, you might be interested in these projects:</p>
            `;
            projectsSection.appendChild(userProjectsDiv);
        }
    }
    
    removeUserContent() {
        // Remove user-specific content
        const userProjects = document.querySelector('.user-projects');
        if (userProjects) userProjects.remove();
        
        // Reset hero content
        const heroContent = document.querySelector('.hero-content p');
        if (heroContent) {
            heroContent.innerHTML = "Hi! I'm Oduro Ezekiel Hayford, a passionate web developer creating beautiful and functional websites. I love turning ideas into reality through code and design.";
        }
    }
    
    logout() {
        // Show loading state
        this.showMessage('Logging out...', 'info');
        
        // Clear user data from localStorage
        localStorage.removeItem('userData');
        localStorage.removeItem('isLoggedIn');
        
        // Update the UI
        this.checkAuthStatus();
        
        // Show success message
        setTimeout(() => {
            this.showMessage('You have been logged out successfully!', 'success');
        }, 500);
        
        // Redirect to home page if on account page
        if (window.location.pathname.includes('Account.HTML')) {
            setTimeout(() => {
                window.location.href = 'INDEX.HTML';
            }, 2000);
        } else {
            // Reload the page to update the UI
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }
    
    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 7px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                messageDiv.style.background = '#28a745';
                break;
            case 'error':
                messageDiv.style.background = '#dc3545';
                break;
            case 'warning':
                messageDiv.style.background = '#ffc107';
                messageDiv.style.color = '#333';
                break;
            default:
                messageDiv.style.background = '#17a2b8';
        }
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});

// Global logout function
function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        if (window.authManager) {
            window.authManager.logout();
        }
    }
} 