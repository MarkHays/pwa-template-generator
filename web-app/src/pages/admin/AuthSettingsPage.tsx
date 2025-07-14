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
  InputRightElement,
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
  Switch,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertDescription,
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
  Code,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from "@chakra-ui/react";
import {
  FiShield,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiRefreshCw,
  FiExternalLink,
  FiCopy,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  icon: React.ComponentType;
  color: string;
  enabled: boolean;
  configured: boolean;
  config: {
    clientId: string;
    clientSecret: string;
    scopes: string[];
    redirectUri: string;
    domain?: string;
    tenantId?: string;
    issuer?: string;
  };
  userMapping: {
    emailField: string;
    nameField: string;
    firstNameField: string;
    lastNameField: string;
    avatarField: string;
  };
  restrictions: {
    allowedDomains: string[];
    blockedDomains: string[];
    requireVerifiedEmail: boolean;
    autoCreateUsers: boolean;
  };
  stats: {
    totalLogins: number;
    activeUsers: number;
    lastLogin: string;
    successRate: number;
  };
}

interface SecuritySettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  requireTwoFactor: boolean;
  allowPasswordLogin: boolean;
  enforceStrongPasswords: boolean;
  passwordMinLength: number;
  passwordRequirements: {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

const AuthSettingsPage: React.FC = () => {
  const toast = useToast();

  const {
    isOpen: isSecurityOpen,
    onOpen: onSecurityOpen,
    onClose: onSecurityClose,
  } = useDisclosure();

  const [providers, setProviders] = useState<OAuthProvider[]>([
    {
      id: "google",
      name: "google",
      displayName: "Google",
      icon: FaGoogle,
      color: "#DB4437",
      enabled: true,
      configured: true,
      config: {
        clientId: "your-google-client-id.googleusercontent.com",
        clientSecret: "••••••••••••••••",
        scopes: ["openid", "email", "profile"],
        redirectUri: "https://your-domain.com/auth/google/callback",
      },
      userMapping: {
        emailField: "email",
        nameField: "name",
        firstNameField: "given_name",
        lastNameField: "family_name",
        avatarField: "picture",
      },
      restrictions: {
        allowedDomains: ["company.com", "partner.org"],
        blockedDomains: [],
        requireVerifiedEmail: true,
        autoCreateUsers: true,
      },
      stats: {
        totalLogins: 1247,
        activeUsers: 89,
        lastLogin: "2024-01-15 10:30:00",
        successRate: 98.5,
      },
    },
    {
      id: "github",
      name: "github",
      displayName: "GitHub",
      icon: FaGithub,
      color: "#333",
      enabled: true,
      configured: true,
      config: {
        clientId: "your-github-client-id",
        clientSecret: "••••••••••••••••",
        scopes: ["user:email", "read:user"],
        redirectUri: "https://your-domain.com/auth/github/callback",
      },
      userMapping: {
        emailField: "email",
        nameField: "name",
        firstNameField: "name",
        lastNameField: "",
        avatarField: "avatar_url",
      },
      restrictions: {
        allowedDomains: [],
        blockedDomains: [],
        requireVerifiedEmail: true,
        autoCreateUsers: true,
      },
      stats: {
        totalLogins: 567,
        activeUsers: 34,
        lastLogin: "2024-01-15 09:45:00",
        successRate: 97.2,
      },
    },
    {
      id: "microsoft",
      name: "microsoft",
      displayName: "Microsoft",
      icon: FaMicrosoft,
      color: "#00A4EF",
      enabled: false,
      configured: false,
      config: {
        clientId: "",
        clientSecret: "",
        scopes: ["openid", "email", "profile"],
        redirectUri: "https://your-domain.com/auth/microsoft/callback",
        tenantId: "common",
      },
      userMapping: {
        emailField: "mail",
        nameField: "displayName",
        firstNameField: "givenName",
        lastNameField: "surname",
        avatarField: "photo",
      },
      restrictions: {
        allowedDomains: [],
        blockedDomains: [],
        requireVerifiedEmail: true,
        autoCreateUsers: false,
      },
      stats: {
        totalLogins: 0,
        activeUsers: 0,
        lastLogin: "Never",
        successRate: 0,
      },
    },
  ]);

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    sessionTimeout: 8,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    requireTwoFactor: false,
    allowPasswordLogin: true,
    enforceStrongPasswords: true,
    passwordMinLength: 8,
    passwordRequirements: {
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    },
  });

  const [selectedProvider, setSelectedProvider] =
    useState<OAuthProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>(
    {},
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleProviderToggle = async (providerId: string, enabled: boolean) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProviders((prev) =>
        prev.map((p) => (p.id === providerId ? { ...p, enabled } : p)),
      );
      toast({
        title: enabled ? "Provider Enabled" : "Provider Disabled",
        description: `${providers.find((p) => p.id === providerId)?.displayName} authentication ${enabled ? "enabled" : "disabled"}`,
        status: enabled ? "success" : "warning",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider settings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProvider = async (provider: OAuthProvider) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProviders((prev) =>
        prev.map((p) => (p.id === provider.id ? provider : p)),
      );
      toast({
        title: "Provider Updated",
        description: `${provider.displayName} configuration saved successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save provider configuration",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (provider: OAuthProvider) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Connection Test",
        description: `${provider.displayName} connection test successful`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${provider.displayName}`,
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
      description: "Text copied to clipboard",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleSecretVisibility = (providerId: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [providerId]: !prev[providerId],
    }));
  };

  return (
    <Box>
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>
            Authentication Settings
          </Heading>
          <Text color="gray.600">
            Configure OAuth providers and security settings
          </Text>
        </Box>
        <HStack spacing={3}>
          <Button
            leftIcon={<Icon as={FiShield} />}
            onClick={onSecurityOpen}
            variant="outline"
            size="sm"
          >
            Security Settings
          </Button>
          <Button
            leftIcon={<Icon as={FiRefreshCw} />}
            variant="outline"
            size="sm"
          >
            Sync Providers
          </Button>
        </HStack>
      </Flex>

      {/* OAuth Provider Statistics */}
      <Grid
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={4}
        mb={6}
      >
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Logins</StatLabel>
              <StatNumber>
                {providers
                  .reduce((sum, p) => sum + p.stats.totalLogins, 0)
                  .toLocaleString()}
              </StatNumber>
              <StatHelpText>All providers combined</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Active Providers</StatLabel>
              <StatNumber color="green.500">
                {providers.filter((p) => p.enabled).length}
              </StatNumber>
              <StatHelpText>Currently enabled</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Success Rate</StatLabel>
              <StatNumber color="green.500">
                {(
                  providers.reduce((sum, p) => sum + p.stats.successRate, 0) /
                  providers.length
                ).toFixed(1)}
                %
              </StatNumber>
              <StatHelpText>Average across providers</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Active Users</StatLabel>
              <StatNumber>
                {providers.reduce((sum, p) => sum + p.stats.activeUsers, 0)}
              </StatNumber>
              <StatHelpText>Currently authenticated</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* OAuth Providers Configuration */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Heading size="md">OAuth Providers</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {providers.map((provider) => (
              <Card key={provider.id} border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Provider Header */}
                    <Flex justify="space-between" align="center">
                      <HStack spacing={4}>
                        <Box
                          w={12}
                          h={12}
                          bg={provider.color}
                          borderRadius="lg"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                        >
                          <Icon as={provider.icon} fontSize="xl" />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="lg" fontWeight="bold">
                            {provider.displayName}
                          </Text>
                          <HStack spacing={2}>
                            <Badge
                              colorScheme={
                                provider.configured ? "green" : "red"
                              }
                              variant="solid"
                            >
                              {provider.configured
                                ? "Configured"
                                : "Not Configured"}
                            </Badge>
                            <Badge
                              colorScheme={provider.enabled ? "green" : "gray"}
                              variant="outline"
                            >
                              {provider.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </HStack>
                        </VStack>
                      </HStack>

                      <HStack spacing={3}>
                        <Switch
                          isChecked={provider.enabled}
                          onChange={(e) =>
                            handleProviderToggle(provider.id, e.target.checked)
                          }
                          colorScheme="green"
                          size="lg"
                          isDisabled={!provider.configured}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Icon as={FiSettings} />}
                          onClick={() => setSelectedProvider(provider)}
                        >
                          Configure
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<Icon as={FiExternalLink} />}
                          onClick={() => handleTestConnection(provider)}
                          isLoading={isLoading}
                          isDisabled={!provider.configured}
                        >
                          Test
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Provider Stats */}
                    <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                      <VStack>
                        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                          {provider.stats.totalLogins.toLocaleString()}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Total Logins
                        </Text>
                      </VStack>
                      <VStack>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="green.500"
                        >
                          {provider.stats.activeUsers}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Active Users
                        </Text>
                      </VStack>
                      <VStack>
                        <Text
                          fontSize="2xl"
                          fontWeight="bold"
                          color="purple.500"
                        >
                          {provider.stats.successRate}%
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Success Rate
                        </Text>
                      </VStack>
                      <VStack>
                        <Text fontSize="sm" fontWeight="bold">
                          {provider.stats.lastLogin !== "Never"
                            ? new Date(
                                provider.stats.lastLogin,
                              ).toLocaleDateString()
                            : "Never"}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Last Login
                        </Text>
                      </VStack>
                    </Grid>

                    {/* Configuration Preview */}
                    {provider.configured && (
                      <Accordion allowToggle>
                        <AccordionItem border="none">
                          <AccordionButton px={0}>
                            <Box flex="1" textAlign="left">
                              <Text fontSize="sm" fontWeight="medium">
                                Configuration Details
                              </Text>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel px={0} py={3}>
                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                              <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    Client ID:
                                  </Text>
                                  <HStack spacing={2}>
                                    <Code fontSize="xs">
                                      {provider.config.clientId.substring(
                                        0,
                                        20,
                                      )}
                                      ...
                                    </Code>
                                    <IconButton
                                      aria-label="Copy client ID"
                                      icon={<Icon as={FiCopy} />}
                                      size="xs"
                                      variant="ghost"
                                      onClick={() =>
                                        copyToClipboard(
                                          provider.config.clientId,
                                        )
                                      }
                                    />
                                  </HStack>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    Scopes:
                                  </Text>
                                  <Text fontSize="sm">
                                    {provider.config.scopes.join(", ")}
                                  </Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    Auto Create Users:
                                  </Text>
                                  <Badge
                                    colorScheme={
                                      provider.restrictions.autoCreateUsers
                                        ? "green"
                                        : "red"
                                    }
                                    size="sm"
                                  >
                                    {provider.restrictions.autoCreateUsers
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </HStack>
                              </VStack>
                              <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    Redirect URI:
                                  </Text>
                                  <HStack spacing={2}>
                                    <Code fontSize="xs">
                                      {provider.config.redirectUri.substring(
                                        0,
                                        30,
                                      )}
                                      ...
                                    </Code>
                                    <IconButton
                                      aria-label="Copy redirect URI"
                                      icon={<Icon as={FiCopy} />}
                                      size="xs"
                                      variant="ghost"
                                      onClick={() =>
                                        copyToClipboard(
                                          provider.config.redirectUri,
                                        )
                                      }
                                    />
                                  </HStack>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    Domain Restrictions:
                                  </Text>
                                  <Text fontSize="sm">
                                    {provider.restrictions.allowedDomains
                                      .length > 0
                                      ? `${provider.restrictions.allowedDomains.length} domains`
                                      : "None"}
                                  </Text>
                                </HStack>
                                <HStack justify="space-between">
                                  <Text fontSize="sm" color="gray.600">
                                    Require Verified Email:
                                  </Text>
                                  <Badge
                                    colorScheme={
                                      provider.restrictions.requireVerifiedEmail
                                        ? "green"
                                        : "red"
                                    }
                                    size="sm"
                                  >
                                    {provider.restrictions.requireVerifiedEmail
                                      ? "Yes"
                                      : "No"}
                                  </Badge>
                                </HStack>
                              </VStack>
                            </Grid>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Provider Configuration Modal */}
      {selectedProvider && (
        <Modal
          isOpen={!!selectedProvider}
          onClose={() => setSelectedProvider(null)}
          size="2xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack spacing={3}>
                <Box
                  w={8}
                  h={8}
                  bg={selectedProvider.color}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                >
                  <Icon as={selectedProvider.icon} />
                </Box>
                <Text>Configure {selectedProvider.displayName}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs variant="enclosed" colorScheme="blue">
                <TabList>
                  <Tab>Basic Configuration</Tab>
                  <Tab>User Mapping</Tab>
                  <Tab>Restrictions</Tab>
                </TabList>

                <TabPanels>
                  {/* Basic Configuration */}
                  <TabPanel p={0} pt={4}>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Client ID</FormLabel>
                        <Input
                          value={selectedProvider.config.clientId}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              config: {
                                ...selectedProvider.config,
                                clientId: e.target.value,
                              },
                            })
                          }
                          placeholder="Enter OAuth client ID"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Client Secret</FormLabel>
                        <InputGroup>
                          <Input
                            type={
                              showSecrets[selectedProvider.id]
                                ? "text"
                                : "password"
                            }
                            value={selectedProvider.config.clientSecret}
                            onChange={(e) =>
                              setSelectedProvider({
                                ...selectedProvider,
                                config: {
                                  ...selectedProvider.config,
                                  clientSecret: e.target.value,
                                },
                              })
                            }
                            placeholder="Enter OAuth client secret"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label="Toggle secret visibility"
                              icon={
                                <Icon
                                  as={
                                    showSecrets[selectedProvider.id]
                                      ? FiEyeOff
                                      : FiEye
                                  }
                                />
                              }
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                toggleSecretVisibility(selectedProvider.id)
                              }
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Redirect URI</FormLabel>
                        <InputGroup>
                          <Input
                            value={selectedProvider.config.redirectUri}
                            onChange={(e) =>
                              setSelectedProvider({
                                ...selectedProvider,
                                config: {
                                  ...selectedProvider.config,
                                  redirectUri: e.target.value,
                                },
                              })
                            }
                            placeholder="https://your-domain.com/auth/callback"
                          />
                          <InputRightElement>
                            <IconButton
                              aria-label="Copy redirect URI"
                              icon={<Icon as={FiCopy} />}
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                copyToClipboard(
                                  selectedProvider.config.redirectUri,
                                )
                              }
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Scopes</FormLabel>
                        <Textarea
                          value={selectedProvider.config.scopes.join(" ")}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              config: {
                                ...selectedProvider.config,
                                scopes: e.target.value
                                  .split(" ")
                                  .filter((s) => s.trim()),
                              },
                            })
                          }
                          placeholder="openid email profile"
                          rows={3}
                        />
                      </FormControl>

                      {selectedProvider.id === "microsoft" && (
                        <FormControl>
                          <FormLabel>Tenant ID</FormLabel>
                          <Input
                            value={selectedProvider.config.tenantId || ""}
                            onChange={(e) =>
                              setSelectedProvider({
                                ...selectedProvider,
                                config: {
                                  ...selectedProvider.config,
                                  tenantId: e.target.value,
                                },
                              })
                            }
                            placeholder="common, organizations, or specific tenant ID"
                          />
                        </FormControl>
                      )}
                    </VStack>
                  </TabPanel>

                  {/* User Mapping */}
                  <TabPanel p={0} pt={4}>
                    <VStack spacing={4} align="stretch">
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <AlertDescription fontSize="sm">
                          Configure how user data from{" "}
                          {selectedProvider.displayName} maps to your
                          application's user fields.
                        </AlertDescription>
                      </Alert>

                      <FormControl>
                        <FormLabel>Email Field</FormLabel>
                        <Input
                          value={selectedProvider.userMapping.emailField}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              userMapping: {
                                ...selectedProvider.userMapping,
                                emailField: e.target.value,
                              },
                            })
                          }
                          placeholder="email"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>First Name Field</FormLabel>
                        <Input
                          value={selectedProvider.userMapping.firstNameField}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              userMapping: {
                                ...selectedProvider.userMapping,
                                firstNameField: e.target.value,
                              },
                            })
                          }
                          placeholder="given_name"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Last Name Field</FormLabel>
                        <Input
                          value={selectedProvider.userMapping.lastNameField}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              userMapping: {
                                ...selectedProvider.userMapping,
                                lastNameField: e.target.value,
                              },
                            })
                          }
                          placeholder="family_name"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Avatar Field</FormLabel>
                        <Input
                          value={selectedProvider.userMapping.avatarField}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              userMapping: {
                                ...selectedProvider.userMapping,
                                avatarField: e.target.value,
                              },
                            })
                          }
                          placeholder="picture"
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  {/* Restrictions */}
                  <TabPanel p={0} pt={4}>
                    <VStack spacing={4} align="stretch">
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="auto-create" mb="0" flex="1">
                          Automatically create user accounts
                        </FormLabel>
                        <Switch
                          id="auto-create"
                          isChecked={
                            selectedProvider.restrictions.autoCreateUsers
                          }
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              restrictions: {
                                ...selectedProvider.restrictions,
                                autoCreateUsers: e.target.checked,
                              },
                            })
                          }
                          colorScheme="blue"
                        />
                      </FormControl>

                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="verified-email" mb="0" flex="1">
                          Require verified email address
                        </FormLabel>
                        <Switch
                          id="verified-email"
                          isChecked={
                            selectedProvider.restrictions.requireVerifiedEmail
                          }
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              restrictions: {
                                ...selectedProvider.restrictions,
                                requireVerifiedEmail: e.target.checked,
                              },
                            })
                          }
                          colorScheme="blue"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Allowed Domains (one per line)</FormLabel>
                        <Textarea
                          value={selectedProvider.restrictions.allowedDomains.join(
                            "\n",
                          )}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              restrictions: {
                                ...selectedProvider.restrictions,
                                allowedDomains: e.target.value
                                  .split("\n")
                                  .filter((d) => d.trim()),
                              },
                            })
                          }
                          placeholder="company.com&#10;partner.org"
                          rows={4}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Blocked Domains (one per line)</FormLabel>
                        <Textarea
                          value={selectedProvider.restrictions.blockedDomains.join(
                            "\n",
                          )}
                          onChange={(e) =>
                            setSelectedProvider({
                              ...selectedProvider,
                              restrictions: {
                                ...selectedProvider.restrictions,
                                blockedDomains: e.target.value
                                  .split("\n")
                                  .filter((d) => d.trim()),
                              },
                            })
                          }
                          placeholder="example.com&#10;spam.com"
                          rows={4}
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="outline"
                mr={3}
                onClick={() => setSelectedProvider(null)}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleSaveProvider(selectedProvider)}
                isLoading={isLoading}
                loadingText="Saving..."
              >
                Save Configuration
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Security Settings Modal */}
      <Modal isOpen={isSecurityOpen} onClose={onSecurityClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Security Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="sm">Session Management</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Session Timeout (hours)</FormLabel>
                      <Select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            sessionTimeout: Number(e.target.value),
                          }))
                        }
                      >
                        <option value="1">1 hour</option>
                        <option value="2">2 hours</option>
                        <option value="4">4 hours</option>
                        <option value="8">8 hours</option>
                        <option value="24">24 hours</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Max Login Attempts</FormLabel>
                      <Select
                        value={securitySettings.maxLoginAttempts}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            maxLoginAttempts: Number(e.target.value),
                          }))
                        }
                      >
                        <option value="3">3 attempts</option>
                        <option value="5">5 attempts</option>
                        <option value="10">10 attempts</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Lockout Duration (minutes)</FormLabel>
                      <Select
                        value={securitySettings.lockoutDuration}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            lockoutDuration: Number(e.target.value),
                          }))
                        }
                      >
                        <option value="5">5 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="sm">Password Requirements</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="enforce-strong" mb="0" flex="1">
                        Enforce strong passwords
                      </FormLabel>
                      <Switch
                        id="enforce-strong"
                        isChecked={securitySettings.enforceStrongPasswords}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            enforceStrongPasswords: e.target.checked,
                          }))
                        }
                        colorScheme="blue"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Minimum Password Length</FormLabel>
                      <Select
                        value={securitySettings.passwordMinLength}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordMinLength: Number(e.target.value),
                          }))
                        }
                      >
                        <option value="6">6 characters</option>
                        <option value="8">8 characters</option>
                        <option value="12">12 characters</option>
                        <option value="16">16 characters</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onSecurityClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={onSecurityClose}>
              Save Settings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AuthSettingsPage;
