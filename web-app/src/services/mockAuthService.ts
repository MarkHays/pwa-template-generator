// Mock Authentication Service for Admin Dashboard
// This service simulates backend authentication without requiring a real API

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: AdminUser;
  message?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  permissions: string[];
  lastLogin?: Date;
}

export interface OAuthProvider {
  name: string;
  clientId: string;
  enabled: boolean;
}

class MockAuthService {
  private readonly DEMO_CREDENTIALS = {
    email: "admin@demo.com",
    password: "admin123",
  };

  private readonly DEMO_ADMIN_USER: AdminUser = {
    id: "admin-1",
    name: "Admin User",
    email: "admin@demo.com",
    role: "Super Admin",
    avatar: "/api/placeholder/40/40",
    permissions: [
      "users:read",
      "users:write",
      "database:read",
      "database:write",
      "monitoring:read",
      "api:read",
      "tenants:read",
      "tenants:write",
      "auth:read",
      "auth:write",
    ],
    lastLogin: new Date(),
  };

  private readonly OAUTH_PROVIDERS: OAuthProvider[] = [
    {
      name: "google",
      clientId: "demo-google-client-id",
      enabled: true,
    },
    {
      name: "github",
      clientId: "demo-github-client-id",
      enabled: true,
    },
    {
      name: "microsoft",
      clientId: "demo-microsoft-client-id",
      enabled: true,
    },
  ];

  // Simulate network delay
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate mock JWT token
  private generateMockToken(userId: string): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      sub: userId,
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      role: "admin",
    }));
    const signature = btoa(`mock-signature-${userId}-${Date.now()}`);

    return `${header}.${payload}.${signature}`;
  }

  // Generate mock refresh token
  private generateRefreshToken(userId: string): string {
    return btoa(`refresh-${userId}-${Date.now()}-${Math.random()}`);
  }

  // Validate credentials
  private validateCredentials(email: string, password: string): boolean {
    return email === this.DEMO_CREDENTIALS.email &&
           password === this.DEMO_CREDENTIALS.password;
  }

  // Main login method
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(800); // Simulate network delay

    const { email, password, rememberMe } = credentials;

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    // Validate credentials
    if (!this.validateCredentials(email, password)) {
      return {
        success: false,
        message: "Invalid credentials",
      };
    }

    // Generate tokens
    const token = this.generateMockToken(this.DEMO_ADMIN_USER.id);
    const refreshToken = rememberMe ? this.generateRefreshToken(this.DEMO_ADMIN_USER.id) : undefined;

    // Update last login
    const user = {
      ...this.DEMO_ADMIN_USER,
      lastLogin: new Date(),
    };

    return {
      success: true,
      token,
      refreshToken,
      user,
      message: "Login successful",
    };
  }

  // OAuth login simulation
  async oauthLogin(provider: string): Promise<AuthResponse> {
    await this.delay(1200); // Simulate OAuth flow delay

    const oauthProvider = this.OAUTH_PROVIDERS.find(p => p.name === provider);

    if (!oauthProvider || !oauthProvider.enabled) {
      return {
        success: false,
        message: `OAuth provider ${provider} is not available`,
      };
    }

    // Simulate successful OAuth flow
    const token = this.generateMockToken(this.DEMO_ADMIN_USER.id);
    const refreshToken = this.generateRefreshToken(this.DEMO_ADMIN_USER.id);

    const user = {
      ...this.DEMO_ADMIN_USER,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Admin`,
      lastLogin: new Date(),
    };

    return {
      success: true,
      token,
      refreshToken,
      user,
      message: `Successfully logged in with ${provider}`,
    };
  }

  // Verify token
  async verifyToken(token: string): Promise<AuthResponse> {
    await this.delay(300);

    if (!token || !token.includes('.')) {
      return {
        success: false,
        message: "Invalid token format",
      };
    }

    try {
      // Mock token verification
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;

      if (payload.exp && payload.exp < now) {
        return {
          success: false,
          message: "Token has expired",
        };
      }

      return {
        success: true,
        user: this.DEMO_ADMIN_USER,
        message: "Token is valid",
      };
    } catch (error) {
      return {
        success: false,
        message: "Invalid token",
      };
    }
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    await this.delay(500);

    if (!refreshToken) {
      return {
        success: false,
        message: "Refresh token is required",
      };
    }

    // Generate new tokens
    const newToken = this.generateMockToken(this.DEMO_ADMIN_USER.id);
    const newRefreshToken = this.generateRefreshToken(this.DEMO_ADMIN_USER.id);

    return {
      success: true,
      token: newToken,
      refreshToken: newRefreshToken,
      user: this.DEMO_ADMIN_USER,
      message: "Token refreshed successfully",
    };
  }

  // Logout
  async logout(): Promise<AuthResponse> {
    await this.delay(300);

    // Clear any stored tokens
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");

    return {
      success: true,
      message: "Logged out successfully",
    };
  }

  // Get current user
  async getCurrentUser(): Promise<AuthResponse> {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      return {
        success: false,
        message: "No authentication token found",
      };
    }

    return this.verifyToken(token);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("adminToken");
    return !!token;
  }

  // Get OAuth providers
  getOAuthProviders(): OAuthProvider[] {
    return this.OAUTH_PROVIDERS;
  }

  // Simulate password reset
  async resetPassword(email: string): Promise<AuthResponse> {
    await this.delay(1000);

    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    // In a real app, this would send an email
    return {
      success: true,
      message: "Password reset instructions have been sent to your email",
    };
  }

  // Simulate 2FA verification
  async verifyTwoFactor(code: string): Promise<AuthResponse> {
    await this.delay(800);

    // Mock 2FA code verification
    if (code === "123456") {
      return {
        success: true,
        message: "Two-factor authentication verified",
      };
    }

    return {
      success: false,
      message: "Invalid verification code",
    };
  }

  // Get user permissions
  getUserPermissions(): string[] {
    return this.DEMO_ADMIN_USER.permissions;
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    return this.DEMO_ADMIN_USER.permissions.includes(permission);
  }
}

// Export singleton instance
export const mockAuthService = new MockAuthService();
export default mockAuthService;
