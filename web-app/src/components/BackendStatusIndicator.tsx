import React, { useState, useEffect } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Button,
  Tooltip,
  Card,
  CardBody,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiCheck,
  FiX,
  FiRefreshCw,
  FiServer,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { phase2AuthService } from "../services/phase2AuthService";

interface BackendStatus {
  available: boolean;
  url: string;
  message: string;
  responseTime?: number;
  lastChecked?: Date;
  version?: string;
}

interface BackendStatusIndicatorProps {
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "compact" | "card" | "banner";
}

const BackendStatusIndicator: React.FC<BackendStatusIndicatorProps> = ({
  showDetails = false,
  size = "md",
  variant = "compact",
}) => {
  const [status, setStatus] = useState<BackendStatus>({
    available: false,
    url: "",
    message: "Checking connection...",
  });
  const [isChecking, setIsChecking] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    checkBackendStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();

    try {
      const backendStatus = phase2AuthService.getBackendStatus();
      let responseTime = Date.now() - startTime;
      let version = "Demo Mode";

      // Try to get additional info from health endpoint with timeout and CORS handling
      if (backendStatus.available) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

          const healthResponse = await fetch(`${backendStatus.url}/health`, {
            signal: controller.signal,
            mode: "cors",
            credentials: "omit",
          });

          clearTimeout(timeoutId);
          responseTime = Date.now() - startTime;

          if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            version = healthData.version || "2.0";
          }
        } catch (error: any) {
          // Handle specific error types
          if (error.name === "AbortError") {
            console.log("Health check timed out");
          } else if (error.message?.includes("CORS")) {
            console.log("CORS policy blocked health check");
          } else {
            console.log("Could not fetch health data:", error.message);
          }
          // Don't mark as unavailable just because health check failed
          version = "2.0 (Health check blocked)";
        }
      }

      setStatus({
        ...backendStatus,
        responseTime,
        lastChecked: new Date(),
        version,
      });
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      let message = "Connection failed";

      if (error.message?.includes("CORS")) {
        message = "CORS policy blocking requests";
      } else if (error.message?.includes("fetch")) {
        message = "Network error - server may not be running";
      }

      setStatus({
        available: false,
        url: "http://localhost:3000",
        message,
        responseTime,
        lastChecked: new Date(),
        version: "Offline",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = () => {
    if (isChecking) return "yellow";
    return status.available ? "green" : "red";
  };

  const getStatusIcon = () => {
    if (isChecking) return FiRefreshCw;
    return status.available ? FiCheck : FiX;
  };

  const formatResponseTime = (time?: number) => {
    if (!time) return "N/A";
    return `${time}ms`;
  };

  if (variant === "banner") {
    return (
      <Alert
        status={status.available ? "success" : "warning"}
        borderRadius="lg"
      >
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>
            {status.available
              ? "Phase 2 Backend Connected"
              : "Demo Mode Active"}
          </AlertTitle>
          <AlertDescription fontSize="sm">{status.message}</AlertDescription>
        </Box>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<Icon as={getStatusIcon()} />}
          onClick={checkBackendStatus}
          isLoading={isChecking}
        >
          Refresh
        </Button>
      </Alert>
    );
  }

  if (variant === "card") {
    return (
      <Card bg={cardBg} borderColor={borderColor} size={size}>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <HStack spacing={3}>
                <Icon as={FiServer} boxSize={6} color="gray.500" />
                <VStack align="start" spacing={0}>
                  <Text
                    fontWeight="bold"
                    fontSize={size === "lg" ? "lg" : "md"}
                  >
                    Backend Status
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Phase 2 Enterprise Server
                  </Text>
                </VStack>
              </HStack>
              <VStack align="end" spacing={1}>
                <Badge
                  colorScheme={getStatusColor()}
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  <HStack spacing={1}>
                    <Icon
                      as={getStatusIcon()}
                      boxSize={3}
                      className={isChecking ? "spin" : ""}
                    />
                    <Text fontSize="xs">
                      {status.available ? "Connected" : "Unavailable"}
                    </Text>
                  </HStack>
                </Badge>
                <Text fontSize="xs" color="gray.500">
                  {status.responseTime &&
                    formatResponseTime(status.responseTime)}
                </Text>
              </VStack>
            </HStack>

            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                {status.message}
              </Text>
              <HStack justify="space-between" fontSize="xs" color="gray.500">
                <Text>URL: {status.url}</Text>
                <Text>
                  {status.lastChecked &&
                    `Last checked: ${status.lastChecked.toLocaleTimeString()}`}
                </Text>
              </HStack>
            </Box>

            {showDetails && (
              <Box>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onToggle}
                  rightIcon={<Icon as={isOpen ? FiChevronUp : FiChevronDown} />}
                >
                  Details
                </Button>
                <Collapse in={isOpen}>
                  <Box mt={2} p={3} bg="gray.50" borderRadius="md">
                    <VStack spacing={2} align="start" fontSize="sm">
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">Version:</Text>
                        <Text>{status.version || "Unknown"}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">Response Time:</Text>
                        <Text>{formatResponseTime(status.responseTime)}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="medium">Auth Service:</Text>
                        <Badge
                          size="sm"
                          colorScheme={status.available ? "green" : "orange"}
                        >
                          {status.available ? "Phase 2 APIs" : "Demo Mode"}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>
                </Collapse>
              </Box>
            )}

            <HStack spacing={2}>
              <Button
                size="sm"
                leftIcon={<Icon as={getStatusIcon()} />}
                onClick={checkBackendStatus}
                isLoading={isChecking}
                loadingText="Checking..."
                variant="outline"
                flex={1}
              >
                Refresh Status
              </Button>
              {!status.available && (
                <Tooltip label="Instructions to start Phase 2 server">
                  <Button
                    size="sm"
                    leftIcon={<Icon as={FiInfo} />}
                    onClick={() => window.open("/docs#phase2-setup", "_blank")}
                    variant="ghost"
                  >
                    Setup Guide
                  </Button>
                </Tooltip>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Compact variant
  return (
    <HStack spacing={2}>
      <Tooltip label={status.message}>
        <HStack spacing={2}>
          <Icon
            as={getStatusIcon()}
            color={`${getStatusColor()}.500`}
            boxSize={size === "sm" ? 4 : size === "lg" ? 6 : 5}
            className={isChecking ? "spin" : ""}
          />
          <Badge
            colorScheme={getStatusColor()}
            variant="subtle"
            fontSize={size === "sm" ? "xs" : "sm"}
          >
            {status.available ? "Phase 2" : "Demo"}
          </Badge>
        </HStack>
      </Tooltip>
      <Button
        size="xs"
        variant="ghost"
        onClick={checkBackendStatus}
        isLoading={isChecking}
        p={1}
        minW="auto"
      >
        <Icon as={FiRefreshCw} boxSize={3} />
      </Button>
    </HStack>
  );
};

export default BackendStatusIndicator;
