import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Collapse,
  useDisclosure,
  HStack,
  Icon,
  Container,
} from "@chakra-ui/react";
import {
  FiRefreshCw,
  FiAlertTriangle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error);
      console.error("Error info:", errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to an error tracking service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Example: Send to your error tracking service
    // errorTrackingService.captureException(error, errorReport);

    console.error("Error report:", errorReport);
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  onReload: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  onReset,
  onReload,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Container maxW="2xl">
        <VStack spacing={8} textAlign="center">
          {/* Error Icon */}
          <Box
            w={20}
            h={20}
            bg="red.100"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FiAlertTriangle} w={10} h={10} color="red.500" />
          </Box>

          {/* Error Message */}
          <VStack spacing={4}>
            <Heading size="xl" color="gray.800">
              Something went wrong
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="lg">
              We're sorry, but something unexpected happened. Our team has been
              notified and is working on a fix.
            </Text>
          </VStack>

          {/* Error Details Alert */}
          {error && (
            <Alert status="error" borderRadius="lg" maxW="lg">
              <AlertIcon />
              <Box flex="1" textAlign="left">
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription display="block" mt={2}>
                  <Code colorScheme="red" fontSize="sm">
                    {error.name}: {error.message}
                  </Code>
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Action Buttons */}
          <HStack spacing={4}>
            <Button
              leftIcon={<FiRefreshCw />}
              onClick={onReset}
              colorScheme="blue"
              size="lg"
            >
              Try Again
            </Button>
            <Button variant="outline" onClick={onReload} size="lg">
              Reload Page
            </Button>
          </HStack>

          {/* Debug Information (Development Only) */}
          {isDevelopment && (error || errorInfo) && (
            <Box w="full" maxW="lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                rightIcon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
                color="gray.600"
              >
                {isOpen ? "Hide" : "Show"} Debug Information
              </Button>

              <Collapse in={isOpen} animateOpacity>
                <VStack spacing={4} mt={4} align="stretch">
                  {error && (
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        mb={2}
                        color="gray.700"
                      >
                        Error Stack:
                      </Text>
                      <Code
                        display="block"
                        whiteSpace="pre-wrap"
                        fontSize="xs"
                        p={4}
                        bg="gray.100"
                        borderRadius="md"
                        maxH="200px"
                        overflowY="auto"
                      >
                        {error.stack}
                      </Code>
                    </Box>
                  )}

                  {errorInfo && (
                    <Box>
                      <Text
                        fontSize="sm"
                        fontWeight="bold"
                        mb={2}
                        color="gray.700"
                      >
                        Component Stack:
                      </Text>
                      <Code
                        display="block"
                        whiteSpace="pre-wrap"
                        fontSize="xs"
                        p={4}
                        bg="gray.100"
                        borderRadius="md"
                        maxH="200px"
                        overflowY="auto"
                      >
                        {errorInfo.componentStack}
                      </Code>
                    </Box>
                  )}
                </VStack>
              </Collapse>
            </Box>
          )}

          {/* Help Text */}
          <Text fontSize="sm" color="gray.500" maxW="lg">
            If this problem persists, please{" "}
            <Box
              as="span"
              color="blue.500"
              cursor="pointer"
              textDecoration="underline"
            >
              contact our support team
            </Box>{" "}
            with the error details above.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default ErrorBoundary;
export { ErrorBoundary };
