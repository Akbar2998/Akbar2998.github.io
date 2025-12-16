/**
 * Admin Dashboard JavaScript
 */

// Check authentication using secure auth system
function checkAuth() {
    if (!secureAuth.validateSession()) {
        alert('Session expired. Please login again.');
        window.location.href = 'admin-login.html';
        return false;
    }

    // Display admin username
    const adminUser = sessionStorage.getItem('adminUser');
    const usernameEl = document.getElementById('adminUsername');
    if (usernameEl && adminUser) {
        usernameEl.textContent = adminUser;
    }

    return true;
}

// Initialize dashboard
function initDashboard() {
    if (!checkAuth()) return;

    loadPosts();
    updateStats();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // New post form
    const newPostForm = document.getElementById('newPostForm');
    if (newPostForm) {
        newPostForm.addEventListener('submit', handleNewPost);
    }

    // Character counter for excerpt
    const excerptInput = document.getElementById('postExcerpt');
    if (excerptInput) {
        excerptInput.addEventListener('input', updateCharCount);
    }

    // Password change form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }
}

// Switch tabs
function switchTab(tabName) {
    // Update nav
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabName) {
            item.classList.add('active');
        }
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    if (tabName === 'posts') {
        document.getElementById('postsTab').classList.add('active');
    } else if (tabName === 'new-post') {
        document.getElementById('newPostTab').classList.add('active');
    } else if (tabName === 'settings') {
        document.getElementById('settingsTab').classList.add('active');
    }
}

// Update stats
function updateStats() {
    const totalPosts = blogManager.getTotalPosts();
    const totalPostsEl = document.getElementById('totalPosts');
    if (totalPostsEl) {
        totalPostsEl.textContent = totalPosts;
    }
}

// Load and display posts in admin panel
function loadPosts() {
    const postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) return;

    const posts = blogManager.getAllPosts();

    if (posts.length === 0) {
        postsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-blog"></i>
                <p>No blog posts yet. Create your first post!</p>
            </div>
        `;
        return;
    }

    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
            <div class="post-card-header">
                <div>
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span class="post-category">${post.category}</span>
                        <span><i class="fas fa-calendar"></i> ${blogManager.formatDate(post.date)}</span>
                        <span><i class="fas fa-eye"></i> ${post.views || 0} views</span>
                    </div>
                </div>
            </div>
            <p class="post-excerpt">${post.excerpt}</p>
            ${post.tags && post.tags.length > 0 ? `
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="post-actions">
                <button class="btn-danger" onclick="deletePost('${post.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Handle new post submission
function handleNewPost(e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const category = document.getElementById('postCategory').value;
    const excerpt = document.getElementById('postExcerpt').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const tagsInput = document.getElementById('postTags').value.trim();

    // Validate
    if (!title || !category || !excerpt || !content) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Parse tags
    const tags = tagsInput
        ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

    // Create post
    const postData = {
        title,
        category,
        excerpt,
        content,
        tags
    };

    const newPost = blogManager.createPost(postData);

    if (newPost) {
        showToast('Post published successfully!');
        resetForm();
        updateStats();
        loadPosts();
        switchTab('posts');
    } else {
        showToast('Error publishing post', 'error');
    }
}

// Delete post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        const success = blogManager.deletePost(postId);
        if (success) {
            showToast('Post deleted successfully!');
            loadPosts();
            updateStats();
        } else {
            showToast('Error deleting post', 'error');
        }
    }
}

// Reset form
function resetForm() {
    const form = document.getElementById('newPostForm');
    if (form) {
        form.reset();
        updateCharCount();
    }
}

// Update character count
function updateCharCount() {
    const excerptInput = document.getElementById('postExcerpt');
    const charCount = document.querySelector('.char-count');
    if (excerptInput && charCount) {
        const count = excerptInput.value.length;
        charCount.textContent = `${count} / 200`;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (toast && toastMessage) {
        toastMessage.textContent = message;

        if (type === 'error') {
            toast.style.background = 'rgba(255, 0, 80, 0.95)';
            toast.style.color = '#ffffff';
        } else {
            toast.style.background = 'rgba(0, 255, 65, 0.95)';
            toast.style.color = '#000000';
        }

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}

// Handle password change
async function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate
    if (!currentPassword || !newUsername || !newPassword || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }

    try {
        // Change password using secure auth
        await secureAuth.changePassword(currentPassword, newUsername, newPassword);

        showToast('Credentials updated successfully! Please login with new credentials.');

        // Reset form
        resetPasswordForm();

        // Logout and redirect to login
        setTimeout(() => {
            logout();
        }, 2000);
    } catch (error) {
        console.error('Password change error:', error);
        showToast(error.message || 'Failed to update credentials', 'error');
    }
}

// Reset password form
function resetPasswordForm() {
    const form = document.getElementById('changePasswordForm');
    if (form) {
        form.reset();
    }
}

// Reset to default credentials
async function resetToDefaults() {
    try {
        const success = await secureAuth.resetToDefaults();
        if (success) {
            showToast('Credentials reset successfully!');
            setTimeout(() => {
                logout();
            }, 2000);
        }
    } catch (error) {
        showToast('Failed to reset credentials', 'error');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        secureAuth.destroySession();
        window.location.href = 'admin-login.html';
    }
}
