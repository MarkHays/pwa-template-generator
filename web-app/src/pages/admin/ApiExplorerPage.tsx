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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useToast,
  useColorModeValue,
  Icon,
  IconButton,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  FiPlay,
  FiCode,
  FiBook,
  FiDownload,
  FiSearch,
  FiCopy,
  FiLock,
  FiTrash2,
  FiPlus,
  FiAlertTriangle,
} from "react-icons/fi";

interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: ApiParameter[];
  requestBody?: ApiRequestBody;
  responses: ApiResponse[];
  requiresAuth: boolean;
  deprecated?: boolean;
}

interface ApiParameter {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required: boolean;
  type: string;
  description: string;
  example?: any;
  enum?: string[];
}

interface ApiRequestBody {
  contentType: string;
  schema: any;
  example: any;
  required: boolean;
}

interface ApiResponse {
  statusCode: number;
  description: string;
  contentType?: string;
  schema?: any;
  example?: any;
}

interface TestResponse {
  status: number;
  statusText: string;
  headers: { [key: string]: string };
  data: any;
  responseTime: number;
}

const ApiExplorerPage: React.FC = () => {
  const toast = useToast();
  const {
    isOpen: isSchemaOpen,
    onOpen: onSchemaOpen,
    onClose: onSchemaClose,
  } = useDisclosure();
  const {
    isOpen: isAuthOpen,
    onOpen: onAuthOpen,
    onClose: onAuthClose,
  } = useDisclosure();

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(
    null,
  );
  const [testParameters, setTestParameters] = useState<{ [key: string]: any }>(
    {},
  );
  const [testHeaders, setTestHeaders] = useState<{ [key: string]: string }>({
    "Content-Type": "application/json",
    Authorization: "Bearer your-token-here",
  });
  const [testBody, setTestBody] = useState<string>("");
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [authConfig, setAuthConfig] = useState({
    type: "bearer",
    token: "",
    username: "",
    password: "",
  });

  const [endpoints] = useState<ApiEndpoint[]>([
    {
      id: "1",
      method: "GET",
      path: "/api/users",
      summary: "Get all users",
      description: "Retrieve a list of all users with pagination support",
      tags: ["Users", "Management"],
      parameters: [
        {
          name: "page",
          in: "query",
          required: false,
          type: "integer",
          description: "Page number for pagination",
          example: 1,
        },
        {
          name: "limit",
          in: "query",
          required: false,
          type: "integer",
          description: "Number of items per page",
          example: 10,
        },
        {
          name: "search",
          in: "query",
          required: false,
          type: "string",
          description: "Search term for filtering users",
          example: "john",
        },
      ],
      responses: [
        {
          statusCode: 200,
          description: "Successful response",
          contentType: "application/json",
          example: {
            users: [
              {
                id: "1",
                email: "john@example.com",
                firstName: "John",
                lastName: "Doe",
                role: "admin",
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 100,
              pages: 10,
            },
          },
        },
        {
          statusCode: 400,
          description: "Bad request",
        },
        {
          statusCode: 401,
          description: "Unauthorized",
        },
      ],
      requiresAuth: true,
    },
    {
      id: "2",
      method: "POST",
      path: "/api/users",
      summary: "Create new user",
      description: "Create a new user account with role assignment",
      tags: ["Users", "Management"],
      parameters: [],
      requestBody: {
        contentType: "application/json",
        required: true,
        schema: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            role: { type: "string", enum: ["admin", "user", "manager"] },
            password: { type: "string", minLength: 8 },
          },
          required: ["email", "firstName", "lastName", "role", "password"],
        },
        example: {
          email: "newuser@example.com",
          firstName: "New",
          lastName: "User",
          role: "user",
          password: "securepassword123",
        },
      },
      responses: [
        {
          statusCode: 201,
          description: "User created successfully",
          contentType: "application/json",
          example: {
            id: "123",
            email: "newuser@example.com",
            firstName: "New",
            lastName: "User",
            role: "user",
            createdAt: "2024-01-15T10:30:00Z",
          },
        },
        {
          statusCode: 400,
          description: "Validation error",
        },
        {
          statusCode: 409,
          description: "User already exists",
        },
      ],
      requiresAuth: true,
    },
    {
      id: "3",
      method: "GET",
      path: "/api/users/{id}",
      summary: "Get user by ID",
      description: "Retrieve a specific user by their unique identifier",
      tags: ["Users"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          type: "string",
          description: "User unique identifier",
          example: "123",
        },
      ],
      responses: [
        {
          statusCode: 200,
          description: "User found",
          contentType: "application/json",
          example: {
            id: "123",
            email: "john@example.com",
            firstName: "John",
            lastName: "Doe",
            role: "admin",
            createdAt: "2024-01-01T00:00:00Z",
            lastLogin: "2024-01-15T10:30:00Z",
          },
        },
        {
          statusCode: 404,
          description: "User not found",
        },
      ],
      requiresAuth: true,
    },
    {
      id: "4",
      method: "GET",
      path: "/api/database/schemas",
      summary: "Get database schemas",
      description: "Retrieve all available database schemas and their metadata",
      tags: ["Database"],
      parameters: [],
      responses: [
        {
          statusCode: 200,
          description: "Schemas retrieved successfully",
          contentType: "application/json",
          example: {
            schemas: [
              {
                name: "main_app",
                tables: 15,
                views: 3,
                size: "125.8 MB",
              },
            ],
          },
        },
      ],
      requiresAuth: true,
    },
    {
      id: "5",
      method: "POST",
      path: "/api/database/query",
      summary: "Execute database query",
      description: "Execute a SQL query against the database",
      tags: ["Database"],
      parameters: [],
      requestBody: {
        contentType: "application/json",
        required: true,
        schema: {
          type: "object",
          properties: {
            query: { type: "string" },
            parameters: { type: "array" },
          },
          required: ["query"],
        },
        example: {
          query: "SELECT * FROM users WHERE created_at > ?",
          parameters: ["2024-01-01"],
        },
      },
      responses: [
        {
          statusCode: 200,
          description: "Query executed successfully",
          contentType: "application/json",
          example: {
            rows: [
              { id: 1, email: "user@example.com", created_at: "2024-01-15" },
            ],
            rowCount: 1,
            executionTime: "23ms",
          },
        },
        {
          statusCode: 400,
          description: "Invalid query",
        },
      ],
      requiresAuth: true,
    },
    {
      id: "6",
      method: "GET",
      path: "/api/monitoring/health",
      summary: "System health check",
      description: "Get current system health status and metrics",
      tags: ["Monitoring"],
      parameters: [],
      responses: [
        {
          statusCode: 200,
          description: "Health check successful",
          contentType: "application/json",
          example: {
            status: "healthy",
            timestamp: "2024-01-15T10:30:00Z",
            services: {
              database: "healthy",
              cache: "healthy",
              auth: "healthy",
            },
            metrics: {
              uptime: "15d 8h 45m",
              memory: "67%",
              cpu: "45%",
            },
          },
        },
      ],
      requiresAuth: false,
    },
  ]);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const codeBg = useColorModeValue("gray.50", "gray.900");

  const allTags = [
    "all",
    ...Array.from(new Set(endpoints.flatMap((e) => e.tags))),
  ];

  const filteredEndpoints = endpoints.filter((endpoint) => {
    const matchesSearch =
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.method.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag =
      selectedTag === "all" || endpoint.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "blue";
      case "POST":
        return "green";
      case "PUT":
        return "orange";
      case "DELETE":
        return "red";
      case "PATCH":
        return "purple";
      default:
        return "gray";
    }
  };

  const handleExecuteRequest = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    try {
      // Mock API request - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse: TestResponse = {
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "content-length": "1234",
          server: "PWA Enterprise Server",
        },
        data: selectedEndpoint.responses[0]?.example || { message: "Success" },
        responseTime: Math.floor(Math.random() * 200) + 50,
      };

      setTestResponse(mockResponse);
      toast({
        title: "Request Executed",
        description: `${selectedEndpoint.method} ${selectedEndpoint.path} - ${mockResponse.status} ${mockResponse.statusText}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to execute API request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const generateCurlCommand = () => {
    if (!selectedEndpoint) return "";

    let curl = `curl -X ${selectedEndpoint.method}`;

    // Add headers
    Object.entries(testHeaders).forEach(([key, value]) => {
      curl += ` \\\n  -H "${key}: ${value}"`;
    });

    // Add body for POST/PUT requests
    if (
      ["POST", "PUT", "PATCH"].includes(selectedEndpoint.method) &&
      testBody
    ) {
      curl += ` \\\n  -d '${testBody}'`;
    }

    // Add URL with parameters
    let url = `https://api.company.com${selectedEndpoint.path}`;
    const queryParams = Object.entries(testParameters)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    if (queryParams) {
      url += `?${queryParams}`;
    }

    curl += ` \\\n  "${url}"`;

    return curl;
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
            API Explorer
          </Heading>
          <Text color="gray.600">
            Interactive API testing and documentation
          </Text>
        </Box>
        <VStack spacing={3} w={{ base: "full", md: "auto" }}>
          <Button
            leftIcon={<Icon as={FiLock} />}
            onClick={onAuthOpen}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Authentication
          </Button>
          <Button
            leftIcon={<Icon as={FiBook} />}
            onClick={onSchemaOpen}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            API Schema
          </Button>
          <Button
            leftIcon={<Icon as={FiDownload} />}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Export Collection
          </Button>
        </VStack>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "400px 1fr" }} gap={6}>
        {/* API Endpoints List */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <VStack spacing={3} align="stretch">
              <Flex justify="space-between" align="center">
                <Heading size="md">API Endpoints</Heading>
                <Badge colorScheme="blue">{filteredEndpoints.length}</Badge>
              </Flex>

              <InputGroup size="sm">
                <InputLeftElement>
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <Select
                size="sm"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === "all" ? "All Tags" : tag}
                  </option>
                ))}
              </Select>
            </VStack>
          </CardHeader>
          <CardBody pt={0} maxH="600px" overflow="auto">
            <VStack spacing={2} align="stretch">
              {filteredEndpoints.map((endpoint) => (
                <Box
                  key={endpoint.id}
                  p={3}
                  border="1px"
                  borderColor={
                    selectedEndpoint?.id === endpoint.id
                      ? "blue.300"
                      : borderColor
                  }
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => setSelectedEndpoint(endpoint)}
                  _hover={{ borderColor: "blue.200" }}
                >
                  <HStack justify="space-between" mb={2}>
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={getMethodColor(endpoint.method)}
                        variant="solid"
                        fontSize="xs"
                      >
                        {endpoint.method}
                      </Badge>
                      {endpoint.requiresAuth && (
                        <Icon as={FiLock} color="orange.500" fontSize="sm" />
                      )}
                      {endpoint.deprecated && (
                        <Icon
                          as={FiAlertTriangle}
                          color="red.500"
                          fontSize="sm"
                        />
                      )}
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>
                    {endpoint.path}
                  </Text>
                  <Text fontSize="xs" color="gray.600" mb={2}>
                    {endpoint.summary}
                  </Text>
                  <HStack spacing={1} flexWrap="wrap">
                    {endpoint.tags.map((tag) => (
                      <Badge
                        key={tag}
                        colorScheme="gray"
                        size="sm"
                        variant="outline"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* API Testing Interface */}
        <VStack spacing={6} align="stretch">
          {selectedEndpoint ? (
            <>
              {/* Endpoint Details */}
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <HStack spacing={3}>
                        <Badge
                          colorScheme={getMethodColor(selectedEndpoint.method)}
                          variant="solid"
                        >
                          {selectedEndpoint.method}
                        </Badge>
                        <Text fontSize="lg" fontWeight="bold">
                          {selectedEndpoint.path}
                        </Text>
                        {selectedEndpoint.requiresAuth && (
                          <Icon as={FiLock} color="orange.500" />
                        )}
                      </HStack>
                      <Text color="gray.600">{selectedEndpoint.summary}</Text>
                    </VStack>
                    <Button
                      leftIcon={<Icon as={FiPlay} />}
                      colorScheme="blue"
                      onClick={handleExecuteRequest}
                      isLoading={isLoading}
                      loadingText="Executing..."
                    >
                      Execute
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Text fontSize="sm" color="gray.600">
                    {selectedEndpoint.description}
                  </Text>
                </CardBody>
              </Card>

              {/* Request Configuration */}
              <Tabs variant="enclosed" colorScheme="blue">
                <TabList>
                  <Tab>Parameters</Tab>
                  <Tab>Headers</Tab>
                  {["POST", "PUT", "PATCH"].includes(
                    selectedEndpoint.method,
                  ) && <Tab>Body</Tab>}
                  <Tab>cURL</Tab>
                </TabList>

                <TabPanels>
                  {/* Parameters Tab */}
                  <TabPanel p={0} pt={4}>
                    <Card bg={cardBg} border="1px" borderColor={borderColor}>
                      <CardBody>
                        {selectedEndpoint.parameters.length > 0 ? (
                          <VStack spacing={4} align="stretch">
                            {selectedEndpoint.parameters.map((param) => (
                              <FormControl key={param.name}>
                                <FormLabel fontSize="sm" fontWeight="medium">
                                  {param.name}
                                  {param.required && (
                                    <Text as="span" color="red.500">
                                      {" "}
                                      *
                                    </Text>
                                  )}
                                  <Badge ml={2} colorScheme="gray" size="sm">
                                    {param.in}
                                  </Badge>
                                </FormLabel>
                                <Input
                                  size="sm"
                                  placeholder={
                                    param.example?.toString() ||
                                    `Enter ${param.name}`
                                  }
                                  value={testParameters[param.name] || ""}
                                  onChange={(e) =>
                                    setTestParameters((prev) => ({
                                      ...prev,
                                      [param.name]: e.target.value,
                                    }))
                                  }
                                />
                                <Text fontSize="xs" color="gray.600" mt={1}>
                                  {param.description}
                                </Text>
                              </FormControl>
                            ))}
                          </VStack>
                        ) : (
                          <Text color="gray.500" textAlign="center" py={4}>
                            No parameters required
                          </Text>
                        )}
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Headers Tab */}
                  <TabPanel p={0} pt={4}>
                    <Card bg={cardBg} border="1px" borderColor={borderColor}>
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          {Object.entries(testHeaders).map(([key, value]) => (
                            <HStack key={key} spacing={3}>
                              <Input
                                size="sm"
                                placeholder="Header name"
                                value={key}
                                onChange={(e) => {
                                  const newHeaders = { ...testHeaders };
                                  delete newHeaders[key];
                                  newHeaders[e.target.value] = value;
                                  setTestHeaders(newHeaders);
                                }}
                                flex={1}
                              />
                              <Input
                                size="sm"
                                placeholder="Header value"
                                value={value}
                                onChange={(e) =>
                                  setTestHeaders((prev) => ({
                                    ...prev,
                                    [key]: e.target.value,
                                  }))
                                }
                                flex={2}
                              />
                              <IconButton
                                aria-label="Remove header"
                                icon={<Icon as={FiTrash2} />}
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const newHeaders = { ...testHeaders };
                                  delete newHeaders[key];
                                  setTestHeaders(newHeaders);
                                }}
                              />
                            </HStack>
                          ))}
                          <Button
                            leftIcon={<Icon as={FiPlus} />}
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setTestHeaders((prev) => ({ ...prev, "": "" }))
                            }
                          >
                            Add Header
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  </TabPanel>

                  {/* Body Tab */}
                  {["POST", "PUT", "PATCH"].includes(
                    selectedEndpoint.method,
                  ) && (
                    <TabPanel p={0} pt={4}>
                      <Card bg={cardBg} border="1px" borderColor={borderColor}>
                        <CardBody>
                          <VStack spacing={3} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="sm" fontWeight="medium">
                                Request Body
                              </Text>
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={() =>
                                  setTestBody(
                                    JSON.stringify(
                                      selectedEndpoint.requestBody?.example ||
                                        {},
                                      null,
                                      2,
                                    ),
                                  )
                                }
                              >
                                Use Example
                              </Button>
                            </HStack>
                            <Textarea
                              value={testBody}
                              onChange={(e) => setTestBody(e.target.value)}
                              placeholder={JSON.stringify(
                                selectedEndpoint.requestBody?.example || {},
                                null,
                                2,
                              )}
                              bg={codeBg}
                              fontFamily="mono"
                              fontSize="sm"
                              rows={10}
                            />
                          </VStack>
                        </CardBody>
                      </Card>
                    </TabPanel>
                  )}

                  {/* cURL Tab */}
                  <TabPanel p={0} pt={4}>
                    <Card bg={cardBg} border="1px" borderColor={borderColor}>
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <HStack justify="space-between">
                            <Text fontSize="sm" fontWeight="medium">
                              cURL Command
                            </Text>
                            <Button
                              size="xs"
                              leftIcon={<Icon as={FiCopy} />}
                              onClick={() =>
                                copyToClipboard(generateCurlCommand())
                              }
                            >
                              Copy
                            </Button>
                          </HStack>
                          <Box
                            bg={codeBg}
                            p={4}
                            borderRadius="md"
                            fontSize="sm"
                            overflow="auto"
                            maxH="300px"
                            fontFamily="mono"
                            whiteSpace="pre-wrap"
                          >
                            {generateCurlCommand()}
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              {/* Response */}
              {testResponse && (
                <Card bg={cardBg} border="1px" borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Text fontSize="md" fontWeight="bold">
                          Response
                        </Text>
                        <Badge
                          colorScheme={
                            testResponse.status < 300
                              ? "green"
                              : testResponse.status < 400
                                ? "yellow"
                                : "red"
                          }
                          variant="solid"
                        >
                          {testResponse.status} {testResponse.statusText}
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                          {testResponse.responseTime}ms
                        </Text>
                      </HStack>
                      <Button
                        size="sm"
                        leftIcon={<Icon as={FiCopy} />}
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(testResponse.data, null, 2),
                          )
                        }
                      >
                        Copy Response
                      </Button>
                    </HStack>
                  </CardHeader>
                  <CardBody pt={0}>
                    <Tabs size="sm" variant="enclosed">
                      <TabList>
                        <Tab>Body</Tab>
                        <Tab>Headers</Tab>
                      </TabList>
                      <TabPanels>
                        <TabPanel p={0} pt={3}>
                          <Box
                            bg={codeBg}
                            p={4}
                            borderRadius="md"
                            fontSize="sm"
                            overflow="auto"
                            maxH="400px"
                            fontFamily="mono"
                            whiteSpace="pre-wrap"
                          >
                            {JSON.stringify(testResponse.data, null, 2)}
                          </Box>
                        </TabPanel>
                        <TabPanel p={0} pt={3}>
                          <VStack spacing={2} align="stretch">
                            {Object.entries(testResponse.headers).map(
                              ([key, value]) => (
                                <HStack key={key} justify="space-between">
                                  <Text fontSize="sm" fontWeight="medium">
                                    {key}:
                                  </Text>
                                  <Text fontSize="sm" color="gray.600">
                                    {value}
                                  </Text>
                                </HStack>
                              ),
                            )}
                          </VStack>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </CardBody>
                </Card>
              )}
            </>
          ) : (
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody textAlign="center" py={12}>
                <Icon as={FiCode} fontSize="4xl" color="gray.400" mb={4} />
                <Text fontSize="lg" color="gray.600" mb={2}>
                  Select an API endpoint
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Choose an endpoint from the list to test and explore its
                  functionality
                </Text>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Grid>

      {/* Authentication Modal */}
      <Modal isOpen={isAuthOpen} onClose={onAuthClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>API Authentication</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Authentication Type</FormLabel>
                <Select
                  value={authConfig.type}
                  onChange={(e) =>
                    setAuthConfig((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                  <option value="apikey">API Key</option>
                </Select>
              </FormControl>

              {authConfig.type === "bearer" && (
                <FormControl>
                  <FormLabel>Bearer Token</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your bearer token"
                    value={authConfig.token}
                    onChange={(e) =>
                      setAuthConfig((prev) => ({
                        ...prev,
                        token: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              )}

              {authConfig.type === "basic" && (
                <>
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <Input
                      placeholder="Enter username"
                      value={authConfig.username}
                      onChange={(e) =>
                        setAuthConfig((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={authConfig.password}
                      onChange={(e) =>
                        setAuthConfig((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                    />
                  </FormControl>
                </>
              )}

              {authConfig.type === "apikey" && (
                <FormControl>
                  <FormLabel>API Key</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={authConfig.token}
                    onChange={(e) =>
                      setAuthConfig((prev) => ({
                        ...prev,
                        token: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onAuthClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onAuthClose}>
              Save Configuration
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Schema Modal */}
      <Modal isOpen={isSchemaOpen} onClose={onSchemaClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>API Schema</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>API schema documentation would go here</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSchemaClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ApiExplorerPage;
