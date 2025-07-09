import React, { useState } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Heading,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Icon,
  useColorModeValue,
  Badge,
  Flex,
  Checkbox,
  CheckboxGroup,
  Switch,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Tooltip,
  Code,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiCloud,
  FiGlobe,
  FiShield,
  FiSettings,
  FiBarChart,
  FiZap,
  FiGithub,
  FiCheck,
  FiArrowRight,
  FiInfo,
  FiServer,
  FiLock,
  FiMonitor,
  FiTrendingUp,
  FiCpu,
  FiHardDrive,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";
import { toast } from "react-hot-toast";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface DeploymentPlatform {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  pricing: string;
  setupTime: string;
  difficulty: "Easy" | "Medium" | "Hard";
  recommended?: boolean;
}

interface CICDOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  platforms: string[];
}

interface AnalyticsOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  free: boolean;
}

interface MonitoringOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
}

const DEPLOYMENT_PLATFORMS: DeploymentPlatform[] = [
  {
    id: "vercel",
    name: "Vercel",
    description: "Optimal for React applications with automatic deployments",
    icon: FiZap,
    color: "purple",
    features: [
      "Automatic deployments",
      "Preview deployments",
      "Edge network",
      "Serverless functions",
    ],
    pricing: "Free tier available",
    setupTime: "5 minutes",
    difficulty: "Easy",
    recommended: true,
  },
  {
    id: "netlify",
    name: "Netlify",
    description: "Great for static sites with powerful build tools",
    icon: FiGlobe,
    color: "teal",
    features: [
      "Git-based deployments",
      "Form handling",
      "Functions",
      "Split testing",
    ],
    pricing: "Free tier available",
    setupTime: "10 minutes",
    difficulty: "Easy",
  },
  {
    id: "aws",
    name: "AWS S3 + CloudFront",
    description: "Enterprise-grade hosting with full AWS integration",
    icon: FiCloud,
    color: "orange",
    features: [
      "Global CDN",
      "S3 static hosting",
      "Lambda functions",
      "Custom domains",
    ],
    pricing: "Pay-as-you-go",
    setupTime: "30 minutes",
    difficulty: "Hard",
  },
  {
    id: "github",
    name: "GitHub Pages",
    description: "Simple hosting directly from your repository",
    icon: FiGithub,
    color: "gray",
    features: ["Free hosting", "Custom domains", "HTTPS", "Jekyll support"],
    pricing: "Free",
    setupTime: "15 minutes",
    difficulty: "Medium",
  },
  {
    id: "firebase",
    name: "Firebase Hosting",
    description: "Google's platform with backend services integration",
    icon: FiServer,
    color: "yellow",
    features: [
      "Fast CDN",
      "SSL certificates",
      "Custom domains",
      "Cloud functions",
    ],
    pricing: "Free tier available",
    setupTime: "20 minutes",
    difficulty: "Medium",
  },
];

const CICD_OPTIONS: CICDOption[] = [
  {
    id: "github-actions",
    name: "GitHub Actions",
    description: "Native GitHub CI/CD with workflows",
    icon: FiGithub,
    color: "gray",
    platforms: ["vercel", "netlify", "aws", "github", "firebase"],
  },
  {
    id: "vercel-git",
    name: "Vercel Git Integration",
    description: "Automatic deployments from Git pushes",
    icon: FiZap,
    color: "purple",
    platforms: ["vercel"],
  },
  {
    id: "netlify-build",
    name: "Netlify Build",
    description: "Built-in CI/CD with build plugins",
    icon: FiSettings,
    color: "teal",
    platforms: ["netlify"],
  },
];

const ANALYTICS_OPTIONS: AnalyticsOption[] = [
  {
    id: "google-analytics",
    name: "Google Analytics",
    description: "Comprehensive web analytics platform",
    icon: FiBarChart,
    color: "blue",
    free: true,
  },
  {
    id: "vercel-analytics",
    name: "Vercel Analytics",
    description: "Real-time analytics optimized for Vercel",
    icon: FiTrendingUp,
    color: "purple",
    free: false,
  },
  {
    id: "plausible",
    name: "Plausible",
    description: "Privacy-focused web analytics",
    icon: FiShield,
    color: "green",
    free: false,
  },
];

const MONITORING_OPTIONS: MonitoringOption[] = [
  {
    id: "sentry",
    name: "Sentry",
    description: "Error tracking and performance monitoring",
    icon: FiMonitor,
    color: "red",
    features: ["Error tracking", "Performance monitoring", "Release tracking"],
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Full-stack monitoring and analytics",
    icon: FiCpu,
    color: "purple",
    features: ["Infrastructure monitoring", "APM", "Log management"],
  },
  {
    id: "newrelic",
    name: "New Relic",
    description: "Application performance monitoring",
    icon: FiHardDrive,
    color: "teal",
    features: [
      "Application monitoring",
      "Infrastructure monitoring",
      "Browser monitoring",
    ],
  },
];

const DeploymentStep: React.FC = () => {
  const {
    deployment,
    setDeployment,

    setCurrentStep,
  } = usePWAGeneratorStore();

  const [customDomain, setCustomDomain] = useState(deployment.domain || "");
  const [activeTab, setActiveTab] = useState(0);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handlePlatformToggle = (platformId: string) => {
    const newPlatforms = deployment.platforms.includes(platformId)
      ? deployment.platforms.filter((p) => p !== platformId)
      : [...deployment.platforms, platformId];

    setDeployment({ platforms: newPlatforms });
  };

  const handleCICDChange = (cicdId: string) => {
    setDeployment({ cicd: cicdId });
  };

  const handleAnalyticsToggle = (analyticsId: string) => {
    const newAnalytics = deployment.analytics.includes(analyticsId)
      ? deployment.analytics.filter((a) => a !== analyticsId)
      : [...deployment.analytics, analyticsId];

    setDeployment({ analytics: newAnalytics });
  };

  const handleMonitoringToggle = (monitoringId: string) => {
    const newMonitoring = deployment.monitoring.includes(monitoringId)
      ? deployment.monitoring.filter((m) => m !== monitoringId)
      : [...deployment.monitoring, monitoringId];

    setDeployment({ monitoring: newMonitoring });
  };

  const handleDomainChange = (domain: string) => {
    setCustomDomain(domain);
    setDeployment({ domain });
  };

  const handleContinue = () => {
    if (deployment.platforms.length === 0) {
      toast.error("Please select at least one deployment platform");
      return;
    }
    setCurrentStep(6); // Move to review step
  };

  const recommendedPlatform = DEPLOYMENT_PLATFORMS.find((p) => p.recommended);

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={4} align="start">
            <HStack spacing={3}>
              <Icon as={FiCloud} boxSize={8} color="blue.500" />
              <Heading size="lg" color="blue.500">
                Configure Deployment
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Choose how and where to deploy your PWA. Set up hosting,
              monitoring, and analytics to ensure optimal performance and user
              experience.
            </Text>
          </VStack>
        </MotionBox>

        {/* Recommendation Banner */}
        {recommendedPlatform && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Recommended Platform</AlertTitle>
                <AlertDescription>
                  For your project type, we recommend{" "}
                  <Badge colorScheme="blue" mx={1}>
                    {recommendedPlatform.name}
                  </Badge>
                  - it's {recommendedPlatform.difficulty.toLowerCase()} to set
                  up and takes about {recommendedPlatform.setupTime}.
                </AlertDescription>
              </Box>
            </Alert>
          </MotionBox>
        )}

        {/* Deployment Configuration */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs
            index={activeTab}
            onChange={setActiveTab}
            colorScheme="blue"
            variant="enclosed"
          >
            <TabList>
              <Tab>
                <Icon as={FiCloud} mr={2} />
                Hosting Platform
              </Tab>
              <Tab>
                <Icon as={FiSettings} mr={2} />
                CI/CD & Automation
              </Tab>
              <Tab>
                <Icon as={FiBarChart} mr={2} />
                Analytics & Monitoring
              </Tab>
              <Tab>
                <Icon as={FiGlobe} mr={2} />
                Domain & SSL
              </Tab>
            </TabList>

            <TabPanels>
              {/* Hosting Platform Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Text color="gray.600">
                    Select one or more hosting platforms for your PWA
                    deployment:
                  </Text>

                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={6}
                  >
                    {DEPLOYMENT_PLATFORMS.map((platform) => (
                      <MotionCard
                        key={platform.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        bg={
                          deployment.platforms.includes(platform.id)
                            ? `${platform.color}.50`
                            : cardBg
                        }
                        border="2px"
                        borderColor={
                          deployment.platforms.includes(platform.id)
                            ? `${platform.color}.300`
                            : borderColor
                        }
                        cursor="pointer"
                        onClick={() => handlePlatformToggle(platform.id)}
                        _hover={{
                          bg: deployment.platforms.includes(platform.id)
                            ? `${platform.color}.50`
                            : "gray.50",
                          borderColor: `${platform.color}.300`,
                          transform: "translateY(-2px)",
                          shadow: "md",
                        }}
                        position="relative"
                      >
                        {platform.recommended && (
                          <Badge
                            position="absolute"
                            top={3}
                            right={3}
                            colorScheme="green"
                            fontSize="xs"
                          >
                            Recommended
                          </Badge>
                        )}

                        <CardHeader>
                          <HStack spacing={4}>
                            <Checkbox
                              isChecked={deployment.platforms.includes(
                                platform.id,
                              )}
                              colorScheme={platform.color}
                              size="lg"
                              onChange={() => handlePlatformToggle(platform.id)}
                            />
                            <VStack align="start" spacing={2}>
                              <HStack spacing={3}>
                                <Icon
                                  as={platform.icon}
                                  boxSize={6}
                                  color={`${platform.color}.500`}
                                />
                                <Heading size="md">{platform.name}</Heading>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {platform.description}
                              </Text>
                            </VStack>
                          </HStack>
                        </CardHeader>

                        <CardBody pt={0}>
                          <VStack spacing={4} align="stretch">
                            <SimpleGrid columns={2} spacing={4}>
                              <Box>
                                <Text fontSize="xs" color="gray.500" mb={1}>
                                  SETUP TIME
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {platform.setupTime}
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500" mb={1}>
                                  DIFFICULTY
                                </Text>
                                <Badge
                                  colorScheme={
                                    platform.difficulty === "Easy"
                                      ? "green"
                                      : platform.difficulty === "Medium"
                                        ? "yellow"
                                        : "red"
                                  }
                                  fontSize="xs"
                                >
                                  {platform.difficulty}
                                </Badge>
                              </Box>
                            </SimpleGrid>

                            <Box>
                              <Text fontSize="xs" color="gray.500" mb={2}>
                                KEY FEATURES
                              </Text>
                              <VStack spacing={1} align="start">
                                {platform.features
                                  .slice(0, 3)
                                  .map((feature, index) => (
                                    <HStack key={index} spacing={2}>
                                      <Icon
                                        as={FiCheck}
                                        color="green.500"
                                        boxSize={3}
                                      />
                                      <Text fontSize="xs">{feature}</Text>
                                    </HStack>
                                  ))}
                              </VStack>
                            </Box>

                            <Box>
                              <Text fontSize="xs" color="gray.500" mb={1}>
                                PRICING
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="green.600"
                              >
                                {platform.pricing}
                              </Text>
                            </Box>
                          </VStack>
                        </CardBody>
                      </MotionCard>
                    ))}
                  </Grid>
                </VStack>
              </TabPanel>

              {/* CI/CD Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Text color="gray.600">
                    Choose your continuous integration and deployment setup:
                  </Text>

                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {CICD_OPTIONS.map((option) => (
                          <HStack
                            key={option.id}
                            spacing={4}
                            p={4}
                            borderRadius="md"
                            border="1px"
                            borderColor={
                              deployment.cicd === option.id
                                ? `${option.color}.300`
                                : borderColor
                            }
                            bg={
                              deployment.cicd === option.id
                                ? `${option.color}.50`
                                : "transparent"
                            }
                            cursor="pointer"
                            onClick={() => handleCICDChange(option.id)}
                            _hover={{ bg: `${option.color}.50` }}
                          >
                            <Icon
                              as={option.icon}
                              boxSize={6}
                              color={`${option.color}.500`}
                            />
                            <Box flex={1}>
                              <Text fontWeight="bold">{option.name}</Text>
                              <Text fontSize="sm" color="gray.600">
                                {option.description}
                              </Text>
                              <HStack spacing={2} mt={2}>
                                <Text fontSize="xs" color="gray.500">
                                  Compatible with:
                                </Text>
                                {option.platforms.map((platform) => (
                                  <Badge
                                    key={platform}
                                    colorScheme="blue"
                                    fontSize="xs"
                                  >
                                    {
                                      DEPLOYMENT_PLATFORMS.find(
                                        (p) => p.id === platform,
                                      )?.name
                                    }
                                  </Badge>
                                ))}
                              </HStack>
                            </Box>
                          </HStack>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                      <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="testing-toggle" mb="0">
                          Enable automated testing in CI/CD pipeline
                        </FormLabel>
                        <Switch
                          id="testing-toggle"
                          colorScheme="green"
                          isChecked={deployment.testing}
                          onChange={(e) =>
                            setDeployment({ testing: e.target.checked })
                          }
                        />
                      </FormControl>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Analytics & Monitoring Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Analytics */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Analytics</Heading>
                    </CardHeader>
                    <CardBody>
                      <CheckboxGroup
                        value={deployment.analytics}
                        onChange={(values) =>
                          setDeployment({ analytics: values as string[] })
                        }
                      >
                        <VStack spacing={4} align="stretch">
                          {ANALYTICS_OPTIONS.map((option) => (
                            <HStack
                              key={option.id}
                              spacing={4}
                              p={4}
                              borderRadius="md"
                              border="1px"
                              borderColor={borderColor}
                              _hover={{ bg: "gray.50" }}
                            >
                              <Checkbox
                                value={option.id}
                                colorScheme={option.color}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleAnalyticsToggle(option.id);
                                  }
                                }}
                              />
                              <Icon
                                as={option.icon}
                                boxSize={6}
                                color={`${option.color}.500`}
                              />
                              <Box flex={1}>
                                <HStack spacing={2}>
                                  <Text fontWeight="bold">{option.name}</Text>
                                  <Badge
                                    colorScheme={
                                      option.free ? "green" : "purple"
                                    }
                                    fontSize="xs"
                                  >
                                    {option.free ? "Free" : "Paid"}
                                  </Badge>
                                </HStack>
                                <Text fontSize="sm" color="gray.600">
                                  {option.description}
                                </Text>
                              </Box>
                            </HStack>
                          ))}
                        </VStack>
                      </CheckboxGroup>
                    </CardBody>
                  </Card>

                  {/* Monitoring */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Monitoring</Heading>
                    </CardHeader>
                    <CardBody>
                      <CheckboxGroup
                        value={deployment.monitoring}
                        onChange={(values) =>
                          setDeployment({ monitoring: values as string[] })
                        }
                      >
                        <VStack spacing={4} align="stretch">
                          {MONITORING_OPTIONS.map((option) => (
                            <HStack
                              key={option.id}
                              spacing={4}
                              p={4}
                              borderRadius="md"
                              border="1px"
                              borderColor={borderColor}
                              _hover={{ bg: "gray.50" }}
                            >
                              <Checkbox
                                value={option.id}
                                colorScheme={option.color}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleMonitoringToggle(option.id);
                                  }
                                }}
                              />
                              <Icon
                                as={option.icon}
                                boxSize={6}
                                color={`${option.color}.500`}
                              />
                              <Box flex={1}>
                                <Text fontWeight="bold">{option.name}</Text>
                                <Text fontSize="sm" color="gray.600" mb={2}>
                                  {option.description}
                                </Text>
                                <HStack spacing={2} wrap="wrap">
                                  {option.features.map((feature) => (
                                    <Badge
                                      key={feature}
                                      colorScheme="blue"
                                      fontSize="xs"
                                    >
                                      {feature}
                                    </Badge>
                                  ))}
                                </HStack>
                              </Box>
                            </HStack>
                          ))}
                        </VStack>
                      </CheckboxGroup>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Domain & SSL Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Custom Domain */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Custom Domain</Heading>
                    </CardHeader>
                    <CardBody>
                      <FormControl>
                        <FormLabel>Domain Name (optional)</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiGlobe} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            placeholder="yourdomain.com"
                            value={customDomain}
                            onChange={(e) => handleDomainChange(e.target.value)}
                          />
                          <InputRightElement>
                            <Tooltip label="Domain configuration will be provided after generation">
                              <Icon as={FiInfo} color="gray.400" />
                            </Tooltip>
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>
                    </CardBody>
                  </Card>

                  {/* SSL Configuration */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                      <HStack spacing={4} justify="space-between">
                        <VStack align="start" spacing={2}>
                          <HStack spacing={3}>
                            <Icon as={FiLock} color="green.500" />
                            <Heading size="md">SSL Certificate</Heading>
                          </HStack>
                          <Text color="gray.600">
                            Enable HTTPS with automatic SSL certificate
                            provisioning
                          </Text>
                        </VStack>
                        <Switch
                          colorScheme="green"
                          size="lg"
                          isChecked={deployment.ssl}
                          onChange={(e) =>
                            setDeployment({ ssl: e.target.checked })
                          }
                        />
                      </HStack>
                    </CardBody>
                  </Card>

                  {/* Domain Preview */}
                  {customDomain && (
                    <Card bg="green.50" border="1px" borderColor="green.200">
                      <CardBody>
                        <VStack spacing={3} align="start">
                          <HStack spacing={2}>
                            <Icon as={FiCheck} color="green.500" />
                            <Text fontWeight="bold" color="green.700">
                              Domain Configuration Preview
                            </Text>
                          </HStack>
                          <Code
                            colorScheme="green"
                            p={2}
                            borderRadius="md"
                            fontSize="sm"
                          >
                            {deployment.ssl ? "https://" : "http://"}
                            {customDomain}
                          </Code>
                          <Text fontSize="sm" color="green.600">
                            DNS configuration instructions will be provided
                            after deployment.
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MotionBox>

        {/* Configuration Summary */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Deployment Summary</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Selected Platforms:
                  </Text>
                  {deployment.platforms.length > 0 ? (
                    <HStack spacing={2} wrap="wrap">
                      {deployment.platforms.map((platformId) => {
                        const platform = DEPLOYMENT_PLATFORMS.find(
                          (p) => p.id === platformId,
                        );
                        return platform ? (
                          <Badge key={platformId} colorScheme={platform.color}>
                            {platform.name}
                          </Badge>
                        ) : null;
                      })}
                    </HStack>
                  ) : (
                    <Text color="gray.500" fontSize="sm">
                      No platforms selected
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    CI/CD:
                  </Text>
                  {deployment.cicd ? (
                    <Badge colorScheme="blue">
                      {CICD_OPTIONS.find((c) => c.id === deployment.cicd)?.name}
                    </Badge>
                  ) : (
                    <Text color="gray.500" fontSize="sm">
                      None selected
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Analytics:
                  </Text>
                  {deployment.analytics.length > 0 ? (
                    <HStack spacing={2} wrap="wrap">
                      {deployment.analytics.map((analyticsId) => {
                        const analytics = ANALYTICS_OPTIONS.find(
                          (a) => a.id === analyticsId,
                        );
                        return analytics ? (
                          <Badge
                            key={analyticsId}
                            colorScheme={analytics.color}
                          >
                            {analytics.name}
                          </Badge>
                        ) : null;
                      })}
                    </HStack>
                  ) : (
                    <Text color="gray.500" fontSize="sm">
                      None selected
                    </Text>
                  )}
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Features:
                  </Text>
                  <VStack spacing={1} align="start">
                    <HStack spacing={2}>
                      <Icon
                        as={deployment.ssl ? FiCheck : FiLock}
                        color={deployment.ssl ? "green.500" : "gray.400"}
                      />
                      <Text fontSize="sm">SSL Certificate</Text>
                    </HStack>
                    <HStack spacing={2}>
                      <Icon
                        as={deployment.testing ? FiCheck : FiSettings}
                        color={deployment.testing ? "green.500" : "gray.400"}
                      />
                      <Text fontSize="sm">Automated Testing</Text>
                    </HStack>
                    {customDomain && (
                      <HStack spacing={2}>
                        <Icon as={FiCheck} color="green.500" />
                        <Text fontSize="sm">Custom Domain: {customDomain}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Continue Button */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Flex justify="flex-end">
            <Button
              colorScheme="blue"
              size="lg"
              rightIcon={<FiArrowRight />}
              onClick={handleContinue}
              isDisabled={deployment.platforms.length === 0}
            >
              Continue to Review
            </Button>
          </Flex>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default DeploymentStep;
