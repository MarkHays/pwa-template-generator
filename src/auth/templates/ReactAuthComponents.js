/**
 * React Authentication Components Template
 * Enterprise-grade authentication components for PWA Generator
 *
 * Features:
 * - Multi-provider OAuth (Google, Microsoft, GitHub, Auth0, Okta)
 * - Role-based access control
 * - Session management
 * - Protected routes
 * - Modern React patterns with hooks
 */

export const ReactAuthComponents = {
  // Authentication Context Provider
  'src/contexts/AuthContext.tsx': `import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; sessionId: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sessionId: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        sessionId: action.payload.sessionId,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        sessionId: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        sessionId: null,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const response = await fetch('/api/auth/verify', {
          headers: { Authorization: \`Bearer \${token}\` },
        });

        if (response.ok) {
          const userData = await response.json();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: userData.user,
              sessionId: userData.sessionId,
            },
          });
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    } catch (error) {
      console.error('Session check failed:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (provider: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Redirect to OAuth provider
      window.location.href = \`/auth/\${provider}\`;
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : 'Login failed',
      });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: \`Bearer \${localStorage.getItem('accessToken')}\`,
        },
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const hasRole = (role: string): boolean => {
    return state.user?.roles.includes(role) || false;
  };

  const hasPermission = (permission: string): boolean => {
    return state.user?.permissions.includes(permission) ||
           state.user?.permissions.includes('*') || false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
        hasRole,
        hasPermission,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};`,

  // Protected Route Component
  'src/components/auth/ProtectedRoute.tsx': `import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallback = <div className="access-denied">Access Denied</div>,
}) => {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>Please log in to access this content.</p>
        <LoginForm />
      </div>
    );
  }

  // Check roles
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return fallback;
    }
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission =>
      hasPermission(permission)
    );
    if (!hasRequiredPermission) {
      return fallback;
    }
  }

  return <>{children}</>;
};`,

  // Login Form Component
  'src/components/auth/LoginForm.tsx': `import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const oauthProviders = [
  { id: 'google', name: 'Google', icon: '🔵', color: '#4285f4' },
  { id: 'microsoft', name: 'Microsoft', icon: '🔷', color: '#00a1f1' },
  { id: 'github', name: 'GitHub', icon: '⚫', color: '#333' },
  { id: 'auth0', name: 'Auth0', icon: '🔶', color: '#eb5424' },
  { id: 'okta', name: 'Okta', icon: '🔹', color: '#007dc1' },
];

export const LoginForm: React.FC = () => {
  const { login, error, isLoading, clearError } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const handleProviderLogin = async (provider: string) => {
    setSelectedProvider(provider);
    clearError();
    await login(provider);
  };

  return (
    <div className="login-form">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Choose your preferred sign-in method</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button onClick={clearError} className="error-close">×</button>
          </div>
        )}

        <div className="oauth-providers">
          {oauthProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderLogin(provider.id)}
              disabled={isLoading}
              className={\`oauth-button \${selectedProvider === provider.id ? 'loading' : ''}\`}
              style={{ borderColor: provider.color }}
            >
              <span className="provider-icon">{provider.icon}</span>
              <span className="provider-name">
                {selectedProvider === provider.id && isLoading
                  ? 'Redirecting...'
                  : \`Continue with \${provider.name}\`}
              </span>
              {selectedProvider === provider.id && isLoading && (
                <div className="button-spinner"></div>
              )}
            </button>
          ))}
        </div>

        <div className="login-footer">
          <p className="terms-text">
            By signing in, you agree to our{' '}
            <a href="/terms" className="link">Terms of Service</a> and{' '}
            <a href="/privacy" className="link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};`,

  // User Profile Component
  'src/components/auth/UserProfile.tsx': `import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const UserProfile: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  return (
    <div className="user-profile">
      <button
        className="profile-trigger"
        onClick={() => setShowMenu(!showMenu)}
        aria-expanded={showMenu}
        aria-haspopup="menu"
      >
        <div className="profile-avatar">
          {user.picture ? (
            <img src={user.picture} alt={user.name} />
          ) : (
            <span className="avatar-initials">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <span className="profile-name">{user.name}</span>
        <span className={\`dropdown-arrow \${showMenu ? 'open' : ''}\`}>▼</span>
      </button>

      {showMenu && (
        <div className="profile-menu">
          <div className="profile-info">
            <div className="profile-details">
              <h4>{user.name}</h4>
              <p className="profile-email">{user.email}</p>
              <div className="profile-roles">
                {user.roles.map(role => (
                  <span key={role} className="role-badge">{role}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="menu-divider"></div>

          <div className="menu-actions">
            <a href="/profile" className="menu-item">
              <span className="menu-icon">👤</span>
              Profile Settings
            </a>

            {hasRole('admin') && (
              <a href="/admin" className="menu-item">
                <span className="menu-icon">⚙️</span>
                Admin Panel
              </a>
            )}

            <a href="/preferences" className="menu-item">
              <span className="menu-icon">🔧</span>
              Preferences
            </a>

            <div className="menu-divider"></div>

            <button onClick={handleLogout} className="menu-item logout">
              <span className="menu-icon">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {showMenu && (
        <div
          className="profile-overlay"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};`,

  // Role-based Component Wrapper
  'src/components/auth/RoleGuard.tsx': `import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RoleGuardProps {
  children: ReactNode;
  roles?: string[];
  permissions?: string[];
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL roles/permissions
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  roles = [],
  permissions = [],
  fallback = null,
  requireAll = false,
}) => {
  const { hasRole, hasPermission } = useAuth();

  // Check roles
  if (roles.length > 0) {
    const roleCheck = requireAll
      ? roles.every(role => hasRole(role))
      : roles.some(role => hasRole(role));

    if (!roleCheck) {
      return <>{fallback}</>;
    }
  }

  // Check permissions
  if (permissions.length > 0) {
    const permissionCheck = requireAll
      ? permissions.every(permission => hasPermission(permission))
      : permissions.some(permission => hasPermission(permission));

    if (!permissionCheck) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};`,

  // Authentication Status Indicator
  'src/components/auth/AuthStatus.tsx': `import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const AuthStatus: React.FC = () => {
  const { isAuthenticated, isLoading, user, error } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-status loading">
        <div className="status-indicator"></div>
        <span>Checking authentication...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-status error">
        <div className="status-indicator"></div>
        <span>Authentication error</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="auth-status authenticated">
        <div className="status-indicator"></div>
        <span>Signed in as {user.name}</span>
      </div>
    );
  }

  return (
    <div className="auth-status unauthenticated">
      <div className="status-indicator"></div>
      <span>Not signed in</span>
    </div>
  );
};`,

  // OAuth Callback Handler
  'src/components/auth/OAuthCallback.tsx': `import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const OAuthCallback: React.FC = () => {
  const { dispatch } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const provider = window.location.pathname.split('/')[2]; // Extract from /auth/google/callback

        if (error) {
          throw new Error(error);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange code for tokens
        const response = await fetch(\`/auth/\${provider}/callback\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await response.json();

        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Update auth state
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            sessionId: data.sessionId,
          },
        });

        // Redirect to intended page or dashboard
        const redirectUrl = localStorage.getItem('authRedirect') || '/dashboard';
        localStorage.removeItem('authRedirect');
        window.location.href = redirectUrl;

      } catch (error) {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: error instanceof Error ? error.message : 'Authentication failed',
        });

        // Redirect to login with error
        setTimeout(() => {
          window.location.href = '/login?error=auth_failed';
        }, 2000);
      }
    };

    handleCallback();
  }, [dispatch]);

  return (
    <div className="oauth-callback">
      <div className="callback-container">
        <div className="callback-spinner">
          <div className="spinner"></div>
        </div>
        <h2>Completing sign in...</h2>
        <p>Please wait while we process your authentication.</p>
      </div>
    </div>
  );
};`,

  // Authentication Hook with Auto-refresh
  'src/hooks/useAuthToken.ts': `import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAuthToken = () => {
  const { refreshToken, logout } = useAuth();

  // Setup automatic token refresh
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const refreshTime = expiryTime - Date.now() - 5 * 60 * 1000; // 5 minutes before expiry

      if (refreshTime > 0) {
        const timer = setTimeout(async () => {
          try {
            await refreshToken();
          } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
          }
        }, refreshTime);

        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Token parsing failed:', error);
      logout();
    }
  }, [refreshToken, logout]);

  // Return utility functions
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: \`Bearer \${token}\` } : {};
  }, []);

  const makeAuthenticatedRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      try {
        await refreshToken();
        // Retry with new token
        const newHeaders = {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
          ...options.headers,
        };
        return fetch(url, { ...options, headers: newHeaders });
      } catch (error) {
        logout();
        throw error;
      }
    }

    return response;
  }, [getAuthHeaders, refreshToken, logout]);

  return {
    getAuthHeaders,
    makeAuthenticatedRequest,
  };
};`,

  // CSS Styles for Authentication Components
  'src/styles/auth.css': `/* Authentication Styles */
.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-container {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
}

.login-header p {
  margin: 0 0 2rem 0;
  color: #718096;
  text-align: center;
}

.oauth-providers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.oauth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  min-height: 3rem;
}

.oauth-button:hover {
  background: #f7fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.oauth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.oauth-button.loading {
  color: #718096;
}

.provider-icon {
  font-size: 1.25rem;
}

.provider-name {
  flex: 1;
  text-align: center;
}

.button-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fed7d7;
  border: 1px solid #feb2b2;
  border-radius: 0.5rem;
  color: #c53030;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.error-close {
  margin-left: auto;
  background: none;
  border: none;
  color: #c53030;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  line-height: 1;
}

.terms-text {
  text-align: center;
  font-size: 0.75rem;
  color: #718096;
  margin: 2rem 0 0 0;
}

.terms-text .link {
  color: #4299e1;
  text-decoration: none;
}

.terms-text .link:hover {
  text-decoration: underline;
}

/* User Profile Styles */
.user-profile {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-trigger:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.profile-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  background: #4299e1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.profile-name {
  font-weight: 500;
  color: #2d3748;
}

.dropdown-arrow {
  color: #718096;
  font-size: 0.75rem;
  transition: transform 0.2s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.profile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 0.5rem;
}

.profile-info {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.profile-details h4 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.profile-email {
  margin: 0 0 1rem 0;
  color: #718096;
  font-size: 0.875rem;
}

.profile-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-badge {
  padding: 0.25rem 0.5rem;
  background: #edf2f7;
  color: #4a5568;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.menu-divider {
  height: 1px;
  background: #e2e8f0;
}

.menu-actions {
  padding: 0.5rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  color: #2d3748;
  text-decoration: none;
  font-size: 0.875rem;
  transition: background 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
}

.menu-item:hover {
  background: #f7fafc;
}

.menu-item.logout {
  color: #e53e3e;
}

.menu-item.logout:hover {
  background: #fed7d7;
}

.menu-icon {
  font-size: 1rem;
}

.profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Protected Route Styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.auth-required {
  text-align: center;
  padding: 3rem;
}

.auth-required h2 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.access-denied {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #e53e3e;
  font-size: 1.125rem;
  font-weight: 500;
}

/* Auth Status Styles */
.auth-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.status-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.auth-status.loading .status-indicator {
  background: #fbbf24;
}

.auth-status.authenticated .status-indicator {
  background: #10b981;
}

.auth-status.unauthenticated .status-indicator {
  background: #6b7280;
}

.auth-status.error .status-indicator {
  background: #ef4444;
}

/* OAuth Callback Styles */
.oauth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.callback-container {
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
}

.callback-spinner {
  margin-bottom: 2rem;
}

.callback-spinner .spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

.callback-container h2 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
}

.callback-container p {
  margin: 0;
  color: #718096;
  font-size: 1rem;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-form {
    padding: 1rem;
  }

  .login-container {
    padding: 2rem;
  }

  .profile-menu {
    width: 260px;
  }

  .oauth-button {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .login-container,
  .profile-menu {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .login-header h2,
  .profile-details h4,
  .menu-item {
    color: #e2e8f0;
  }

  .login-header p,
  .profile-email {
    color: #a0aec0;
  }

  .oauth-button {
    background: #4a5568;
    border-color: #718096;
    color: #e2e8f0;
  }

  .oauth-button:hover {
    background: #718096;
  }

  .profile-trigger {
    background: #4a5568;
    border-color: #718096;
    color: #e2e8f0;
  }

  .profile-trigger:hover {
    background: #718096;
  }

  .menu-item:hover {
    background: #4a5568;
  }

  .role-badge {
    background: #4a5568;
    color: #e2e8f0;
  }
}

/* Accessibility Improvements */
.oauth-button:focus,
.profile-trigger:focus,
.menu-item:focus {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

.oauth-button:focus-visible,
.profile-trigger:focus-visible,
.menu-item:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .oauth-button,
  .profile-trigger {
    border-width: 2px;
  }

  .status-indicator {
    border: 1px solid currentColor;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .oauth-button,
  .profile-trigger,
  .menu-item,
  .dropdown-arrow {
    transition: none;
  }

  .loading-spinner,
  .button-spinner,
  .callback-spinner .spinner {
    animation: none;
  }
}`,
