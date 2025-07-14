import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  Badge,
  Switch,
  Select,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Tooltip,
  Stack,
} from "@chakra-ui/react";
import {
  FiShield,
  FiDatabase,
  FiCloud,
  FiUsers,
  FiActivity,
  FiLock,
  FiServer,
  FiGlobe,
  FiZap,
  FiSettings,
  FiCheck,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";

const EnterpriseConfigStep: React.FC = () => {
  const { enterpriseConfig, setEnterpriseConfig } = usePWAGeneratorStore();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const [activeTab, setActiveTab] = useState(0);
  const { isOpen: isAdvancedOpen, onToggle: toggleAdvanced } = useDisclosure();

  const authProviders = [
    { id: "google", name: "Google", icon: FaGoogle, color: "#4285F4" },
    { id: "github", name: "GitHub", icon: FaGithub, color: "#333" },
    { id: "microsoft", name: "Microsoft", icon: FaMicrosoft, color: "#0078D4" },
    { id: "auth0", name: "Auth0", icon: FiShield, color: "#EB5424" },
  ];

  const databases = [
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "Open source object-relational database",
    },
    {
      id: "mysql",
      name: "MySQL",
      description: "World's most popular open source database",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      description: "Document-based NoSQL database",
    },
    {
      id: "dynamodb",
      name: "DynamoDB",
      description: "AWS managed NoSQL database",
    },
    {
      id: "cosmosdb",
      name: "CosmosDB",
      description: "Microsoft's globally distributed database",
    },
    {
      id: "firestore",
      name: "Firestore",
      description: "Google's NoSQL document database",
    },
  ];

  const deploymentPlatforms = [
    { id: "aws", name: "AWS", description: "Amazon Web Services" },
    { id: "azure", name: "Azure", description: "Microsoft Azure" },
    { id: "gcp", name: "Google Cloud", description: "Google Cloud Platform" },
    { id: "vercel", name: "Vercel", description: "Frontend cloud platform" },
    {
      id: "netlify",
      name: "Netlify",
      description: "All-in-one web development platform",
    },
  ];

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setEnterpriseConfig({
      ...enterpriseConfig,
      [feature]: enabled,
    });
  };

  const handleAuthProviderToggle = (providerId: string, enabled: boolean) => {
    const currentProviders = enterpriseConfig.authProviders || [];
    const updatedProviders = enabled
      ? [...currentProviders, providerId]
      : currentProviders.filter((p) => p !== providerId);

    setEnterpriseConfig({
      ...enterpriseConfig,
      authProviders: updatedProviders,
    });
  };

  const handleDatabaseSelection = (databaseId: string) => {
    setEnterpriseConfig({
      ...enterpriseConfig,
      database: databaseId,
    });
  };

  const handleDeploymentToggle = (platformId: string, enabled: boolean) => {
    const currentPlatforms = enterpriseConfig.deploymentPlatforms || [];
    const updatedPlatforms = enabled
      ? [...currentPlatforms, platformId]
      : currentPlatforms.filter((p) => p !== platformId);

    setEnterpriseConfig({
      ...enterpriseConfig,
      deploymentPlatforms: updatedPlatforms,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Enterprise Features</AlertTitle>
          <AlertDescription>
            Configure your PWA with enterprise-grade capabilities including
            authentication, databases, APIs, monitoring, and security features.
          </AlertDescription>
        </Box>
      </Alert>

      {/* Enterprise Features Toggle */}
      <Card bg={cardBg} borderColor={borderColor}>
        <CardHeader>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="md">Enterprise Mode</Heading>
              <Text fontSize="sm" color="gray.600">
                Enable enterprise-grade features for production applications
              </Text>
            </VStack>
            <Switch
              size="lg"
              colorScheme="blue"
              isChecked={enterpriseConfig.enabled}
              onChange={(e) => handleFeatureToggle("enabled", e.target.checked)}
            />
          </HStack>
        </CardHeader>
      </Card>

      {enterpriseConfig.enabled && (
        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
          <TabList>
            <Tab>
              <Icon as={FiShield} mr={2} />
              Authentication
            </Tab>
            <Tab>
              <Icon as={FiDatabase} mr={2} />
              Database
            </Tab>
            <Tab>
              <Icon as={FiServer} mr={2} />
              APIs & Services
            </Tab>
            <Tab>
              <Icon as={FiActivity} mr={2} />
              Monitoring
            </Tab>
            <Tab>
              <Icon as={FiCloud} mr={2} />
              Deployment
            </Tab>
          </TabList>

          <TabPanels>
            {/* Authentication Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">Authentication Providers</Heading>
                    <Text fontSize="sm" color="gray.600">
                      Choose OAuth providers for user authentication
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {authProviders.map((provider) => (
                        <Card key={provider.id} variant="outline">
                          <CardBody>
                            <HStack justify="space-between">
                              <HStack>
                                <Icon
                                  as={provider.icon}
                                  color={provider.color}
                                  boxSize={6}
                                />
                                <Text fontWeight="medium">{provider.name}</Text>
                              </HStack>
                              <Checkbox
                                isChecked={enterpriseConfig.authProviders?.includes(
                                  provider.id,
                                )}
                                onChange={(e) =>
                                  handleAuthProviderToggle(
                                    provider.id,
                                    e.target.checked,
                                  )
                                }
                              />
                            </HStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">Security Features</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">
                            Role-Based Access Control (RBAC)
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Granular permissions and user roles
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.rbac}
                          onChange={(e) =>
                            handleFeatureToggle("rbac", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">
                            Multi-Factor Authentication
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Enhanced security with 2FA/MFA
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.mfa}
                          onChange={(e) =>
                            handleFeatureToggle("mfa", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Session Management</Text>
                          <Text fontSize="sm" color="gray.600">
                            Advanced session security and timeout
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.sessionManagement}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "sessionManagement",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Database Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">Database Selection</Heading>
                    <Text fontSize="sm" color="gray.600">
                      Choose your primary database for the application
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {databases.map((db) => (
                        <Card
                          key={db.id}
                          variant="outline"
                          cursor="pointer"
                          borderColor={
                            enterpriseConfig.database === db.id
                              ? "blue.500"
                              : borderColor
                          }
                          bg={
                            enterpriseConfig.database === db.id
                              ? "blue.50"
                              : "transparent"
                          }
                          onClick={() => handleDatabaseSelection(db.id)}
                          _hover={{ borderColor: "blue.300" }}
                        >
                          <CardBody>
                            <VStack align="start" spacing={2}>
                              <HStack justify="space-between" w="full">
                                <Text fontWeight="medium">{db.name}</Text>
                                {enterpriseConfig.database === db.id && (
                                  <Icon as={FiCheck} color="blue.500" />
                                )}
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {db.description}
                              </Text>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">Database Features</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Auto-generated APIs</Text>
                          <Text fontSize="sm" color="gray.600">
                            REST and GraphQL APIs from schemas
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.autoGeneratedAPIs}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "autoGeneratedAPIs",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Real-time Sync</Text>
                          <Text fontSize="sm" color="gray.600">
                            Live data updates across clients
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.realTimeSync}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "realTimeSync",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">
                            Database Migration System
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Schema versioning and management
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.migrations}
                          onChange={(e) =>
                            handleFeatureToggle("migrations", e.target.checked)
                          }
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* APIs & Services Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">API Generation</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">REST API</Text>
                          <Text fontSize="sm" color="gray.600">
                            Complete CRUD operations with pagination
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.restAPI}
                          onChange={(e) =>
                            handleFeatureToggle("restAPI", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">GraphQL API</Text>
                          <Text fontSize="sm" color="gray.600">
                            Queries, mutations, and subscriptions
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.graphqlAPI}
                          onChange={(e) =>
                            handleFeatureToggle("graphqlAPI", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">OpenAPI Documentation</Text>
                          <Text fontSize="sm" color="gray.600">
                            Interactive Swagger UI documentation
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.apiDocs}
                          onChange={(e) =>
                            handleFeatureToggle("apiDocs", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Rate Limiting</Text>
                          <Text fontSize="sm" color="gray.600">
                            Per-endpoint and user-based limits
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.rateLimiting}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "rateLimiting",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">Real-time Features</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">WebSocket Server</Text>
                          <Text fontSize="sm" color="gray.600">
                            Scalable real-time connections
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.websockets}
                          onChange={(e) =>
                            handleFeatureToggle("websockets", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Live Collaboration</Text>
                          <Text fontSize="sm" color="gray.600">
                            Multi-user real-time editing
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.liveCollaboration}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "liveCollaboration",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Presence Awareness</Text>
                          <Text fontSize="sm" color="gray.600">
                            See who's online and active
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.presenceAwareness}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "presenceAwareness",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Monitoring Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">System Monitoring</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Health Checks</Text>
                          <Text fontSize="sm" color="gray.600">
                            Real-time system status monitoring
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.healthChecks}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "healthChecks",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Performance Metrics</Text>
                          <Text fontSize="sm" color="gray.600">
                            Response times, throughput, error rates
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.performanceMetrics}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "performanceMetrics",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Error Tracking</Text>
                          <Text fontSize="sm" color="gray.600">
                            Comprehensive error capture and reporting
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.errorTracking}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "errorTracking",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Custom Dashboards</Text>
                          <Text fontSize="sm" color="gray.600">
                            Business intelligence insights
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.customDashboards}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "customDashboards",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Audit Logging</Text>
                          <Text fontSize="sm" color="gray.600">
                            Complete activity tracking
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.auditLogging}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "auditLogging",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Deployment Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">Deployment Platforms</Heading>
                    <Text fontSize="sm" color="gray.600">
                      Choose deployment targets for your PWA
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {deploymentPlatforms.map((platform) => (
                        <Card key={platform.id} variant="outline">
                          <CardBody>
                            <HStack justify="space-between">
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">{platform.name}</Text>
                                <Text fontSize="sm" color="gray.600">
                                  {platform.description}
                                </Text>
                              </VStack>
                              <Checkbox
                                isChecked={enterpriseConfig.deploymentPlatforms?.includes(
                                  platform.id,
                                )}
                                onChange={(e) =>
                                  handleDeploymentToggle(
                                    platform.id,
                                    e.target.checked,
                                  )
                                }
                              />
                            </HStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="sm">Deployment Features</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">CI/CD Pipelines</Text>
                          <Text fontSize="sm" color="gray.600">
                            Automated build and deployment
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.cicd}
                          onChange={(e) =>
                            handleFeatureToggle("cicd", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">
                            Environment Management
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            Dev, staging, and production environments
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.environmentManagement}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "environmentManagement",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Docker Containers</Text>
                          <Text fontSize="sm" color="gray.600">
                            Containerized deployment with Docker
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.docker}
                          onChange={(e) =>
                            handleFeatureToggle("docker", e.target.checked)
                          }
                        />
                      </HStack>

                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Load Balancing</Text>
                          <Text fontSize="sm" color="gray.600">
                            Distribute traffic across multiple instances
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={enterpriseConfig.loadBalancing}
                          onChange={(e) =>
                            handleFeatureToggle(
                              "loadBalancing",
                              e.target.checked,
                            )
                          }
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}

      {/* Summary */}
      {enterpriseConfig.enabled && (
        <Card bg="blue.50" borderColor="blue.200">
          <CardBody>
            <VStack spacing={3} align="start">
              <HStack>
                <Icon as={FiInfo} color="blue.500" />
                <Text fontWeight="medium" color="blue.800">
                  Enterprise Configuration Summary
                </Text>
              </HStack>
              <Text fontSize="sm" color="blue.700">
                Your PWA will be generated with enterprise-grade features
                including {enterpriseConfig.authProviders?.length || 0}{" "}
                authentication providers,{" "}
                {enterpriseConfig.database
                  ? "database integration"
                  : "no database"}
                ,
                {enterpriseConfig.restAPI || enterpriseConfig.graphqlAPI
                  ? " API generation,"
                  : ""}
                {enterpriseConfig.healthChecks ||
                enterpriseConfig.performanceMetrics
                  ? " monitoring,"
                  : ""}
                {" and "}
                {enterpriseConfig.deploymentPlatforms?.length || 0} deployment
                platforms.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default EnterpriseConfigStep;
