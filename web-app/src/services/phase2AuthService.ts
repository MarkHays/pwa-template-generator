export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  avatar?: string;
  lastLogin?: string;
  isActive: boolean;
  tenantId?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: AdminUser;
  expiresIn?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

class Phase2AuthService {
  private baseUrl: string;
  private isPhase2Available: boolean = false;

  constructor() {
    // Try to detect if Phase 2 server is running
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    this.checkPhase2Availability();
  }

  private async checkPhase2Availability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        timeout: 2000, // 2 second timeout
      } as any);

      if (response.ok) {
        const data = await response.json();
        this.isPhase2Available = data.status === 'OK' && data.phase === 2;
        console.log('✅ Phase 2 backend detected:', this.isPhase2Available);
        return this.isPhase2Available;
      }
    } catch (error) {
      console.log('⚠️ Phase 2 backend not available, using fallback auth');
      this.isPhase2Available = false;
    }
    return false;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Check if Phase 2 backend is available
      if (!this.isPhase2Available) {
        await this.checkPhase2Availability();
      }

      if (!this.isPhase2Available) {
        return this.fallbackLogin(credentials);
      }

      const response = await fetch(`${this.baseUrl}/api/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          rememberMe: credentials.rememberMe,
          isAdmin: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          user: this.transformUser(data.user),
          expiresIn: data.expiresIn,
          message: 'Login successful',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Phase 2 login error:', error);
      return {
        success: false,
        message: 'Unable to connect to authentication server',
      };
    }
  }

  async oauthLogin(provider: string): Promise<AuthResponse> {
    try {
      if (!this.isPhase2Available) {
        await this.checkPhase2Availability();
      }

      if (!this.isPhase2Available) {
        return this.fallbackOAuthLogin(provider);
      }

      // For OAuth, we redirect to the Phase 2 OAuth endpoint
      const redirectUrl = `${this.baseUrl}/api/auth/oauth/${provider}?admin=true&redirect=${encodeURIComponent(window.location.origin + '/admin')}`;

      // Store OAuth attempt for callback handling
      localStorage.setItem('oauthProvider', provider);
      localStorage.setItem('oauthTimestamp', Date.now().toString());

      window.location.href = redirectUrl;

      return {
        success: true,
        message: 'Redirecting to OAuth provider...',
      };
    } catch (error) {
      console.error('OAuth login error:', error);
      return {
        success: false,
        message: 'OAuth login failed',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('adminToken');

      if (token && this.isPhase2Available) {
        await fetch(`${this.baseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('oauthProvider');
      localStorage.removeItem('oauthTimestamp');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      if (!this.isPhase2Available) {
        await this.checkPhase2Availability();
      }

      if (!this.isPhase2Available) {
        return this.fallbackRefreshToken(refreshToken);
      }

      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          isAdmin: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          user: this.transformUser(data.user),
          expiresIn: data.expiresIn,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Token refresh failed',
        };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: 'Unable to refresh token',
      };
    }
  }

  async verifyToken(token: string): Promise<AuthResponse> {
    try {
      if (!this.isPhase2Available) {
        await this.checkPhase2Availability();
      }

      if (!this.isPhase2Available) {
        return this.fallbackVerifyToken(token);
      }

      const response = await fetch(`${this.baseUrl}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          user: this.transformUser(data.user),
        };
      } else {
        return {
          success: false,
          message: data.message || 'Token verification failed',
        };
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Unable to verify token',
      };
    }
  }

  // Handle OAuth callback
  async handleOAuthCallback(code: string, state?: string): Promise<AuthResponse> {
    try {
      const provider = localStorage.getItem('oauthProvider');
      if (!provider) {
        throw new Error('No OAuth provider found in storage');
      }

      const response = await fetch(`${this.baseUrl}/api/auth/oauth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          code,
          state,
          isAdmin: true,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clean up OAuth storage
        localStorage.removeItem('oauthProvider');
        localStorage.removeItem('oauthTimestamp');

        return {
          success: true,
          token: data.token,
          refreshToken: data.refreshToken,
          user: this.transformUser(data.user),
          expiresIn: data.expiresIn,
        };
      } else {
        return {
          success: false,
          message: data.message || 'OAuth callback failed',
        };
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      return {
        success: false,
        message: 'OAuth authentication failed',
      };
    }
  }

  private transformUser(userData: any): AdminUser {
    return {
      id: userData.id || userData._id,
      email: userData.email,
      firstName: userData.firstName || userData.first_name || 'Admin',
      lastName: userData.lastName || userData.last_name || 'User',
      role: userData.role || 'admin',
      permissions: userData.permissions || ['admin:read', 'admin:write'],
      avatar: userData.avatar || userData.picture,
      lastLogin: userData.lastLogin || userData.last_login,
      isActive: userData.isActive !== false,
      tenantId: userData.tenantId || userData.tenant_id,
    };
  }

  // Fallback methods for when Phase 2 backend is not available
  private async fallbackLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo admin credentials
    if (credentials.email === 'admin@pwa-generator.com' && credentials.password === 'admin123') {
      const user: AdminUser = {
        id: 'demo-admin-1',
        email: 'admin@pwa-generator.com',
        firstName: 'Demo',
        lastName: 'Admin',
        role: 'super_admin',
        permissions: ['admin:read', 'admin:write', 'admin:delete'],
        avatar: 'https://via.placeholder.com/150',
        lastLogin: new Date().toISOString(),
        isActive: true,
      };

      return {
        success: true,
        token: 'demo-jwt-token-' + Date.now(),
        refreshToken: 'demo-refresh-token-' + Date.now(),
        user,
        expiresIn: 3600,
        message: 'Demo login successful (Phase 2 backend not detected)',
      };
    }

    return {
      success: false,
      message: 'Invalid credentials. Try admin@pwa-generator.com / admin123',
    };
  }

  private async fallbackOAuthLogin(provider: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user: AdminUser = {
      id: `demo-${provider}-1`,
      email: `admin@${provider}.com`,
      firstName: 'Demo',
      lastName: `${provider} User`,
      role: 'admin',
      permissions: ['admin:read', 'admin:write'],
      avatar: 'https://via.placeholder.com/150',
      lastLogin: new Date().toISOString(),
      isActive: true,
    };

    return {
      success: true,
      token: `demo-${provider}-token-` + Date.now(),
      refreshToken: `demo-${provider}-refresh-` + Date.now(),
      user,
      expiresIn: 3600,
      message: `Demo ${provider} login successful (Phase 2 backend not detected)`,
    };
  }

  private async fallbackRefreshToken(refreshToken: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (refreshToken.startsWith('demo-')) {
      const user: AdminUser = {
        id: 'demo-admin-1',
        email: 'admin@pwa-generator.com',
        firstName: 'Demo',
        lastName: 'Admin',
        role: 'admin',
        permissions: ['admin:read', 'admin:write'],
        avatar: 'https://via.placeholder.com/150',
        lastLogin: new Date().toISOString(),
        isActive: true,
      };

      return {
        success: true,
        token: 'demo-refreshed-token-' + Date.now(),
        refreshToken: 'demo-new-refresh-' + Date.now(),
        user,
        expiresIn: 3600,
      };
    }

    return {
      success: false,
      message: 'Invalid refresh token',
    };
  }

  private async fallbackVerifyToken(token: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (token.startsWith('demo-')) {
      const user: AdminUser = {
        id: 'demo-admin-1',
        email: 'admin@pwa-generator.com',
        firstName: 'Demo',
        lastName: 'Admin',
        role: 'admin',
        permissions: ['admin:read', 'admin:write'],
        avatar: 'https://via.placeholder.com/150',
        lastLogin: new Date().toISOString(),
        isActive: true,
      };

      return {
        success: true,
        user,
      };
    }

    return {
      success: false,
      message: 'Invalid token',
    };
  }

  // Utility method to check if Phase 2 is available
  isPhase2BackendAvailable(): boolean {
    return this.isPhase2Available;
  }

  // Get backend status for UI display
  getBackendStatus(): { available: boolean; url: string; message: string } {
    return {
      available: this.isPhase2Available,
      url: this.baseUrl,
      message: this.isPhase2Available
        ? 'Connected to Phase 2 Enterprise Backend'
        : 'Using demo mode - Start Phase 2 server for full functionality',
    };
  }
}

export const phase2AuthService = new Phase2AuthService();
