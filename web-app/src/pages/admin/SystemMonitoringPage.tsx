import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Alert,
  AlertIcon,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Icon,
  IconButton,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiCpu,
  FiHardDrive,
  FiWifi,
  FiServer,
  FiDatabase,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiDownload,
  FiSettings,
  FiTrendingUp,
  FiUsers,
  FiGlobe,
  FiShield,
  FiSearch,
  FiEye,
  FiBell,
} from "react-icons/fi";

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  lastUpdated: string;
}

interface ServiceStatus {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  uptime: string;
  responseTime: number;
}

interface SystemAlert {
  id: string;
  type: "info" | "warning" | "error" | "critical";
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
}

const SystemMonitoringPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Safe initial state with error handling
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      id: "cpu",
      name: "CPU Usage",
      value: 45,
      unit: "%",
      status: "healthy",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "memory",
      name: "Memory Usage",
      value: 67,
      unit: "%",
      status: "healthy",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "disk",
      name: "Disk Usage",
      value: 32,
      unit: "%",
      status: "healthy",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "network",
      name: "Network I/O",
      value: 156,
      unit: "MB/s",
      status: "healthy",
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: "web-server",
      name: "Web Server",
      status: "running",
      uptime: "7d 14h 23m",
      responseTime: 45,
    },
    {
      id: "auth-service",
      name: "Authentication Service",
      status: "running",
      uptime: "7d 14h 23m",
      responseTime: 32,
    },
    {
      id: "database",
      name: "Database Server",
      status: "running",
      uptime: "15d 8h 45m",
      responseTime: 23,
    },
    {
      id: "cache",
      name: "Redis Cache",
      status: "running",
      uptime: "7d 14h 23m",
      responseTime: 12,
    },
  ]);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: "1",
      type: "warning",
      title: "High Memory Usage",
      description: "Memory usage is approaching 70% threshold",
      timestamp: new Date().toISOString(),
      acknowledged: false,
    },
    {
      id: "2",
      type: "info",
      title: "Security Update Available",
      description: "New security patches available for web server",
      timestamp: new Date().toISOString(),
      acknowledged: true,
    },
  ]);

  // Safe initialization with error handling
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate data loading
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize monitoring data:", err);
        setError("Failed to load monitoring data");
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Safe auto-refresh with error handling
  useEffect(() => {
    if (!autoRefresh || isLoading) return;

    const interval = setInterval(() => {
      try {
        setSystemMetrics((prev) =>
          prev.map((metric) => ({
            ...metric,
            value: Math.max(
              0,
              Math.min(100, metric.value + (Math.random() - 0.5) * 5),
            ),
            lastUpdated: new Date().toISOString(),
          })),
        );
      } catch (err) {
        console.error("Failed to update metrics:", err);
        setAutoRefresh(false);
        toast({
          title: "Auto-refresh Error",
          description: "Auto-refresh has been disabled due to an error",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isLoading, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "running":
        return "green";
      case "warning":
        return "yellow";
      case "critical":
      case "error":
        return "red";
      case "stopped":
        return "gray";
      default:
        return "gray";
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    try {
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, acknowledged: true } : alert,
        ),
      );
      toast({
        title: "Alert Acknowledged",
        description: "Alert has been marked as acknowledged",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
      toast({
        title: "Error",
        description: "Failed to acknowledge alert",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRefresh = () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        setSystemMetrics((prev) =>
          prev.map((metric) => ({
            ...metric,
            value: Math.max(0, Math.min(100, Math.random() * 80 + 10)),
            lastUpdated: new Date().toISOString(),
          })),
        );
        setIsLoading(false);
        toast({
          title: "Data Refreshed",
          description: "System monitoring data has been updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }, 1000);
    } catch (err) {
      console.error("Failed to refresh data:", err);
      setIsLoading(false);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh monitoring data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return (
      <Box>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">System Monitoring Error</Text>
            <Text>{error}</Text>
          </Box>
        </Alert>
        <Center mt={6}>
          <Button onClick={() => window.location.reload()} colorScheme="blue">
            Reload Page
          </Button>
        </Center>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Center minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading system monitoring data...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box>
      {/* Page Header */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify={{ base: "start", md: "space-between" }}
        align={{ base: "start", md: "center" }}
        mb={6}
        gap={{ base: 4, md: 0 }}
      >
        <Box>
          <Heading size="lg" mb={2}>
            System Monitoring
          </Heading>
          <Text color="gray.600">
            Real-time system health and performance monitoring
          </Text>
        </Box>
        <VStack spacing={3} w={{ base: "full", md: "auto" }}>
          <FormControl
            display="flex"
            alignItems="center"
            w={{ base: "full", md: "auto" }}
          >
            <FormLabel htmlFor="auto-refresh" mb="0" fontSize="sm">
              Auto-refresh
            </FormLabel>
            <Switch
              id="auto-refresh"
              isChecked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              colorScheme="blue"
            />
          </FormControl>
          <Select
            size={{ base: "md", md: "sm" }}
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            w={{ base: "full", md: "100px" }}
            maxW="200px"
          >
            <option value="30">30s</option>
            <option value="60">1m</option>
            <option value="300">5m</option>
          </Select>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            onClick={handleRefresh}
            isLoading={isLoading}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Refresh
          </Button>
        </VStack>
      </Flex>

      {/* System Overview Cards */}
      <Grid
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={4}
        mb={6}
      >
        {systemMetrics.map((metric) => (
          <Card
            key={metric.id}
            bg={cardBg}
            border="1px"
            borderColor={borderColor}
          >
            <CardBody>
              <Stat>
                <StatLabel color="gray.600" fontSize="sm">
                  {metric.name}
                </StatLabel>
                <StatNumber
                  fontSize="2xl"
                  color={getStatusColor(metric.status) + ".500"}
                >
                  {metric.value.toFixed(0)}
                  {metric.unit}
                </StatNumber>
                <StatHelpText>
                  Last updated:{" "}
                  {new Date(metric.lastUpdated).toLocaleTimeString()}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Main Monitoring Interface */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>System Health</Tab>
          <Tab>Services Status</Tab>
          <Tab>Alerts ({alerts.filter((a) => !a.acknowledged).length})</Tab>
        </TabList>

        <TabPanels>
          {/* System Health Tab */}
          <TabPanel p={0} pt={6}>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Real-time Metrics</Heading>
                </CardHeader>
                <CardBody>
                  <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                    {systemMetrics.map((metric) => (
                      <Box key={metric.id} textAlign="center">
                        <CircularProgress
                          value={metric.value}
                          color={getStatusColor(metric.status)}
                          size="80px"
                          thickness="8px"
                        >
                          <CircularProgressLabel fontSize="sm">
                            {metric.value.toFixed(0)}
                          </CircularProgressLabel>
                        </CircularProgress>
                        <Text fontSize="sm" mt={2} fontWeight="medium">
                          {metric.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {metric.unit}
                        </Text>
                      </Box>
                    ))}
                  </Grid>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="sm">System Overview</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <HStack spacing={2}>
                        <Icon as={FiServer} color="green.500" />
                        <Text fontSize="sm">Uptime</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold">
                        15d 8h 45m
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <HStack spacing={2}>
                        <Icon as={FiUsers} color="blue.500" />
                        <Text fontSize="sm">Active Users</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold">
                        47
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <HStack spacing={2}>
                        <Icon as={FiGlobe} color="purple.500" />
                        <Text fontSize="sm">API Requests</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold">
                        1.2M
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>

          {/* Services Status Tab */}
          <TabPanel p={0} pt={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Service Status</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Service</Th>
                      <Th>Status</Th>
                      <Th>Uptime</Th>
                      <Th>Response Time</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {services.map((service) => (
                      <Tr key={service.id}>
                        <Td>
                          <HStack spacing={2}>
                            <Icon
                              as={
                                service.status === "running"
                                  ? FiCheckCircle
                                  : FiXCircle
                              }
                              color={getStatusColor(service.status) + ".500"}
                            />
                            <Text fontWeight="medium">{service.name}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={getStatusColor(service.status)}
                            variant="subtle"
                          >
                            {service.status}
                          </Badge>
                        </Td>
                        <Td>{service.uptime}</Td>
                        <Td>{service.responseTime}ms</Td>
                        <Td>
                          <IconButton
                            aria-label="View details"
                            icon={<FiEye />}
                            size="sm"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Alerts Tab */}
          <TabPanel p={0} pt={6}>
            <VStack spacing={4} align="stretch">
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  status={alert.type === "critical" ? "error" : alert.type}
                  variant="left-accent"
                  borderRadius="md"
                >
                  <AlertIcon />
                  <Box flex="1">
                    <HStack justify="space-between" align="start">
                      <Box>
                        <Text fontWeight="bold">{alert.title}</Text>
                        <AlertDescription>{alert.description}</AlertDescription>
                        <Text fontSize="xs" color="gray.600" mt={1}>
                          {new Date(alert.timestamp).toLocaleString()}
                        </Text>
                      </Box>
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </HStack>
                  </Box>
                </Alert>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SystemMonitoringPage;
