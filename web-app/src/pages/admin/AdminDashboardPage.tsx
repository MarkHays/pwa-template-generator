import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Badge,
  Progress,
  Button,
  Icon,
  useColorModeValue,
  Flex,
  Alert,
  AlertIcon,
  AlertDescription,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiTrendingUp,
  FiWifi,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiExternalLink,
} from "react-icons/fi";
import BackendStatusIndicator from "../../components/BackendStatusIndicator";

const AdminDashboardPage: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalProjects: 3456,
    apiRequests: 125698,
    systemHealth: 98.5,
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 35,
    networkLatency: 12,
  });

  const [realtimeData, setRealtimeData] = useState({
    onlineUsers: 47,
    activeConnections: 234,
    currentRequests: 1247,
    errorRate: 0.02,
  });

  const [alerts] = useState([
    {
      id: 1,
      type: "warning",
      title: "High Memory Usage",
      description: "Memory usage is at 85% on server-02",
      timestamp: "2 minutes ago",
    },
    {
      id: 2,
      type: "success",
      title: "Database Backup Complete",
      description: "Automated backup completed successfully",
      timestamp: "15 minutes ago",
    },
    {
      id: 3,
      type: "info",
      title: "New User Registration",
      description: "5 new enterprise users registered",
      timestamp: "1 hour ago",
    },
  ]);

  const [recentActivity] = useState([
    {
      id: 1,
      user: "john.doe@company.com",
      action: "Created new project",
      resource: "E-commerce Dashboard",
      timestamp: "5 minutes ago",
      status: "success",
    },
    {
      id: 2,
      user: "admin@company.com",
      action: "Updated user permissions",
      resource: "User Management",
      timestamp: "12 minutes ago",
      status: "success",
    },
    {
      id: 3,
      user: "sarah.smith@company.com",
      action: "Database query executed",
      resource: "Analytics DB",
      timestamp: "18 minutes ago",
      status: "success",
    },
    {
      id: 4,
      user: "system",
      action: "Authentication failed",
      resource: "Login Attempt",
      timestamp: "25 minutes ago",
      status: "error",
    },
  ]);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData((prev) => ({
        ...prev,
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 5) - 2,
        activeConnections:
          prev.activeConnections + Math.floor(Math.random() * 20) - 10,
        currentRequests:
          prev.currentRequests + Math.floor(Math.random() * 100) - 50,
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.01),
      }));

      setSystemMetrics((prev) => ({
        ...prev,
        cpuUsage: Math.max(
          0,
          Math.min(100, prev.cpuUsage + Math.floor(Math.random() * 10) - 5),
        ),
        memoryUsage: Math.max(
          0,
          Math.min(100, prev.memoryUsage + Math.floor(Math.random() * 8) - 4),
        ),
        networkLatency: Math.max(
          1,
          prev.networkLatency + Math.floor(Math.random() * 4) - 2,
        ),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (value: number) => {
    if (value >= 90) return "green";
    if (value >= 70) return "yellow";
    return "red";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return FiCheckCircle;
      case "error":
        return FiXCircle;
      case "warning":
        return FiAlertTriangle;
      default:
        return FiActivity;
    }
  };

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
            Enterprise Dashboard
          </Heading>
          <Text color="gray.600">Real-time system overview and management</Text>
        </Box>
        <VStack spacing={3} w={{ base: "full", md: "auto" }}>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Refresh Data
          </Button>
          <Button
            leftIcon={<Icon as={FiExternalLink} />}
            colorScheme="blue"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            View Reports
          </Button>
        </VStack>
      </Flex>

      {/* Backend Status Banner */}
      <Box mb={6}>
        <BackendStatusIndicator variant="banner" />
      </Box>

      {/* Key Metrics Grid */}
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        }}
        gap={{ base: 4, md: 6 }}
        mb={{ base: 6, md: 8 }}
      >
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Users</StatLabel>
              <StatNumber fontSize="2xl">
                {systemMetrics.totalUsers.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Active Users</StatLabel>
              <StatNumber fontSize="2xl" color="green.500">
                {realtimeData.onlineUsers}
              </StatNumber>
              <StatHelpText>Currently online users</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">API Requests</StatLabel>
              <StatNumber fontSize="2xl">
                {systemMetrics.apiRequests.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12.5% from yesterday
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">System Health</StatLabel>
              <StatNumber
                fontSize="2xl"
                color={getHealthColor(systemMetrics.systemHealth) + ".500"}
              >
                {systemMetrics.systemHealth}%
              </StatNumber>
              <StatHelpText>
                <Icon as={FiCheckCircle} color="green.500" mr={1} />
                All systems operational
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Real-time System Status */}
      <Grid
        templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
        gap={{ base: 4, md: 6 }}
        mb={{ base: 6, md: 8 }}
      >
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Real-time System Status</Heading>
          </CardHeader>
          <CardBody>
            <Grid
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
              gap={{ base: 4, md: 6 }}
            >
              <VStack spacing={4}>
                <Box textAlign="center" w="full">
                  <CircularProgress
                    value={systemMetrics.cpuUsage}
                    color={getHealthColor(100 - systemMetrics.cpuUsage)}
                    size={{ base: "60px", md: "80px" }}
                    thickness="8px"
                  >
                    <CircularProgressLabel fontSize={{ base: "xs", md: "sm" }}>
                      {systemMetrics.cpuUsage}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    mt={2}
                    fontWeight="medium"
                  >
                    CPU Usage
                  </Text>
                </Box>

                <Box textAlign="center" w="full">
                  <CircularProgress
                    value={systemMetrics.memoryUsage}
                    color={getHealthColor(100 - systemMetrics.memoryUsage)}
                    size={{ base: "60px", md: "80px" }}
                    thickness="8px"
                  >
                    <CircularProgressLabel fontSize={{ base: "xs", md: "sm" }}>
                      {systemMetrics.memoryUsage}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    mt={2}
                    fontWeight="medium"
                  >
                    Memory Usage
                  </Text>
                </Box>
              </VStack>

              <VStack spacing={4}>
                <Box textAlign="center" w="full">
                  <CircularProgress
                    value={systemMetrics.diskUsage}
                    color={getHealthColor(100 - systemMetrics.diskUsage)}
                    size={{ base: "60px", md: "80px" }}
                    thickness="8px"
                  >
                    <CircularProgressLabel fontSize={{ base: "xs", md: "sm" }}>
                      {systemMetrics.diskUsage}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text
                    fontSize={{ base: "xs", md: "sm" }}
                    mt={2}
                    fontWeight="medium"
                  >
                    Disk Usage
                  </Text>
                </Box>

                <Box textAlign="center" w="full">
                  <HStack justify="center" spacing={2}>
                    <Icon as={FiWifi} color="green.500" />
                    <Text fontSize="lg" fontWeight="bold">
                      {systemMetrics.networkLatency}ms
                    </Text>
                  </HStack>
                  <Text fontSize="sm" mt={1} fontWeight="medium">
                    Network Latency
                  </Text>
                </Box>
              </VStack>
            </Grid>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Live Connections</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.600">
                    Active Connections
                  </Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {realtimeData.activeConnections}
                  </Text>
                </Flex>
                <Progress
                  value={(realtimeData.activeConnections / 500) * 100}
                  colorScheme="blue"
                  size="sm"
                  borderRadius="md"
                />
              </Box>

              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.600">
                    Current Requests
                  </Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {realtimeData.currentRequests}
                  </Text>
                </Flex>
                <Progress
                  value={(realtimeData.currentRequests / 2000) * 100}
                  colorScheme="green"
                  size="sm"
                  borderRadius="md"
                />
              </Box>

              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm" color="gray.600">
                    Error Rate
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="red.500">
                    {(realtimeData.errorRate * 100).toFixed(2)}%
                  </Text>
                </Flex>
                <Progress
                  value={realtimeData.errorRate * 100}
                  colorScheme="red"
                  size="sm"
                  borderRadius="md"
                />
              </Box>

              <Box
                bg="blue.50"
                p={3}
                borderRadius="md"
                border="1px"
                borderColor="blue.200"
              >
                <HStack>
                  <Icon as={FiTrendingUp} color="blue.500" />
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="blue.700">
                      Performance Score
                    </Text>
                    <Text fontSize="xs" color="blue.600">
                      Excellent response times
                    </Text>
                  </VStack>
                  <Badge colorScheme="blue" variant="solid">
                    A+
                  </Badge>
                </HStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Alerts and Recent Activity */}
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        gap={{ base: 4, md: 6 }}
        mb={{ base: 6, md: 8 }}
      >
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">System Alerts</Heading>
              <Badge colorScheme="red" variant="outline">
                {alerts.length}
              </Badge>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              {alerts.map((alert) => (
                <Alert
                  key={alert.id}
                  status={alert.type as any}
                  borderRadius="md"
                  variant="left-accent"
                >
                  <AlertIcon />
                  <Box flex={1}>
                    <AlertDescription fontSize="sm">
                      <Text fontWeight="medium" mb={1}>
                        {alert.title}
                      </Text>
                      <Text color="gray.600">{alert.description}</Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {alert.timestamp}
                      </Text>
                    </AlertDescription>
                  </Box>
                </Alert>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Recent Activity</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={{ base: 2, md: 3 }} align="stretch">
              {recentActivity.map((activity) => (
                <Box
                  key={activity.id}
                  p={{ base: 2, md: 3 }}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                >
                  <HStack align="start" spacing={{ base: 2, md: 3 }}>
                    <Icon
                      as={getStatusIcon(activity.status)}
                      color={
                        activity.status === "success" ? "green.500" : "red.500"
                      }
                      mt={1}
                      boxSize={{ base: 4, md: 5 }}
                    />
                    <Box flex={1}>
                      <Text
                        fontSize={{ base: "xs", md: "sm" }}
                        fontWeight="medium"
                        mb={1}
                      >
                        {activity.action}
                      </Text>
                      <Text fontSize="xs" color="gray.600" mb={1}>
                        {activity.resource}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mb={1}>
                        {activity.user}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {activity.timestamp}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
