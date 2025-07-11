import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiCode,
  FiZap,
  FiSettings,
  FiCloud,
  FiShield,
  FiCheck,
  FiHelpCircle,
  FiPlay,
  FiGithub,
} from "react-icons/fi";
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiNextdotjs,
  SiSvelte,
} from "react-icons/si";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const DocsPage: React.FC = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.800");
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, blue.900)",
  );

  const frameworks = [
    {
      name: "React",
      icon: SiReact,
      color: "#61DAFB",
      description: "Popular library for building user interfaces",
    },
    {
      name: "Vue.js",
      icon: SiVuedotjs,
      color: "#4FC08D",
      description: "Progressive framework for building UIs",
    },
    {
      name: "Angular",
      icon: SiAngular,
      color: "#DD0031",
      description: "Platform for building mobile and desktop apps",
    },
    {
      name: "Next.js",
      icon: SiNextdotjs,
      color: "#000000",
      description: "Full-stack React framework",
    },
    {
      name: "Svelte",
      icon: SiSvelte,
      color: "#FF3E00",
      description: "Cybernetically enhanced web apps",
    },
  ];

  const features = [
    {
      name: "AI-Powered Analysis",
      description: "Intelligent business analysis and recommendations",
    },
    {
      name: "Multi-Framework Support",
      description: "React, Vue, Angular, Next.js, Svelte, and Astro",
    },
    {
      name: "Enterprise Components",
      description: "25+ pre-built, accessible components",
    },
    {
      name: "Performance Optimization",
      description: "Core Web Vitals and bundle optimization",
    },
    {
      name: "Security Features",
      description: "OAuth, RBAC, and enterprise security",
    },
    {
      name: "Testing Integration",
      description: "Jest, Playwright, Cypress, and Storybook",
    },
    {
      name: "CI/CD Pipelines",
      description: "GitHub Actions, GitLab CI, Azure DevOps",
    },
    {
      name: "Cloud Deployment",
      description: "AWS, Azure, GCP, Netlify, Vercel",
    },
  ];

  const deploymentPlatforms = [
    {
      name: "Netlify",
      description: "JAMstack-optimized hosting",
      setup: "Automatic deployment from Git",
    },
    {
      name: "Vercel",
      description: "Next.js optimized platform",
      setup: "Zero-config deployment",
    },
    {
      name: "AWS",
      description: "Amazon Web Services",
      setup: "S3 + CloudFront + Lambda",
    },
    {
      name: "Azure",
      description: "Microsoft Cloud",
      setup: "Static Web Apps + CDN",
    },
    {
      name: "Google Cloud",
      description: "Google Cloud Platform",
      setup: "Cloud Run + Cloud Storage",
    },
  ];

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody py={8}>
                <VStack spacing={6} textAlign="center">
                  <Icon as={FiBook} boxSize={16} color="blue.500" />
                  <VStack spacing={2}>
                    <Heading size="2xl">Documentation</Heading>
                    <Text fontSize="lg" color="gray.600" maxW="2xl">
                      Everything you need to know about building
                      enterprise-grade PWAs with our AI-powered generator
                    </Text>
                  </VStack>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<FiPlay />}
                      colorScheme="blue"
                      size="lg"
                      onClick={() => navigate("/builder")}
                    >
                      Get Started
                    </Button>
                    <Button
                      leftIcon={<FiGithub />}
                      variant="outline"
                      size="lg"
                      onClick={() =>
                        window.open(
                          "https://github.com/MarkHays/pwa-template-generator",
                          "_blank",
                        )
                      }
                    >
                      GitHub
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Documentation Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <Tabs variant="enclosed" colorScheme="blue" size="lg">
                  <TabList>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiPlay} />
                        <Text>Getting Started</Text>
                      </HStack>
                    </Tab>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiCode} />
                        <Text>Frameworks</Text>
                      </HStack>
                    </Tab>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiSettings} />
                        <Text>Features</Text>
                      </HStack>
                    </Tab>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiCloud} />
                        <Text>Deployment</Text>
                      </HStack>
                    </Tab>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiHelpCircle} />
                        <Text>FAQ</Text>
                      </HStack>
                    </Tab>
                  </TabList>

                  <TabPanels>
                    {/* Getting Started */}
                    <TabPanel>
                      <VStack spacing={8} align="stretch">
                        <VStack spacing={4} align="start">
                          <Heading size="lg">Quick Start</Heading>
                          <Text color="gray.600">
                            Get up and running with the PWA Generator in minutes
                          </Text>
                        </VStack>

                        <Alert status="info" borderRadius="lg">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Prerequisites</AlertTitle>
                            <AlertDescription>
                              Make sure you have Node.js 16+ and npm 8+
                              installed on your system.
                            </AlertDescription>
                          </Box>
                        </Alert>

                        <Card variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="start">
                              <Heading size="md">📦 Installation</Heading>
                              <Code p={4} w="full" borderRadius="md">
                                npm install -g pwa-template-generator
                              </Code>
                              <Text fontSize="sm" color="gray.600">
                                Or use without installation:
                              </Text>
                              <Code p={4} w="full" borderRadius="md">
                                npx pwa-template-generator
                              </Code>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Card variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="start">
                              <Heading size="md">🚀 Usage</Heading>
                              <List spacing={3}>
                                <ListItem>
                                  <ListIcon as={FiCheck} color="green.500" />
                                  <Text display="inline" fontWeight="bold">
                                    Web Interface:{" "}
                                  </Text>
                                  Use our intuitive web builder at{" "}
                                  <Link
                                    color="blue.500"
                                    onClick={() => navigate("/builder")}
                                  >
                                    /builder
                                  </Link>
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiCheck} color="green.500" />
                                  <Text display="inline" fontWeight="bold">
                                    CLI:{" "}
                                  </Text>
                                  Run <Code>pwa-template-generator</Code> in
                                  your terminal
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiCheck} color="green.500" />
                                  <Text display="inline" fontWeight="bold">
                                    API:{" "}
                                  </Text>
                                  Integrate with our REST API for programmatic
                                  access
                                </ListItem>
                              </List>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Card variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="start">
                              <Heading size="md">⚡ Quick Example</Heading>
                              <Code
                                p={4}
                                w="full"
                                borderRadius="md"
                                whiteSpace="pre-wrap"
                              >
                                {`# Start the generator
pwa-template-generator

# Follow the interactive prompts
✓ Business name: My Awesome Business
✓ Industry: Small Business
✓ Framework: React
✓ Features: Contact Form, Gallery, Testimonials

# Your PWA is generated!
✓ Project created successfully
✓ 42 files generated
✓ Ready for development`}
                              </Code>
                            </VStack>
                          </CardBody>
                        </Card>
                      </VStack>
                    </TabPanel>

                    {/* Frameworks */}
                    <TabPanel>
                      <VStack spacing={8} align="stretch">
                        <VStack spacing={4} align="start">
                          <Heading size="lg">Supported Frameworks</Heading>
                          <Text color="gray.600">
                            Choose from 6 popular frameworks, each optimized for
                            different use cases
                          </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          {frameworks.map((framework, index) => (
                            <MotionCard
                              key={framework.name}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              variant="outline"
                              whileHover={{ y: -5 }}
                            >
                              <CardBody>
                                <HStack spacing={4}>
                                  <Icon
                                    as={framework.icon}
                                    boxSize={12}
                                    color={framework.color}
                                  />
                                  <VStack align="start" spacing={1}>
                                    <Heading size="md">
                                      {framework.name}
                                    </Heading>
                                    <Text fontSize="sm" color="gray.600">
                                      {framework.description}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </MotionCard>
                          ))}
                        </SimpleGrid>

                        <Card variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="start">
                              <Heading size="md">
                                🎯 Framework Selection Guide
                              </Heading>
                              <TableContainer w="full">
                                <Table variant="simple">
                                  <Thead>
                                    <Tr>
                                      <Th>Framework</Th>
                                      <Th>Best For</Th>
                                      <Th>Performance</Th>
                                      <Th>Learning Curve</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    <Tr>
                                      <Td>React</Td>
                                      <Td>General purpose, large ecosystem</Td>
                                      <Td>High</Td>
                                      <Td>Medium</Td>
                                    </Tr>
                                    <Tr>
                                      <Td>Next.js</Td>
                                      <Td>Full-stack apps, SSR</Td>
                                      <Td>Very High</Td>
                                      <Td>Medium</Td>
                                    </Tr>
                                    <Tr>
                                      <Td>Vue.js</Td>
                                      <Td>Progressive enhancement</Td>
                                      <Td>High</Td>
                                      <Td>Low</Td>
                                    </Tr>
                                    <Tr>
                                      <Td>Angular</Td>
                                      <Td>Enterprise applications</Td>
                                      <Td>High</Td>
                                      <Td>High</Td>
                                    </Tr>
                                    <Tr>
                                      <Td>Svelte</Td>
                                      <Td>Performance-critical apps</Td>
                                      <Td>Very High</Td>
                                      <Td>Low</Td>
                                    </Tr>
                                  </Tbody>
                                </Table>
                              </TableContainer>
                            </VStack>
                          </CardBody>
                        </Card>
                      </VStack>
                    </TabPanel>

                    {/* Features */}
                    <TabPanel>
                      <VStack spacing={8} align="stretch">
                        <VStack spacing={4} align="start">
                          <Heading size="lg">Available Features</Heading>
                          <Text color="gray.600">
                            Our generator includes enterprise-grade features out
                            of the box
                          </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          {features.map((feature) => (
                            <Card key={feature.name} variant="outline">
                              <CardBody>
                                <HStack spacing={3}>
                                  <Icon as={FiCheck} color="green.500" />
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold">
                                      {feature.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                      {feature.description}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>

                        <Card variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="start">
                              <Heading size="md">🛡️ Security Features</Heading>
                              <List spacing={2}>
                                <ListItem>
                                  <ListIcon as={FiShield} color="green.500" />
                                  OAuth 2.0 integration (Google, Microsoft,
                                  GitHub)
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiShield} color="green.500" />
                                  Role-based access control (RBAC)
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiShield} color="green.500" />
                                  CSRF protection and XSS prevention
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiShield} color="green.500" />
                                  Content Security Policy (CSP)
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiShield} color="green.500" />
                                  API rate limiting and DDoS protection
                                </ListItem>
                              </List>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Card variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="start">
                              <Heading size="md">
                                ⚡ Performance Features
                              </Heading>
                              <List spacing={2}>
                                <ListItem>
                                  <ListIcon as={FiZap} color="orange.500" />
                                  Core Web Vitals optimization (LCP, FID, CLS)
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiZap} color="orange.500" />
                                  Advanced service worker with caching
                                  strategies
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiZap} color="orange.500" />
                                  Code splitting and lazy loading
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiZap} color="orange.500" />
                                  Image optimization (WebP, AVIF)
                                </ListItem>
                                <ListItem>
                                  <ListIcon as={FiZap} color="orange.500" />
                                  Bundle optimization and tree shaking
                                </ListItem>
                              </List>
                            </VStack>
                          </CardBody>
                        </Card>
                      </VStack>
                    </TabPanel>

                    {/* Deployment */}
                    <TabPanel>
                      <VStack spacing={8} align="stretch">
                        <VStack spacing={4} align="start">
                          <Heading size="lg">Deployment Options</Heading>
                          <Text color="gray.600">
                            Deploy your PWA to any platform with our automated
                            deployment configurations
                          </Text>
                        </VStack>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          {deploymentPlatforms.map((platform) => (
                            <Card key={platform.name} variant="outline">
                              <CardBody>
                                <VStack align="start" spacing={3}>
                                  <HStack justify="space-between" w="full">
                                    <Heading size="md">{platform.name}</Heading>
                                    <Badge colorScheme="blue">Supported</Badge>
                                  </HStack>
                                  <Text fontSize="sm" color="gray.600">
                                    {platform.description}
                                  </Text>
                                  <Text fontSize="sm" fontWeight="bold">
                                    Setup: {platform.setup}
                                  </Text>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>

                        <Card variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="start">
                              <Heading size="md">
                                🚀 Deployment Commands
                              </Heading>
                              <Code
                                p={4}
                                w="full"
                                borderRadius="md"
                                whiteSpace="pre-wrap"
                              >
                                {`# Build your project
npm run build

# Deploy to Netlify
npm run deploy:netlify

# Deploy to Vercel
npm run deploy:vercel

# Deploy to AWS
npm run deploy:aws

# Deploy to Azure
npm run deploy:azure`}
                              </Code>
                            </VStack>
                          </CardBody>
                        </Card>

                        <Alert status="info" borderRadius="lg">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>CI/CD Integration</AlertTitle>
                            <AlertDescription>
                              All generated projects include GitHub Actions,
                              GitLab CI, and Azure DevOps pipeline
                              configurations for automated deployment.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      </VStack>
                    </TabPanel>

                    {/* FAQ */}
                    <TabPanel>
                      <VStack spacing={8} align="stretch">
                        <VStack spacing={4} align="start">
                          <Heading size="lg">
                            Frequently Asked Questions
                          </Heading>
                          <Text color="gray.600">
                            Common questions about the PWA Generator
                          </Text>
                        </VStack>

                        <VStack spacing={6} align="stretch">
                          <Card variant="outline">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack spacing={2}>
                                  <Icon as={FiHelpCircle} color="blue.500" />
                                  <Heading size="md">
                                    How is this different from PWABuilder?
                                  </Heading>
                                </HStack>
                                <Text color="gray.600">
                                  PWABuilder only converts existing websites to
                                  PWAs. Our generator creates complete,
                                  production-ready applications from scratch
                                  with AI-powered business intelligence,
                                  multi-framework support, and enterprise
                                  features.
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>

                          <Card variant="outline">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack spacing={2}>
                                  <Icon as={FiHelpCircle} color="blue.500" />
                                  <Heading size="md">
                                    Do I need an OpenAI API key?
                                  </Heading>
                                </HStack>
                                <Text color="gray.600">
                                  The OpenAI API key is optional. Without it,
                                  you'll still get great templates and features,
                                  but you'll miss out on AI-powered business
                                  analysis and personalized recommendations.
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>

                          <Card variant="outline">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack spacing={2}>
                                  <Icon as={FiHelpCircle} color="blue.500" />
                                  <Heading size="md">
                                    Can I customize the generated code?
                                  </Heading>
                                </HStack>
                                <Text color="gray.600">
                                  Absolutely! The generated code is clean,
                                  well-structured, and fully customizable. No
                                  vendor lock-in - it's your code to modify as
                                  needed.
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>

                          <Card variant="outline">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack spacing={2}>
                                  <Icon as={FiHelpCircle} color="blue.500" />
                                  <Heading size="md">
                                    What about TypeScript support?
                                  </Heading>
                                </HStack>
                                <Text color="gray.600">
                                  All frameworks support TypeScript by default.
                                  We generate type-safe code with proper
                                  interfaces and strict TypeScript
                                  configuration.
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>

                          <Card variant="outline">
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack spacing={2}>
                                  <Icon as={FiHelpCircle} color="blue.500" />
                                  <Heading size="md">
                                    How do I get help?
                                  </Heading>
                                </HStack>
                                <Text color="gray.600">
                                  Check our{" "}
                                  <Link
                                    color="blue.500"
                                    href="https://github.com/MarkHays/pwa-template-generator/issues"
                                    isExternal
                                  >
                                    GitHub Issues
                                  </Link>
                                  , join our{" "}
                                  <Link
                                    color="blue.500"
                                    href="https://discord.gg/pwa-generator"
                                    isExternal
                                  >
                                    Discord community
                                  </Link>
                                  , or email us at{" "}
                                  <Link
                                    color="blue.500"
                                    href="mailto:hello@pwa-generator.com"
                                  >
                                    hello@pwa-generator.com
                                  </Link>
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        </VStack>

                        <Alert status="warning" borderRadius="lg">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Need Enterprise Support?</AlertTitle>
                            <AlertDescription>
                              We offer premium support, custom integrations, and
                              enterprise features. Contact us for a
                              consultation.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </MotionBox>

          {/* CTA Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              shadow="lg"
            >
              <CardBody py={8}>
                <VStack spacing={6} textAlign="center" color="white">
                  <Heading size="lg">
                    Ready to Build Your Enterprise PWA?
                  </Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    Join thousands of developers building amazing Progressive
                    Web Apps
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<FiPlay />}
                      bg="white"
                      color="blue.600"
                      size="lg"
                      onClick={() => navigate("/builder")}
                      _hover={{ bg: "gray.100" }}
                    >
                      Start Building
                    </Button>
                    <Button
                      leftIcon={<FiGithub />}
                      variant="outline"
                      borderColor="white"
                      color="white"
                      size="lg"
                      onClick={() =>
                        window.open(
                          "https://github.com/MarkHays/pwa-template-generator",
                          "_blank",
                        )
                      }
                      _hover={{ bg: "whiteAlpha.200" }}
                    >
                      Star on GitHub
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default DocsPage;
