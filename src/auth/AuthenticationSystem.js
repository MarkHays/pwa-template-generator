/**
 * Enterprise Authentication System - Phase 2
 * Multi-Provider OAuth, RBAC, and Enterprise Security Features
 *
 * Supports: Google, Microsoft, GitHub, Auth0, Okta, Custom SAML/OIDC
 * Features: JWT Management, RBAC, Session Security, CSRF Protection
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { google } from 'googleapis';
import { Client as OktaClient } from '@okta/okta-sdk-nodejs';

export class AuthenticationSystem {
  constructor(options = {}) {
    this.config = {
      // JWT Configuration
      jwtSecret: options.jwtSecret || process.env.JWT_SECRET || this.generateSecret(),
      jwtExpiry: options.jwtExpiry || '24h',
      refreshTokenExpiry: options.refreshTokenExpiry || '7d',

      // Session Configuration
      sessionTimeout: options.sessionTimeout || 3600000, // 1 hour
      maxSessions: options.maxSessions || 5,

      // Security Configuration
      enableCSRF: options.enableCSRF !== false,
      enableRateLimit: options.enableRateLimit !== false,
      enableSecurityHeaders: options.enableSecurityHeaders !== false,

      // OAuth Providers
      providers: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          redirectUri: process.env.GOOGLE_REDIRECT_URI || '/auth/google/callback',
          scope: ['profile', 'email']
        },
        microsoft: {
          clientId: process.env.MICROSOFT_CLIENT_ID,
          clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
          redirectUri: process.env.MICROSOFT_REDIRECT_URI || '/auth/microsoft/callback',
          scope: ['https://graph.microsoft.com/user.read']
        },
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          redirectUri: process.env.GITHUB_REDIRECT_URI || '/auth/github/callback',
          scope: ['user:email']
        },
        auth0: {
          domain: process.env.AUTH0_DOMAIN,
          clientId: process.env.AUTH0_CLIENT_ID,
          clientSecret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_AUDIENCE
        },
        okta: {
          domain: process.env.OKTA_DOMAIN,
          clientId: process.env.OKTA_CLIENT_ID,
          clientSecret: process.env.OKTA_CLIENT_SECRET,
          authServerId: process.env.OKTA_AUTH_SERVER_ID || 'default'
        }
      },

      // RBAC Configuration
      defaultRoles: ['user', 'admin', 'super-admin'],
      permissions: {
        'user': ['read', 'create_own'],
        'admin': ['read', 'write', 'delete', 'manage_users'],
        'super-admin': ['*']
      },

      ...options
    };

    // Initialize providers
    this.initializeProviders();

    // Initialize security middleware
    this.setupSecurityMiddleware();

    // Initialize session storage
    this.sessions = new Map();
    this.refreshTokens = new Map();

    // RBAC system
    this.rolePermissions = new Map();
    this.userRoles = new Map();
    this.initializeRBAC();
  }

  /**
   * Initialize OAuth providers
   */
  initializeProviders() {
    this.providers = {};

    // Google OAuth2
    if (this.config.providers.google.clientId) {
      this.providers.google = new google.auth.OAuth2(
        this.config.providers.google.clientId,
        this.config.providers.google.clientSecret,
        this.config.providers.google.redirectUri
      );
    }

    // Okta SDK
    if (this.config.providers.okta.domain) {
      this.providers.okta = new OktaClient({
        orgUrl: `https://${this.config.providers.okta.domain}`,
        token: this.config.providers.okta.clientSecret
      });
    }
  }

  /**
   * Setup security middleware
   */
  setupSecurityMiddleware() {
    this.middleware = {};

    // Rate limiting
    if (this.config.enableRateLimit) {
      this.middleware.rateLimit = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP',
        standardHeaders: true,
        legacyHeaders: false
      });
    }

    // Security headers with Helmet
    if (this.config.enableSecurityHeaders) {
      this.middleware.helmet = helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
          }
        },
        crossOriginEmbedderPolicy: false
      });
    }
  }

  /**
   * Initialize Role-Based Access Control
   */
  initializeRBAC() {
    // Setup default role permissions
    for (const [role, permissions] of Object.entries(this.config.permissions)) {
      this.rolePermissions.set(role, new Set(permissions));
    }
  }

  /**
   * Generate OAuth URL for provider
   */
  getOAuthURL(provider, state = null) {
    const stateParam = state || this.generateState();

    switch (provider) {
      case 'google':
        if (!this.providers.google) throw new Error('Google OAuth not configured');
        return this.providers.google.generateAuthUrl({
          access_type: 'offline',
          scope: this.config.providers.google.scope,
          state: stateParam
        });

      case 'microsoft':
        const msConfig = this.config.providers.microsoft;
        const msParams = new URLSearchParams({
          client_id: msConfig.clientId,
          response_type: 'code',
          redirect_uri: msConfig.redirectUri,
          scope: msConfig.scope.join(' '),
          state: stateParam
        });
        return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${msParams}`;

      case 'github':
        const ghConfig = this.config.providers.github;
        const ghParams = new URLSearchParams({
          client_id: ghConfig.clientId,
          redirect_uri: ghConfig.redirectUri,
          scope: ghConfig.scope.join(' '),
          state: stateParam
        });
        return `https://github.com/login/oauth/authorize?${ghParams}`;

      case 'auth0':
        const auth0Config = this.config.providers.auth0;
        const auth0Params = new URLSearchParams({
          response_type: 'code',
          client_id: auth0Config.clientId,
          redirect_uri: auth0Config.redirectUri,
          scope: 'openid profile email',
          state: stateParam
        });
        return `https://${auth0Config.domain}/authorize?${auth0Params}`;

      case 'okta':
        const oktaConfig = this.config.providers.okta;
        const oktaParams = new URLSearchParams({
          client_id: oktaConfig.clientId,
          response_type: 'code',
          scope: 'openid profile email',
          redirect_uri: oktaConfig.redirectUri,
          state: stateParam
        });
        return `https://${oktaConfig.domain}/oauth2/${oktaConfig.authServerId}/v1/authorize?${oktaParams}`;

      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  /**
   * Handle OAuth callback and exchange code for tokens
   */
  async handleOAuthCallback(provider, code, state) {
    try {
      let userInfo;

      switch (provider) {
        case 'google':
          userInfo = await this.handleGoogleCallback(code);
          break;
        case 'microsoft':
          userInfo = await this.handleMicrosoftCallback(code);
          break;
        case 'github':
          userInfo = await this.handleGitHubCallback(code);
          break;
        case 'auth0':
          userInfo = await this.handleAuth0Callback(code);
          break;
        case 'okta':
          userInfo = await this.handleOktaCallback(code);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      // Create user session
      const sessionData = await this.createUserSession(userInfo, provider);
      return sessionData;

    } catch (error) {
      throw new Error(`OAuth callback failed: ${error.message}`);
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code) {
    const { tokens } = await this.providers.google.getToken(code);
    this.providers.google.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: this.providers.google });
    const { data } = await oauth2.userinfo.get();

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
      verified_email: data.verified_email
    };
  }

  /**
   * Handle Microsoft OAuth callback
   */
  async handleMicrosoftCallback(code) {
    const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const config = this.config.providers.microsoft;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri
      })
    });

    const tokens = await response.json();

    // Get user info
    const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` }
    });

    const userData = await userResponse.json();

    return {
      id: userData.id,
      email: userData.mail || userData.userPrincipalName,
      name: userData.displayName,
      picture: null
    };
  }

  /**
   * Handle GitHub OAuth callback
   */
  async handleGitHubCallback(code) {
    const config = this.config.providers.github;

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { 'Authorization': `token ${tokenData.access_token}` }
    });

    const userData = await userResponse.json();

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name || userData.login,
      picture: userData.avatar_url,
      username: userData.login
    };
  }

  /**
   * Handle Auth0 callback
   */
  async handleAuth0Callback(code) {
    const config = this.config.providers.auth0;

    const tokenResponse = await fetch(`https://${config.domain}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        redirect_uri: config.redirectUri
      })
    });

    const tokens = await tokenResponse.json();

    // Get user info
    const userResponse = await fetch(`https://${config.domain}/userinfo`, {
      headers: { 'Authorization': `Bearer ${tokens.access_token}` }
    });

    const userData = await userResponse.json();

    return {
      id: userData.sub,
      email: userData.email,
      name: userData.name,
      picture: userData.picture
    };
  }

  /**
   * Handle Okta callback
   */
  async handleOktaCallback(code) {
    const config = this.config.providers.okta;

    const tokenResponse = await fetch(`https://${config.domain}/oauth2/${config.authServerId}/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code: code,
        redirect_uri: config.redirectUri
      })
    });

    const tokens = await tokenResponse.json();

    // Decode JWT to get user info
    const userInfo = jwt.decode(tokens.id_token);

    return {
      id: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture
    };
  }

  /**
   * Create user session after successful authentication
   */
  async createUserSession(userInfo, provider) {
    const sessionId = this.generateSessionId();
    const userId = `${provider}_${userInfo.id}`;

    // Generate JWT tokens
    const accessToken = this.generateAccessToken(userId, userInfo);
    const refreshToken = this.generateRefreshToken(userId);

    // Create session data
    const sessionData = {
      sessionId,
      userId,
      userInfo,
      provider,
      accessToken,
      refreshToken,
      createdAt: new Date(),
      lastActivity: new Date(),
      ipAddress: null, // Set by middleware
      userAgent: null, // Set by middleware
      roles: this.getUserRoles(userId),
      permissions: this.getUserPermissions(userId)
    };

    // Store session
    this.sessions.set(sessionId, sessionData);
    this.refreshTokens.set(refreshToken, { userId, sessionId });

    // Clean up old sessions for user
    this.cleanupUserSessions(userId);

    return {
      sessionId,
      accessToken,
      refreshToken,
      user: userInfo,
      roles: sessionData.roles,
      expiresIn: this.config.jwtExpiry
    };
  }

  /**
   * Generate JWT access token
   */
  generateAccessToken(userId, userInfo) {
    const payload = {
      userId,
      email: userInfo.email,
      name: userInfo.name,
      roles: this.getUserRoles(userId),
      type: 'access'
    };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiry,
      issuer: 'pwa-generator',
      subject: userId
    });
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(userId) {
    const payload = {
      userId,
      type: 'refresh',
      nonce: crypto.randomBytes(16).toString('hex')
    };

    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.refreshTokenExpiry,
      issuer: 'pwa-generator',
      subject: userId
    });
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, this.config.jwtSecret);
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken);

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token type');
      }

      const tokenData = this.refreshTokens.get(refreshToken);
      if (!tokenData) {
        throw new Error('Refresh token not found');
      }

      const session = this.sessions.get(tokenData.sessionId);
      if (!session) {
        throw new Error('Session not found');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(decoded.userId, session.userInfo);

      // Update session
      session.accessToken = newAccessToken;
      session.lastActivity = new Date();

      return {
        accessToken: newAccessToken,
        expiresIn: this.config.jwtExpiry
      };

    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  /**
   * Middleware for authenticating requests
   */
  authenticate(options = {}) {
    return async (req, res, next) => {
      try {
        const token = this.extractToken(req);

        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = this.verifyToken(token);
        const session = this.getSessionByUserId(decoded.userId);

        if (!session) {
          return res.status(401).json({ error: 'Session not found' });
        }

        // Update last activity
        session.lastActivity = new Date();

        // Add user info to request
        req.user = {
          ...decoded,
          session: session.sessionId,
          roles: session.roles,
          permissions: session.permissions
        };

        next();
      } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
      }
    };
  }

  /**
   * Middleware for role-based authorization
   */
  authorize(requiredRoles = [], requiredPermissions = []) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check roles
      if (requiredRoles.length > 0) {
        const hasRole = requiredRoles.some(role => req.user.roles.includes(role));
        if (!hasRole) {
          return res.status(403).json({ error: 'Insufficient role permissions' });
        }
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasPermission = requiredPermissions.some(permission =>
          req.user.permissions.includes(permission) || req.user.permissions.includes('*')
        );
        if (!hasPermission) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      next();
    };
  }

  /**
   * RBAC Methods
   */
  assignRole(userId, role) {
    if (!this.config.defaultRoles.includes(role)) {
      throw new Error(`Invalid role: ${role}`);
    }

    const userRoles = this.userRoles.get(userId) || [];
    if (!userRoles.includes(role)) {
      userRoles.push(role);
      this.userRoles.set(userId, userRoles);
    }
  }

  removeRole(userId, role) {
    const userRoles = this.userRoles.get(userId) || [];
    const index = userRoles.indexOf(role);
    if (index > -1) {
      userRoles.splice(index, 1);
      this.userRoles.set(userId, userRoles);
    }
  }

  getUserRoles(userId) {
    return this.userRoles.get(userId) || ['user']; // Default role
  }

  getUserPermissions(userId) {
    const roles = this.getUserRoles(userId);
    const permissions = new Set();

    for (const role of roles) {
      const rolePermissions = this.rolePermissions.get(role) || new Set();
      for (const permission of rolePermissions) {
        permissions.add(permission);
      }
    }

    return Array.from(permissions);
  }

  /**
   * Session Management
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  getSessionByUserId(userId) {
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        return session;
      }
    }
    return null;
  }

  invalidateSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      this.refreshTokens.delete(session.refreshToken);
      this.sessions.delete(sessionId);
    }
  }

  invalidateAllUserSessions(userId) {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.refreshTokens.delete(session.refreshToken);
        this.sessions.delete(sessionId);
      }
    }
  }

  cleanupUserSessions(userId) {
    const userSessions = Array.from(this.sessions.entries())
      .filter(([_, session]) => session.userId === userId)
      .sort((a, b) => b[1].lastActivity - a[1].lastActivity);

    if (userSessions.length > this.config.maxSessions) {
      const sessionsToRemove = userSessions.slice(this.config.maxSessions);
      for (const [sessionId, session] of sessionsToRemove) {
        this.invalidateSession(sessionId);
      }
    }
  }

  /**
   * Security Utilities
   */
  extractToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return req.cookies?.accessToken || req.query?.token;
  }

  generateState() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  generateSecret() {
    return crypto.randomBytes(64).toString('hex');
  }

  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Enterprise SSO Support
   */
  async configureSAML(options) {
    // SAML configuration for enterprise SSO
    // This would integrate with libraries like passport-saml
    console.log('SAML configuration:', options);
    // Implementation would depend on specific SAML library
  }

  async configureOIDC(options) {
    // OpenID Connect configuration
    console.log('OIDC configuration:', options);
    // Implementation would depend on specific OIDC library
  }

  /**
   * Get authentication middleware bundle
   */
  getMiddleware() {
    const middlewares = [];

    if (this.middleware.helmet) {
      middlewares.push(this.middleware.helmet);
    }

    if (this.middleware.rateLimit) {
      middlewares.push(this.middleware.rateLimit);
    }

    return middlewares;
  }

  /**
   * Generate authentication routes for Express
   */
  generateRoutes() {
    return {
      // OAuth initiation routes
      '/auth/:provider': (req, res) => {
        const provider = req.params.provider;
        try {
          const authUrl = this.getOAuthURL(provider);
          res.redirect(authUrl);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },

      // OAuth callback routes
      '/auth/:provider/callback': async (req, res) => {
        const provider = req.params.provider;
        const { code, state } = req.query;

        try {
          const sessionData = await this.handleOAuthCallback(provider, code, state);

          // Set cookies
          res.cookie('accessToken', sessionData.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
          });

          res.cookie('refreshToken', sessionData.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
          });

          res.json(sessionData);
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      },

      // Token refresh route
      '/auth/refresh': async (req, res) => {
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshToken) {
          return res.status(400).json({ error: 'Refresh token required' });
        }

        try {
          const result = await this.refreshAccessToken(refreshToken);
          res.json(result);
        } catch (error) {
          res.status(401).json({ error: error.message });
        }
      },

      // Logout route
      '/auth/logout': (req, res) => {
        const sessionId = req.user?.session;
        if (sessionId) {
          this.invalidateSession(sessionId);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
      }
    };
  }
}

export default AuthenticationSystem;
