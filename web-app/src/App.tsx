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
          </PWAGeneratorProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;
