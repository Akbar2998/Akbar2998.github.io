/**
 * Blog Management System
 * Handles blog posts using localStorage
 */

class BlogManager {
    constructor() {
        this.storageKey = 'portfolio_blog_posts';
        this.posts = this.loadPosts();
    }

    // Load posts from localStorage
    loadPosts() {
        try {
            const posts = localStorage.getItem(this.storageKey);
            return posts ? JSON.parse(posts) : [];
        } catch (e) {
            console.error('Error loading posts:', e);
            return [];
        }
    }

    // Save posts to localStorage
    savePosts() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.posts));
            return true;
        } catch (e) {
            console.error('Error saving posts:', e);
            return false;
        }
    }

    // Create new post
    createPost(postData) {
        const post = {
            id: Date.now().toString(),
            title: postData.title,
            category: postData.category,
            excerpt: postData.excerpt,
            content: postData.content,
            tags: postData.tags || [],
            date: new Date().toISOString(),
            views: 0
        };

        this.posts.unshift(post); // Add to beginning
        this.savePosts();
        return post;
    }

    // Get all posts
    getAllPosts() {
        return this.posts;
    }

    // Get post by ID
    getPostById(id) {
        return this.posts.find(post => post.id === id);
    }

    // Update post
    updatePost(id, updates) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts[index] = { ...this.posts[index], ...updates };
            this.savePosts();
            return this.posts[index];
        }
        return null;
    }

    // Delete post
    deletePost(id) {
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
            this.posts.splice(index, 1);
            this.savePosts();
            return true;
        }
        return false;
    }

    // Get recent posts
    getRecentPosts(limit = 6) {
        return this.posts.slice(0, limit);
    }

    // Get posts by category
    getPostsByCategory(category) {
        return this.posts.filter(post => post.category === category);
    }

    // Search posts
    searchPosts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.posts.filter(post =>
            post.title.toLowerCase().includes(lowercaseQuery) ||
            post.excerpt.toLowerCase().includes(lowercaseQuery) ||
            post.content.toLowerCase().includes(lowercaseQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
    }

    // Increment post views
    incrementViews(id) {
        const post = this.getPostById(id);
        if (post) {
            post.views = (post.views || 0) + 1;
            this.updatePost(id, { views: post.views });
        }
    }

    // Get total posts count
    getTotalPosts() {
        return this.posts.length;
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Get reading time estimate
    getReadingTime(content) {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    }
}

// Initialize blog manager
const blogManager = new BlogManager();

// Display blog posts on main page
function displayBlogPosts() {
    const blogPostsContainer = document.getElementById('blog-posts');
    if (!blogPostsContainer) return;

    const posts = blogManager.getRecentPosts(6);

    if (posts.length === 0) {
        blogPostsContainer.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-blog"></i>
                <p>No blog posts yet. Check back soon!</p>
            </div>
        `;
        return;
    }

    blogPostsContainer.innerHTML = posts.map(post => `
        <article class="blog-card" data-aos="zoom-in">
            <div class="blog-card-header">
                <span class="blog-category">${post.category}</span>
                <span class="blog-date">
                    <i class="fas fa-calendar"></i>
                    ${blogManager.formatDate(post.date)}
                </span>
            </div>
            <h3 class="blog-title">${post.title}</h3>
            <p class="blog-excerpt">${post.excerpt}</p>
            ${post.tags && post.tags.length > 0 ? `
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="blog-footer">
                <span class="reading-time">
                    <i class="fas fa-clock"></i>
                    ${blogManager.getReadingTime(post.content)}
                </span>
                <button class="btn-read-more" onclick="openPost('${post.id}')">
                    Read More <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </article>
    `).join('');
}

// Open post in modal
function openPost(postId) {
    const post = blogManager.getPostById(postId);
    if (!post) return;

    blogManager.incrementViews(postId);

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.innerHTML = `
        <div class="blog-modal-content">
            <button class="modal-close" onclick="closePostModal()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <span class="blog-category">${post.category}</span>
                <h2>${post.title}</h2>
                <div class="modal-meta">
                    <span><i class="fas fa-calendar"></i> ${blogManager.formatDate(post.date)}</span>
                    <span><i class="fas fa-clock"></i> ${blogManager.getReadingTime(post.content)}</span>
                    <span><i class="fas fa-eye"></i> ${post.views} views</span>
                </div>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="modal-body">
                ${post.content.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate modal
    setTimeout(() => modal.classList.add('show'), 10);
}

// Close post modal
function closePostModal() {
    const modal = document.querySelector('.blog-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Load blog posts when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayBlogPosts);
} else {
    displayBlogPosts();
}

// Export for use in admin panel
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogManager;
}
