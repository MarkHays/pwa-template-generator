import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Switch,
  useDisclosure,
  useToast,
  useColorModeValue,
  Icon,
  IconButton,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  CircularProgress,
  CircularProgressLabel,
  Code,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiDatabase,
  FiDollarSign,
  FiSettings,
  FiActivity,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiBarChart,
  FiCpu,
  FiHardDrive,
  FiGlobe,
  FiShield,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
} from "react-icons/fi";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  status: "active" | "suspended" | "pending" | "trial";
  plan: "starter" | "professional" | "enterprise" | "custom";
  createdAt: string;
  lastActivity: string;
  users: {
    total: number;
    active: number;
    limit: number;
  };
  storage: {
    used: number;
    limit: number;
    unit: "GB" | "TB";
  };
  billing: {
    amount: number;
    currency: string;
    period: "monthly" | "yearly";
    nextBilling: string;
    status: "current" | "overdue" | "cancelled";
  };
  features: string[];
  admin: {
    name: string;
    email: string;
    avatar?: string;
  };
  metrics: {
    apiRequests: number;
    activeUsers: number;
    revenue: number;
    satisfaction: number;
  };
}

interface TenantUsage {
  cpu: number;
  memory: number;
  storage: number;
  bandwidth: number;
  requests: number;
}

const TenantManagementPage: React.FC = () => {
  const toast = useToast();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: "1",
      name: "Acme Corporation",
      domain: "acme.com",
      subdomain: "acme",
      status: "active",
      plan: "enterprise",
      createdAt: "2024-01-01",
      lastActivity: "2024-01-15 10:30:00",
      users: { total: 156, active: 89, limit: 200 },
      storage: { used: 2.3, limit: 100, unit: "GB" },
      billing: {
        amount: 299,
        currency: "USD",
        period: "monthly",
        nextBilling: "2024-02-01",
        status: "current",
      },
      features: ["Advanced Analytics", "Custom Domains", "SSO", "API Access"],
      admin: {
        name: "John Smith",
        email: "john@acme.com",
        avatar: "/api/placeholder/40/40",
      },
      metrics: {
        apiRequests: 125000,
        activeUsers: 89,
        revenue: 299,
        satisfaction: 4.8,
      },
    },
    {
      id: "2",
      name: "TechStart Inc",
      domain: "techstart.io",
      subdomain: "techstart",
      status: "active",
      plan: "professional",
      createdAt: "2024-01-05",
      lastActivity: "2024-01-15 09:45:00",
      users: { total: 34, active: 28, limit: 50 },
      storage: { used: 850, limit: 10, unit: "GB" },
      billing: {
        amount: 99,
        currency: "USD",
        period: "monthly",
        nextBilling: "2024-02-05",
        status: "current",
      },
      features: ["Team Collaboration", "Advanced Reporting"],
      admin: {
        name: "Sarah Johnson",
        email: "sarah@techstart.io",
      },
      metrics: {
        apiRequests: 45000,
        activeUsers: 28,
        revenue: 99,
        satisfaction: 4.5,
      },
    },
    {
      id: "3",
      name: "Design Studio",
      domain: "designstudio.co",
      subdomain: "design",
      status: "trial",
      plan: "starter",
      createdAt: "2024-01-12",
      lastActivity: "2024-01-15 11:20:00",
      users: { total: 8, active: 6, limit: 10 },
      storage: { used: 1.2, limit: 5, unit: "GB" },
      billing: {
        amount: 0,
        currency: "USD",
        period: "monthly",
        nextBilling: "2024-01-27",
        status: "current",
      },
      features: ["Basic Features"],
      admin: {
        name: "Mike Wilson",
        email: "mike@designstudio.co",
      },
      metrics: {
        apiRequests: 2500,
        activeUsers: 6,
        revenue: 0,
        satisfaction: 4.2,
      },
    },
    {
      id: "4",
      name: "Global Enterprises",
      domain: "global-ent.com",
      subdomain: "global",
      status: "suspended",
      plan: "enterprise",
      createdAt: "2023-12-15",
      lastActivity: "2024-01-10 16:30:00",
      users: { total: 450, active: 0, limit: 500 },
      storage: { used: 15.7, limit: 100, unit: "GB" },
      billing: {
        amount: 599,
        currency: "USD",
        period: "monthly",
        nextBilling: "2024-01-15",
        status: "overdue",
      },
      features: [
        "Enterprise Suite",
        "Custom Integrations",
        "Dedicated Support",
      ],
      admin: {
        name: "Robert Chen",
        email: "robert@global-ent.com",
      },
      metrics: {
        apiRequests: 0,
        activeUsers: 0,
        revenue: 599,
        satisfaction: 3.8,
      },
    },
  ]);

  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [tenantUsage, setTenantUsage] = useState<TenantUsage>({
    cpu: 45,
    memory: 62,
    storage: 78,
    bandwidth: 34,
    requests: 1247,
  });

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.subdomain.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || tenant.status === statusFilter;
    const matchesPlan = planFilter === "all" || tenant.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "trial":
        return "blue";
      case "suspended":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "starter":
        return "gray";
      case "professional":
        return "blue";
      case "enterprise":
        return "purple";
      case "custom":
        return "orange";
      default:
        return "gray";
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case "current":
        return "green";
      case "overdue":
        return "red";
      case "cancelled":
        return "gray";
      default:
        return "gray";
    }
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    onEditOpen();
  };

  const handleViewDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    onDetailsOpen();
  };

  const handleSuspendTenant = async (tenantId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTenants(
        tenants.map((t) =>
          t.id === tenantId ? { ...t, status: "suspended" as const } : t,
        ),
      );
      toast({
        title: "Tenant Suspended",
        description: "Tenant has been suspended successfully",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend tenant",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateTenant = async (tenantId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTenants(
        tenants.map((t) =>
          t.id === tenantId ? { ...t, status: "active" as const } : t,
        ),
      );
      toast({
        title: "Tenant Activated",
        description: "Tenant has been activated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate tenant",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary stats
  const summaryStats = {
    total: tenants.length,
    active: tenants.filter((t) => t.status === "active").length,
    trial: tenants.filter((t) => t.status === "trial").length,
    suspended: tenants.filter((t) => t.status === "suspended").length,
    totalRevenue: tenants.reduce((sum, t) => sum + t.metrics.revenue, 0),
    totalUsers: tenants.reduce((sum, t) => sum + t.users.total, 0),
  };

  return (
    <Box>
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Tenant Management
          </Heading>
          <Text color="gray.600">
            Multi-tenant administration and monitoring
          </Text>
        </Box>
        <HStack spacing={3}>
          <Button
            leftIcon={<Icon as={FiDownload} />}
            variant="outline"
            size="sm"
          >
            Export Report
          </Button>
          <Button leftIcon={<Icon as={FiUpload} />} variant="outline" size="sm">
            Bulk Import
          </Button>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={onCreateOpen}
          >
            Add Tenant
          </Button>
        </HStack>
      </Flex>

      {/* Summary Statistics */}
      <Grid
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={4}
        mb={6}
      >
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Tenants</StatLabel>
              <StatNumber>{summaryStats.total}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Active Tenants</StatLabel>
              <StatNumber color="green.500">{summaryStats.active}</StatNumber>
              <StatHelpText>Currently operational</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Monthly Revenue</StatLabel>
              <StatNumber color="green.500">
                ${summaryStats.totalRevenue.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Users</StatLabel>
              <StatNumber>
                {summaryStats.totalUsers.toLocaleString()}
              </StatNumber>
              <StatHelpText>Across all tenants</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Filters and Search */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <Grid
            templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr" }}
            gap={4}
          >
            <InputGroup>
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </Select>

            <Select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
            >
              <option value="all">All Plans</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
              <option value="custom">Custom</option>
            </Select>

            <Button leftIcon={<Icon as={FiRefreshCw} />} variant="outline">
              Refresh
            </Button>
          </Grid>
        </CardBody>
      </Card>

      {/* Tenants Table */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody p={0}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg={useColorModeValue("gray.50", "gray.900")}>
                <Tr>
                  <Th>Tenant</Th>
                  <Th>Plan</Th>
                  <Th>Status</Th>
                  <Th>Users</Th>
                  <Th>Storage</Th>
                  <Th>Revenue</Th>
                  <Th>Last Activity</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTenants.map((tenant) => (
                  <Tr key={tenant.id}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar
                          size="sm"
                          name={tenant.name}
                          src={tenant.admin.avatar}
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium" fontSize="sm">
                            {tenant.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {tenant.subdomain}.platform.com
                          </Text>
                          <Text fontSize="xs" color="blue.600">
                            {tenant.admin.email}
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={getPlanColor(tenant.plan)}
                        variant="solid"
                        textTransform="capitalize"
                      >
                        {tenant.plan}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Icon
                          as={
                            tenant.status === "active"
                              ? FiCheckCircle
                              : tenant.status === "suspended"
                                ? FiXCircle
                                : tenant.status === "trial"
                                  ? FiClock
                                  : FiAlertTriangle
                          }
                          color={getStatusColor(tenant.status) + ".500"}
                        />
                        <Badge
                          colorScheme={getStatusColor(tenant.status)}
                          variant="solid"
                          textTransform="capitalize"
                        >
                          {tenant.status}
                        </Badge>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {tenant.users.active}/{tenant.users.total}
                        </Text>
                        <Progress
                          value={
                            (tenant.users.total / tenant.users.limit) * 100
                          }
                          size="sm"
                          colorScheme="blue"
                          w="60px"
                        />
                        <Text fontSize="xs" color="gray.600">
                          of {tenant.users.limit} limit
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {tenant.storage.used}
                          {tenant.storage.unit}
                        </Text>
                        <Progress
                          value={
                            (tenant.storage.used / tenant.storage.limit) * 100
                          }
                          size="sm"
                          colorScheme={
                            tenant.storage.used / tenant.storage.limit > 0.8
                              ? "red"
                              : "green"
                          }
                          w="60px"
                        />
                        <Text fontSize="xs" color="gray.600">
                          of {tenant.storage.limit}
                          {tenant.storage.unit}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="green.600"
                        >
                          ${tenant.billing.amount}/
                          {tenant.billing.period === "monthly" ? "mo" : "yr"}
                        </Text>
                        <Badge
                          colorScheme={getBillingStatusColor(
                            tenant.billing.status,
                          )}
                          size="sm"
                          variant="outline"
                        >
                          {tenant.billing.status}
                        </Badge>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm">
                        {new Date(tenant.lastActivity).toLocaleDateString()}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {new Date(tenant.lastActivity).toLocaleTimeString()}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Tooltip label="View Details">
                          <IconButton
                            aria-label="View details"
                            icon={<Icon as={FiEye} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(tenant)}
                          />
                        </Tooltip>
                        <Tooltip label="Edit Tenant">
                          <IconButton
                            aria-label="Edit tenant"
                            icon={<Icon as={FiEdit} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTenant(tenant)}
                          />
                        </Tooltip>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More actions"
                            icon={<Icon as={FiMoreVertical} />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            {tenant.status === "active" ? (
                              <MenuItem
                                icon={<Icon as={FiXCircle} />}
                                onClick={() => handleSuspendTenant(tenant.id)}
                              >
                                Suspend Tenant
                              </MenuItem>
                            ) : (
                              <MenuItem
                                icon={<Icon as={FiCheckCircle} />}
                                onClick={() => handleActivateTenant(tenant.id)}
                              >
                                Activate Tenant
                              </MenuItem>
                            )}
                            <MenuItem icon={<Icon as={FiBarChart} />}>
                              View Analytics
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiDollarSign} />}>
                              Billing Details
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiSettings} />}>
                              Configuration
                            </MenuItem>
                            <Divider />
                            <MenuItem
                              icon={<Icon as={FiTrash2} />}
                              color="red.500"
                            >
                              Delete Tenant
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {filteredTenants.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">
                No tenants found matching your criteria
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Tenant Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedTenant?.name} - Tenant Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTenant && (
              <Tabs variant="enclosed" colorScheme="blue">
                <TabList>
                  <Tab>Overview</Tab>
                  <Tab>Usage & Performance</Tab>
                  <Tab>Billing</Tab>
                  <Tab>Features</Tab>
                  <Tab>Settings</Tab>
                </TabList>

                <TabPanels>
                  {/* Overview Tab */}
                  <TabPanel>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <Card border="1px" borderColor={borderColor}>
                        <CardHeader>
                          <Heading size="sm">Tenant Information</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="gray.600">
                                Name:
                              </Text>
                              <Text fontSize="sm" fontWeight="medium">
                                {selectedTenant.name}
                              </Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="gray.600">
                                Domain:
                              </Text>
                              <Text fontSize="sm">{selectedTenant.domain}</Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="gray.600">
                                Subdomain:
                              </Text>
                              <Code fontSize="sm">
                                {selectedTenant.subdomain}.platform.com
                              </Code>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="gray.600">
                                Created:
                              </Text>
                              <Text fontSize="sm">
                                {new Date(
                                  selectedTenant.createdAt,
                                ).toLocaleDateString()}
                              </Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm" color="gray.600">
                                Status:
                              </Text>
                              <Badge
                                colorScheme={getStatusColor(
                                  selectedTenant.status,
                                )}
                              >
                                {selectedTenant.status}
                              </Badge>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card border="1px" borderColor={borderColor}>
                        <CardHeader>
                          <Heading size="sm">Admin Contact</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={3} align="center">
                            <Avatar
                              size="lg"
                              name={selectedTenant.admin.name}
                              src={selectedTenant.admin.avatar}
                            />
                            <VStack spacing={1}>
                              <Text fontWeight="medium">
                                {selectedTenant.admin.name}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                {selectedTenant.admin.email}
                              </Text>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </Grid>
                  </TabPanel>

                  {/* Usage & Performance Tab */}
                  <TabPanel>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <Card border="1px" borderColor={borderColor}>
                        <CardHeader>
                          <Heading size="sm">Resource Usage</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4}>
                            <Box w="full">
                              <Flex justify="space-between" mb={2}>
                                <Text fontSize="sm">CPU Usage</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {tenantUsage.cpu}%
                                </Text>
                              </Flex>
                              <Progress
                                value={tenantUsage.cpu}
                                colorScheme="blue"
                                size="sm"
                              />
                            </Box>
                            <Box w="full">
                              <Flex justify="space-between" mb={2}>
                                <Text fontSize="sm">Memory Usage</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {tenantUsage.memory}%
                                </Text>
                              </Flex>
                              <Progress
                                value={tenantUsage.memory}
                                colorScheme="green"
                                size="sm"
                              />
                            </Box>
                            <Box w="full">
                              <Flex justify="space-between" mb={2}>
                                <Text fontSize="sm">Storage Usage</Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  {tenantUsage.storage}%
                                </Text>
                              </Flex>
                              <Progress
                                value={tenantUsage.storage}
                                colorScheme="orange"
                                size="sm"
                              />
                            </Box>
                          </VStack>
                        </CardBody>
                      </Card>

                      <Card border="1px" borderColor={borderColor}>
                        <CardHeader>
                          <Heading size="sm">Performance Metrics</Heading>
                        </CardHeader>
                        <CardBody>
                          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <VStack>
                              <CircularProgress
                                value={85}
                                color="green"
                                size="60px"
                              >
                                <CircularProgressLabel fontSize="sm">
                                  85%
                                </CircularProgressLabel>
                              </CircularProgress>
                              <Text fontSize="sm" textAlign="center">
                                Uptime
                              </Text>
                            </VStack>
                            <VStack>
                              <CircularProgress
                                value={72}
                                color="blue"
                                size="60px"
                              >
                                <CircularProgressLabel fontSize="sm">
                                  72ms
                                </CircularProgressLabel>
                              </CircularProgress>
                              <Text fontSize="sm" textAlign="center">
                                Avg Response
                              </Text>
                            </VStack>
                            <VStack>
                              <CircularProgress
                                value={94}
                                color="purple"
                                size="60px"
                              >
                                <CircularProgressLabel fontSize="sm">
                                  94%
                                </CircularProgressLabel>
                              </CircularProgress>
                              <Text fontSize="sm" textAlign="center">
                                Success Rate
                              </Text>
                            </VStack>
                            <VStack>
                              <CircularProgress
                                value={selectedTenant.metrics.satisfaction * 20}
                                color="orange"
                                size="60px"
                              >
                                <CircularProgressLabel fontSize="sm">
                                  {selectedTenant.metrics.satisfaction}
                                </CircularProgressLabel>
                              </CircularProgress>
                              <Text fontSize="sm" textAlign="center">
                                Satisfaction
                              </Text>
                            </VStack>
                          </Grid>
                        </CardBody>
                      </Card>
                    </Grid>
                  </TabPanel>

                  {/* Billing Tab */}
                  <TabPanel>
                    <VStack spacing={6} align="stretch">
                      <Card border="1px" borderColor={borderColor}>
                        <CardHeader>
                          <Heading size="sm">Current Billing</Heading>
                        </CardHeader>
                        <CardBody>
                          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                            <VStack>
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="green.600"
                              >
                                ${selectedTenant.billing.amount}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Monthly Cost
                              </Text>
                            </VStack>
                            <VStack>
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="blue.600"
                              >
                                {selectedTenant.billing.period}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                Billing Period
                              </Text>
                            </VStack>
                            <VStack>
                              <Badge
                                colorScheme={getBillingStatusColor(
                                  selectedTenant.billing.status,
                                )}
                                variant="solid"
                              >
                                {selectedTenant.billing.status}
                              </Badge>
                              <Text fontSize="sm" color="gray.600">
                                Status
                              </Text>
                            </VStack>
                          </Grid>
                        </CardBody>
                      </Card>
                    </VStack>
                  </TabPanel>

                  {/* Features Tab */}
                  <TabPanel>
                    <Card border="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="sm">Enabled Features</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={2} align="stretch">
                          {selectedTenant.features.map((feature, index) => (
                            <HStack
                              key={index}
                              justify="space-between"
                              p={3}
                              bg="gray.50"
                              borderRadius="md"
                            >
                              <Text fontSize="sm">{feature}</Text>
                              <Badge colorScheme="green" variant="solid">
                                Enabled
                              </Badge>
                            </HStack>
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Settings Tab */}
                  <TabPanel>
                    <Card border="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="sm">Tenant Configuration</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text color="gray.500" textAlign="center" py={8}>
                          Tenant configuration settings would go here
                        </Text>
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onDetailsClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TenantManagementPage;
