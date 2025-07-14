import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  phase2AuthService,
  AdminUser,
  AuthResponse,
} from "../services/phase2AuthService";

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<AuthResponse>;
  oauthLogin: (provider: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const result = await phase2AuthService.verifyToken(token);
        if (result.success && result.user) {
          setUser(result.user);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, try to refresh
          await tryRefreshToken();
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tryRefreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("adminRefreshToken");
      if (refreshToken) {
        const result = await phase2AuthService.refreshToken(refreshToken);
        if (result.success && result.token && result.user) {
          localStorage.setItem("adminToken", result.token);
          if (result.refreshToken) {
            localStorage.setItem("adminRefreshToken", result.refreshToken);
          }
          setUser(result.user);
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch (error) {
      console.error("Token refresh error:", error);
    }

    // If refresh fails, clear tokens and reset state
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    setUser(null);
    setIsAuthenticated(false);
    return false;
  };

  const login = async (
    email: string,
    password: string,
    rememberMe?: boolean,
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await phase2AuthService.login({
        email,
        password,
        rememberMe,
      });

      if (result.success && result.token && result.user) {
        localStorage.setItem("adminToken", result.token);
        if (result.refreshToken) {
          localStorage.setItem("adminRefreshToken", result.refreshToken);
        }
        setUser(result.user);
        setIsAuthenticated(true);
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An unexpected error occurred during login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const oauthLogin = async (provider: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await phase2AuthService.oauthLogin(provider);

      if (result.success && result.token && result.user) {
        localStorage.setItem("adminToken", result.token);
        if (result.refreshToken) {
          localStorage.setItem("adminRefreshToken", result.refreshToken);
        }
        setUser(result.user);
        setIsAuthenticated(true);
      }

      return result;
    } catch (error) {
      console.error("OAuth login error:", error);
      return {
        success: false,
        message: "An unexpected error occurred during OAuth login",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await phase2AuthService.logout();
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    return await tryRefreshToken();
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    oauthLogin,
    logout,
    refreshToken,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
