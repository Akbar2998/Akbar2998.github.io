/**
 * Secure Authentication System
 * Uses PBKDF2 with random salt for password hashing
 * Allows password changes and first-time setup
 */

class SecureAuth {
    constructor() {
        this.STORAGE_KEY = 'portfolio_admin_credentials';
        this.SALT_KEY = 'portfolio_auth_salt';
        this.ITERATIONS = 100000; // PBKDF2 iterations for security
        this.init();
    }

    // Initialize auth system
    async init() {
        // Check if credentials exist, if not, set up defaults
        if (!this.hasCredentials()) {
            await this.setupDefaultCredentials();
        }
    }

    // Check if credentials are stored
    hasCredentials() {
        return localStorage.getItem(this.STORAGE_KEY) !== null &&
               localStorage.getItem(this.SALT_KEY) !== null;
    }

    // Set up default credentials on first use
    async setupDefaultCredentials() {
        const defaultUsername = 'digitalplayer98';
        const defaultPassword = '17101998ma';

        console.log('Setting up default credentials...');
        await this.createCredentials(defaultUsername, defaultPassword);
    }

    // Generate cryptographically secure random salt
    generateSalt() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Hash password using PBKDF2
    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);
        const saltData = encoder.encode(salt);

        // Import password as key
        const key = await crypto.subtle.importKey(
            'raw',
            passwordData,
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        // Derive bits using PBKDF2
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: saltData,
                iterations: this.ITERATIONS,
                hash: 'SHA-256'
            },
            key,
            256
        );

        // Convert to hex string
        const hashArray = Array.from(new Uint8Array(derivedBits));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Create/Update credentials
    async createCredentials(username, password) {
        // Generate new salt
        const salt = this.generateSalt();

        // Hash username and password with salt
        const usernameHash = await this.hashPassword(username, salt);
        const passwordHash = await this.hashPassword(password, salt);

        // Store credentials
        const credentials = {
            username: usernameHash,
            password: passwordHash,
            created: Date.now()
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(credentials));
        localStorage.setItem(this.SALT_KEY, salt);

        return true;
    }

    // Verify credentials
    async verifyCredentials(username, password) {
        try {
            const storedCreds = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            const salt = localStorage.getItem(this.SALT_KEY);

            if (!storedCreds || !salt) {
                return false;
            }

            // Hash input credentials with stored salt
            const usernameHash = await this.hashPassword(username, salt);
            const passwordHash = await this.hashPassword(password, salt);

            // Compare hashes
            return usernameHash === storedCreds.username &&
                   passwordHash === storedCreds.password;
        } catch (error) {
            console.error('Verification error:', error);
            return false;
        }
    }

    // Change password (requires current password)
    async changePassword(currentPassword, newUsername, newPassword) {
        try {
            const storedCreds = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
            const salt = localStorage.getItem(this.SALT_KEY);

            if (!storedCreds || !salt) {
                throw new Error('No credentials found');
            }

            // Verify current password first
            // For username, we'll use a default since we're changing it
            const currentPasswordHash = await this.hashPassword(currentPassword, salt);

            if (currentPasswordHash !== storedCreds.password) {
                throw new Error('Current password is incorrect');
            }

            // Create new credentials
            await this.createCredentials(newUsername, newPassword);
            return true;
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    }

    // Generate session token
    generateSessionToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Create session
    createSession(username) {
        const token = this.generateSessionToken();
        sessionStorage.setItem('adminAuth', token);
        sessionStorage.setItem('adminUser', username);
        sessionStorage.setItem('authTimestamp', Date.now().toString());
        return token;
    }

    // Validate session
    validateSession() {
        const authToken = sessionStorage.getItem('adminAuth');
        const adminUser = sessionStorage.getItem('adminUser');
        const authTimestamp = sessionStorage.getItem('authTimestamp');

        if (!authToken || !adminUser || !authTimestamp) {
            return false;
        }

        // Check session timeout (2 hours)
        const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
        const currentTime = Date.now();
        const sessionAge = currentTime - parseInt(authTimestamp);

        if (sessionAge > SESSION_TIMEOUT) {
            this.destroySession();
            return false;
        }

        // Update timestamp
        sessionStorage.setItem('authTimestamp', currentTime.toString());
        return true;
    }

    // Destroy session
    destroySession() {
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('authTimestamp');
    }

    // Reset to default credentials (emergency use)
    async resetToDefaults() {
        const confirmation = prompt('Type "RESET" to confirm resetting to default credentials:');
        if (confirmation === 'RESET') {
            await this.setupDefaultCredentials();
            alert('Credentials reset to defaults!\nUsername: digitalplayer98\nPassword: 17101998ma');
            return true;
        }
        return false;
    }
}

// Create global instance
const secureAuth = new SecureAuth();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureAuth;
}
