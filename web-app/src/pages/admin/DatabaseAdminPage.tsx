import React, { useState } from "react";
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
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
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
  useDisclosure,
  useToast,
  useColorModeValue,
  Icon,
  Code,
  Divider,
  MenuList,
  MenuItem,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import {
  FiDatabase,
  FiPlay,
  FiRefreshCw,
  FiDownload,
  FiUpload,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiSettings,
  FiActivity,
  FiBarChart,
  FiCpu,
  FiHardDrive,
  FiClock,
  FiMoreVertical,
  FiTable,
  FiColumns,
  FiKey,
  FiLink,
  FiSave,
  FiEye,
  FiCode,
} from "react-icons/fi";

interface DatabaseConnection {
  id: string;
  name: string;
  type:
    | "postgresql"
    | "mysql"
    | "mongodb"
    | "dynamodb"
    | "cosmosdb"
    | "firestore";
  host: string;
  port: number;
  database: string;
  status: "connected" | "disconnected" | "error";
  lastConnected: string;
  connectionPool: {
    active: number;
    idle: number;
    total: number;
  };
  performance: {
    queries: number;
    avgResponseTime: number;
    throughput: number;
  };
}

interface DatabaseSchema {
  name: string;
  tables: Table[];
  views: number;
  functions: number;
  size: string;
}

interface Table {
  name: string;
  columns: Column[];
  rows: number;
  size: string;
  lastModified: string;
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: string;
  defaultValue?: string;
}

const DatabaseAdminPage: React.FC = () => {
  const toast = useToast();
  const {
    isOpen: isQueryOpen,
    onOpen: onQueryOpen,
    onClose: onQueryClose,
  } = useDisclosure();
  const {
    isOpen: isSchemaOpen,
    onOpen: onSchemaOpen,
    onClose: onSchemaClose,
  } = useDisclosure();
  const {
    isOpen: isConnectionOpen,
    onOpen: onConnectionOpen,
    onClose: onConnectionClose,
  } = useDisclosure();

  const [connections, setConnections] = useState<DatabaseConnection[]>([
    {
      id: "1",
      name: "Production PostgreSQL",
      type: "postgresql",
      host: "prod-db.company.com",
      port: 5432,
      database: "main_app",
      status: "connected",
      lastConnected: "2024-01-15 10:30:00",
      connectionPool: { active: 12, idle: 8, total: 20 },
      performance: { queries: 1247, avgResponseTime: 45, throughput: 2.3 },
    },
    {
      id: "2",
      name: "Analytics MongoDB",
      type: "mongodb",
      host: "analytics-cluster.company.com",
      port: 27017,
      database: "analytics",
      status: "connected",
      lastConnected: "2024-01-15 10:25:00",
      connectionPool: { active: 8, idle: 12, total: 20 },
      performance: { queries: 892, avgResponseTime: 32, throughput: 1.8 },
    },
    {
      id: "3",
      name: "Cache Redis",
      type: "mysql",
      host: "cache.company.com",
      port: 6379,
      database: "cache",
      status: "connected",
      lastConnected: "2024-01-15 10:28:00",
      connectionPool: { active: 5, idle: 15, total: 20 },
      performance: { queries: 3456, avgResponseTime: 12, throughput: 5.2 },
    },
    {
      id: "4",
      name: "Archive DynamoDB",
      type: "dynamodb",
      host: "us-east-1.amazonaws.com",
      port: 443,
      database: "archive-data",
      status: "disconnected",
      lastConnected: "2024-01-15 09:15:00",
      connectionPool: { active: 0, idle: 0, total: 10 },
      performance: { queries: 0, avgResponseTime: 0, throughput: 0 },
    },
  ]);

  const [currentConnection, setCurrentConnection] =
    useState<DatabaseConnection>(connections[0]);
  const [queryText, setQueryText] = useState("");
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>("");

  const [schemas, setSchemas] = useState<DatabaseSchema[]>([
    {
      name: "main_app",
      tables: [
        {
          name: "users",
          columns: [
            { name: "id", type: "uuid", nullable: false, primaryKey: true },
            {
              name: "email",
              type: "varchar(255)",
              nullable: false,
              primaryKey: false,
            },
            {
              name: "first_name",
              type: "varchar(100)",
              nullable: false,
              primaryKey: false,
            },
            {
              name: "last_name",
              type: "varchar(100)",
              nullable: false,
              primaryKey: false,
            },
            {
              name: "created_at",
              type: "timestamp",
              nullable: false,
              primaryKey: false,
              defaultValue: "now()",
            },
            {
              name: "role_id",
              type: "uuid",
              nullable: false,
              primaryKey: false,
              foreignKey: "roles.id",
            },
          ],
          rows: 1247,
          size: "2.3 MB",
          lastModified: "2024-01-15 09:30:00",
        },
        {
          name: "projects",
          columns: [
            { name: "id", type: "uuid", nullable: false, primaryKey: true },
            {
              name: "name",
              type: "varchar(255)",
              nullable: false,
              primaryKey: false,
            },
            {
              name: "description",
              type: "text",
              nullable: true,
              primaryKey: false,
            },
            {
              name: "user_id",
              type: "uuid",
              nullable: false,
              primaryKey: false,
              foreignKey: "users.id",
            },
            {
              name: "created_at",
              type: "timestamp",
              nullable: false,
              primaryKey: false,
              defaultValue: "now()",
            },
          ],
          rows: 3456,
          size: "5.7 MB",
          lastModified: "2024-01-15 10:15:00",
        },
        {
          name: "roles",
          columns: [
            { name: "id", type: "uuid", nullable: false, primaryKey: true },
            {
              name: "name",
              type: "varchar(50)",
              nullable: false,
              primaryKey: false,
            },
            {
              name: "permissions",
              type: "jsonb",
              nullable: true,
              primaryKey: false,
            },
          ],
          rows: 12,
          size: "4 KB",
          lastModified: "2024-01-10 14:20:00",
        },
      ],
      views: 5,
      functions: 3,
      size: "125.8 MB",
    },
  ]);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const codeBg = useColorModeValue("gray.50", "gray.900");

  const getDatabaseIcon = (type: string) => {
    switch (type) {
      case "postgresql":
        return "🐘";
      case "mysql":
        return "🐬";
      case "mongodb":
        return "🍃";
      case "dynamodb":
        return "⚡";
      case "cosmosdb":
        return "🌌";
      case "firestore":
        return "🔥";
      default:
        return "🗄️";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "green";
      case "disconnected":
        return "gray";
      case "error":
        return "red";
      default:
        return "gray";
    }
  };

  const handleExecuteQuery = async () => {
    if (!queryText.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a SQL query to execute",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setQueryLoading(true);
    try {
      // Mock API call to execute query
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock result data
      const mockResults = [
        {
          id: 1,
          email: "john@example.com",
          first_name: "John",
          last_name: "Doe",
          created_at: "2024-01-15",
        },
        {
          id: 2,
          email: "jane@example.com",
          first_name: "Jane",
          last_name: "Smith",
          created_at: "2024-01-14",
        },
        {
          id: 3,
          email: "bob@example.com",
          first_name: "Bob",
          last_name: "Wilson",
          created_at: "2024-01-13",
        },
      ];

      setQueryResults(mockResults);
      toast({
        title: "Query Executed",
        description: `Query completed successfully. ${mockResults.length} rows returned.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Query Error",
        description: "Failed to execute query. Please check your syntax.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setQueryLoading(false);
    }
  };

  const handleConnectionSwitch = (connection: DatabaseConnection) => {
    setCurrentConnection(connection);
    toast({
      title: "Database Switched",
      description: `Connected to ${connection.name}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
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
            Database Administration
          </Heading>
          <Text color="gray.600">Multi-database management and monitoring</Text>
        </Box>
        <VStack spacing={3} w={{ base: "full", md: "auto" }}>
          <Button
            leftIcon={<Icon as={FiUpload} />}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Import Schema
          </Button>
          <Button
            leftIcon={<Icon as={FiDownload} />}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Export Data
          </Button>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={onConnectionOpen}
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Add Connection
          </Button>
        </VStack>
      </Flex>

      {/* Database Connections Overview */}
      <Grid
        templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gap={4}
        mb={6}
      >
        {connections.map((conn) => (
          <Card
            key={conn.id}
            bg={cardBg}
            border="1px"
            borderColor={
              currentConnection.id === conn.id ? "blue.300" : borderColor
            }
            cursor="pointer"
            onClick={() => handleConnectionSwitch(conn)}
            _hover={{ borderColor: "blue.200" }}
          >
            <CardBody>
              <Flex justify="space-between" align="start" mb={3}>
                <HStack spacing={3}>
                  <Text fontSize="2xl">{getDatabaseIcon(conn.type)}</Text>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" fontSize="sm">
                      {conn.name}
                    </Text>
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      textTransform="uppercase"
                    >
                      {conn.type}
                    </Text>
                  </VStack>
                </HStack>
                <Badge
                  colorScheme={getStatusColor(conn.status)}
                  variant="solid"
                >
                  {conn.status}
                </Badge>
              </Flex>

              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="xs" color="gray.600">
                    Host:
                  </Text>
                  <Text fontSize="xs">
                    {conn.host}:{conn.port}
                  </Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="xs" color="gray.600">
                    Database:
                  </Text>
                  <Text fontSize="xs">{conn.database}</Text>
                </HStack>
                {conn.status === "connected" && (
                  <>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.600">
                        Pool:
                      </Text>
                      <Text fontSize="xs">
                        {conn.connectionPool.active}/{conn.connectionPool.total}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.600">
                        Avg Response:
                      </Text>
                      <Text fontSize="xs">
                        {conn.performance.avgResponseTime}ms
                      </Text>
                    </HStack>
                  </>
                )}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Main Database Interface */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Query Editor</Tab>
          <Tab>Schema Browser</Tab>
          <Tab>Data Explorer</Tab>
          <Tab>Performance</Tab>
          <Tab>Migrations</Tab>
        </TabList>

        <TabPanels>
          {/* Query Editor Tab */}
          <TabPanel p={0} pt={6}>
            <Grid templateRows="auto 1fr auto" gap={4} h="600px">
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader pb={3}>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">SQL Query Editor</Heading>
                    <HStack spacing={2}>
                      <Select size="sm" value={currentConnection.id} w="200px">
                        {connections.map((conn) => (
                          <option key={conn.id} value={conn.id}>
                            {conn.name}
                          </option>
                        ))}
                      </Select>
                      <Button
                        leftIcon={<Icon as={FiPlay} />}
                        colorScheme="blue"
                        size="sm"
                        onClick={handleExecuteQuery}
                        isLoading={queryLoading}
                        loadingText="Executing..."
                      >
                        Execute
                      </Button>
                    </HStack>
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <Box position="relative">
                    <Textarea
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="SELECT * FROM users WHERE created_at > '2024-01-01';"
                      bg={codeBg}
                      fontFamily="mono"
                      fontSize="sm"
                      rows={8}
                      resize="vertical"
                    />
                    <Text
                      position="absolute"
                      bottom={2}
                      right={3}
                      fontSize="xs"
                      color="gray.500"
                    >
                      {queryText.length} characters
                    </Text>
                  </Box>
                </CardBody>
              </Card>

              {/* Query Results */}
              <Card bg={cardBg} border="1px" borderColor={borderColor} flex={1}>
                <CardHeader pb={3}>
                  <Flex justify="space-between" align="center">
                    <Heading size="sm">Query Results</Heading>
                    {queryResults.length > 0 && (
                      <Badge colorScheme="blue">
                        {queryResults.length} rows
                      </Badge>
                    )}
                  </Flex>
                </CardHeader>
                <CardBody pt={0} overflow="auto">
                  {queryResults.length > 0 ? (
                    <Box overflowX="auto">
                      <Table size="sm" variant="simple">
                        <Thead>
                          <Tr>
                            {Object.keys(queryResults[0]).map((key) => (
                              <Th key={key}>{key}</Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {queryResults.map((row, index) => (
                            <Tr key={index}>
                              {Object.values(row).map(
                                (value: any, cellIndex) => (
                                  <Td key={cellIndex}>
                                    <Text fontSize="sm">{String(value)}</Text>
                                  </Td>
                                ),
                              )}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  ) : (
                    <Box textAlign="center" py={8} color="gray.500">
                      <Icon as={FiDatabase} fontSize="3xl" mb={3} />
                      <Text>Execute a query to see results here</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>

          {/* Schema Browser Tab */}
          <TabPanel p={0} pt={6}>
            <Grid templateColumns="300px 1fr" gap={6} h="600px">
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="sm">Database Schema</Heading>
                </CardHeader>
                <CardBody overflow="auto">
                  <VStack spacing={3} align="stretch">
                    {schemas[0].tables.map((table) => (
                      <Box
                        key={table.name}
                        p={3}
                        border="1px"
                        borderColor={
                          selectedTable === table.name
                            ? "blue.300"
                            : borderColor
                        }
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => setSelectedTable(table.name)}
                        _hover={{ borderColor: "blue.200" }}
                      >
                        <HStack justify="space-between" mb={2}>
                          <HStack spacing={2}>
                            <Icon as={FiTable} color="blue.500" />
                            <Text fontWeight="medium" fontSize="sm">
                              {table.name}
                            </Text>
                          </HStack>
                          <Badge colorScheme="gray" size="sm">
                            {table.rows}
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.600">
                          {table.columns.length} columns • {table.size}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="sm">
                      {selectedTable
                        ? `Table: ${selectedTable}`
                        : "Select a table"}
                    </Heading>
                    {selectedTable && (
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Icon as={FiEdit} />}
                        >
                          Edit Schema
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Icon as={FiEye} />}
                        >
                          View Data
                        </Button>
                      </HStack>
                    )}
                  </Flex>
                </CardHeader>
                <CardBody overflow="auto">
                  {selectedTable ? (
                    <Box>
                      {schemas[0].tables
                        .find((t) => t.name === selectedTable)
                        ?.columns.map((column) => (
                          <Box
                            key={column.name}
                            p={3}
                            border="1px"
                            borderColor={borderColor}
                            borderRadius="md"
                            mb={2}
                          >
                            <HStack justify="space-between" mb={1}>
                              <HStack spacing={3}>
                                <Icon as={FiColumns} color="gray.500" />
                                <Text fontWeight="medium" fontSize="sm">
                                  {column.name}
                                </Text>
                                {column.primaryKey && (
                                  <Icon as={FiKey} color="yellow.500" />
                                )}
                                {column.foreignKey && (
                                  <Icon as={FiLink} color="blue.500" />
                                )}
                              </HStack>
                              <Code fontSize="xs" colorScheme="gray">
                                {column.type}
                              </Code>
                            </HStack>
                            <HStack spacing={4}>
                              <Text fontSize="xs" color="gray.600">
                                Nullable: {column.nullable ? "Yes" : "No"}
                              </Text>
                              {column.defaultValue && (
                                <Text fontSize="xs" color="gray.600">
                                  Default: {column.defaultValue}
                                </Text>
                              )}
                              {column.foreignKey && (
                                <Text fontSize="xs" color="blue.600">
                                  References: {column.foreignKey}
                                </Text>
                              )}
                            </HStack>
                          </Box>
                        ))}
                    </Box>
                  ) : (
                    <Box textAlign="center" py={8} color="gray.500">
                      <Icon as={FiTable} fontSize="3xl" mb={3} />
                      <Text>Select a table to view its schema</Text>
                    </Box>
                  )}
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>

          {/* Data Explorer Tab */}
          <TabPanel p={0} pt={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="sm">Data Explorer</Heading>
                  <HStack spacing={2}>
                    <Select size="sm" placeholder="Select table" w="200px">
                      {schemas[0].tables.map((table) => (
                        <option key={table.name} value={table.name}>
                          {table.name}
                        </option>
                      ))}
                    </Select>
                    <InputGroup size="sm" w="200px">
                      <InputLeftElement>
                        <Icon as={FiSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input placeholder="Search data..." />
                    </InputGroup>
                    <Button size="sm" leftIcon={<Icon as={FiRefreshCw} />}>
                      Refresh
                    </Button>
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody>
                <Box textAlign="center" py={12} color="gray.500">
                  <Icon as={FiSearch} fontSize="4xl" mb={4} />
                  <Text fontSize="lg" mb={2}>
                    Select a table to explore data
                  </Text>
                  <Text fontSize="sm">
                    Browse, search, and edit your database records
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Performance Tab */}
          <TabPanel p={0} pt={6}>
            <Grid
              templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
              gap={4}
            >
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="sm">Connection Pool Status</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <CircularProgress
                      value={
                        (currentConnection.connectionPool.active /
                          currentConnection.connectionPool.total) *
                        100
                      }
                      color="blue"
                      size="120px"
                      thickness="8px"
                    >
                      <CircularProgressLabel fontSize="sm">
                        {currentConnection.connectionPool.active}/
                        {currentConnection.connectionPool.total}
                      </CircularProgressLabel>
                    </CircularProgress>
                    <VStack spacing={2} w="full">
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">
                          Active:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {currentConnection.connectionPool.active}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">
                          Idle:
                        </Text>
                        <Text fontSize="sm">
                          {currentConnection.connectionPool.idle}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">
                          Total:
                        </Text>
                        <Text fontSize="sm">
                          {currentConnection.connectionPool.total}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="sm">Query Performance</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <Stat textAlign="center">
                      <StatLabel>Average Response Time</StatLabel>
                      <StatNumber color="green.500">
                        {currentConnection.performance.avgResponseTime}ms
                      </StatNumber>
                      <StatHelpText>Excellent performance</StatHelpText>
                    </Stat>
                    <Divider />
                    <VStack spacing={2} w="full">
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">
                          Total Queries:
                        </Text>
                        <Text fontSize="sm" fontWeight="bold">
                          {currentConnection.performance.queries.toLocaleString()}
                        </Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" color="gray.600">
                          Throughput:
                        </Text>
                        <Text fontSize="sm">
                          {currentConnection.performance.throughput} q/s
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="sm">Database Health</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <HStack spacing={4} w="full">
                      <Icon as={FiActivity} color="green.500" fontSize="xl" />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          System Status
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          All systems operational
                        </Text>
                      </VStack>
                      <Badge colorScheme="green">Healthy</Badge>
                    </HStack>
                    <Divider />
                    <VStack spacing={3} w="full">
                      <HStack justify="space-between" w="full">
                        <HStack spacing={2}>
                          <Icon as={FiCpu} color="blue.500" />
                          <Text fontSize="sm">CPU Usage</Text>
                        </HStack>
                        <Text fontSize="sm">23%</Text>
                      </HStack>
                      <Progress
                        value={23}
                        colorScheme="blue"
                        size="sm"
                        borderRadius="md"
                      />

                      <HStack justify="space-between" w="full">
                        <HStack spacing={2}>
                          <Icon as={FiHardDrive} color="green.500" />
                          <Text fontSize="sm">Memory Usage</Text>
                        </HStack>
                        <Text fontSize="sm">67%</Text>
                      </HStack>
                      <Progress
                        value={67}
                        colorScheme="green"
                        size="sm"
                        borderRadius="md"
                      />
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </TabPanel>

          {/* Migrations Tab */}
          <TabPanel p={0} pt={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="sm">Database Migrations</Heading>
                  <Button
                    leftIcon={<Icon as={FiPlus} />}
                    colorScheme="blue"
                    size="sm"
                  >
                    Create Migration
                  </Button>
                </Flex>
              </CardHeader>
              <CardBody>
                <Box textAlign="center" py={12} color="gray.500">
                  <Icon as={FiSettings} fontSize="4xl" mb={4} />
                  <Text fontSize="lg" mb={2}>
                    Migration Management
                  </Text>
                  <Text fontSize="sm">
                    Create, run, and rollback database migrations
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DatabaseAdminPage;
