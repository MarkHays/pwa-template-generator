import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import theme from "./theme";
import { PWAGeneratorProvider } from "./store/PWAGeneratorStore";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import BuilderPage from "./pages/BuilderPage";
import PreviewPage from "./pages/PreviewPage";
import DownloadPage from "./pages/DownloadPage";
import AboutPage from "./pages/AboutPage";
import DocsPage from "./pages/DocsPage";

// Enterprise Admin Dashboard Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import UserManagementPage from "./pages/admin/UserManagementPage";
import DatabaseAdminPage from "./pages/admin/DatabaseAdminPage";
import SystemMonitoringPage from "./pages/admin/SystemMonitoringPage";
import ApiExplorerPage from "./pages/admin/ApiExplorerPage";
import TenantManagementPage from "./pages/admin/TenantManagementPage";
import AuthSettingsPage from "./pages/admin/AuthSettingsPage";

// Enterprise User Authentication
import AuthLayout from "./components/auth/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/auth/ProfilePage";

// Authentication Context
import { AuthProvider } from "./contexts/AuthContext";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log("App component rendering...");

  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <PWAGeneratorProvider>
            <AuthProvider>
              <Router>
                <Box minH="100vh" bg="gray.50">
                  <Layout>
                    <Routes>
                      {/* Home Page */}
                      <Route path="/" element={<HomePage />} />

                      {/* Builder Wizard */}
                      <Route path="/builder/*" element={<BuilderPage />} />

                      {/* Preview */}
                      <Route path="/preview" element={<PreviewPage />} />

                      {/* Download */}
                      <Route path="/download" element={<DownloadPage />} />

                      {/* About */}
                      <Route path="/about" element={<AboutPage />} />

                      {/* Documentation */}
                      <Route path="/docs" element={<DocsPage />} />

                      {/* Enterprise Authentication Routes */}
                      <Route path="/auth/*" element={<AuthLayout />}>
                        <Route path="login" element={<LoginPage />} />
                        <Route path="register" element={<RegisterPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                      </Route>

                      {/* Enterprise Admin Dashboard Routes */}
                      <Route path="/admin" element={<AdminLoginPage />} />
                      <Route path="/admin/*" element={<AdminLayout />}>
                        <Route
                          path="dashboard"
                          element={<AdminDashboardPage />}
                        />
                        <Route path="users" element={<UserManagementPage />} />
                        <Route
                          path="database"
                          element={<DatabaseAdminPage />}
                        />
                        <Route
                          path="monitoring"
                          element={<SystemMonitoringPage />}
                        />
                        <Route path="api" element={<ApiExplorerPage />} />
                        <Route
                          path="tenants"
                          element={<TenantManagementPage />}
                        />
                        <Route
                          path="auth-settings"
                          element={<AuthSettingsPage />}
                        />
                      </Route>

                      {/* 404 Page */}
                      <Route
                        path="*"
                        element={
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            minH="60vh"
                            textAlign="center"
                          >
                            <Box>
                              <Box fontSize="6xl" mb={4}>
                                🔍
                              </Box>
                              <Box fontSize="2xl" fontWeight="bold" mb={2}>
                                Page Not Found
                              </Box>
                              <Box color="gray.600">
                                The page you're looking for doesn't exist.
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                    </Routes>
                  </Layout>

                  {/* Toast Notifications */}
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: "#363636",
                        color: "#fff",
                      },
                      success: {
                        duration: 3000,
                        iconTheme: {
                          primary: "#4ade80",
                          secondary: "#fff",
                        },
                      },
                      error: {
                        duration: 5000,
                        iconTheme: {
                          primary: "#ef4444",
                          secondary: "#fff",
                        },
                      },
                    }}
                  />
                </Box>
              </Router>
            </AuthProvider>
          </PWAGeneratorProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;
