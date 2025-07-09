import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  Badge,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiDownload,
  FiEye,
  FiCode,
  FiSmartphone,
  FiMonitor,
  FiTablet,
  FiZap,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../store/PWAGeneratorStore";

const MotionBox = motion(Box);

const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { businessInfo, selectedFramework, selectedFeatures } =
    usePWAGeneratorStore();

  const cardBg = useColorModeValue("white", "gray.800");
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, blue.900)",
  );

  const handleDownload = () => {
    // In a real implementation, this would trigger the download
    navigate("/download");
  };

  const handleGoBack = () => {
    navigate("/builder");
  };

  const mockPreviewData = {
    title: businessInfo.businessName || "My PWA",
    description: businessInfo.description || "A modern Progressive Web App",
    framework: selectedFramework || "react",
    features: selectedFeatures || ["contact-form", "gallery", "testimonials"],
    filesGenerated: 42,
    bundleSize: "245KB",
    performanceScore: 95,
  };

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
              <CardBody>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">PWA Preview</Heading>
                    <Text color="gray.600">
                      Review your generated Progressive Web App
                    </Text>
                  </VStack>
                  <HStack spacing={3}>
                    <Button
                      leftIcon={<FiArrowLeft />}
                      variant="outline"
                      onClick={handleGoBack}
                    >
                      Back to Builder
                    </Button>
                    <Button
                      leftIcon={<FiDownload />}
                      colorScheme="blue"
                      onClick={handleDownload}
                    >
                      Download Project
                    </Button>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Success Alert */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Alert status="success" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>PWA Generated Successfully!</AlertTitle>
                <AlertDescription>
                  Your enterprise-grade Progressive Web App is ready for
                  download.
                </AlertDescription>
              </Box>
            </Alert>
          </MotionBox>

          {/* Project Info */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <VStack align="start" spacing={6}>
                  <HStack justify="space-between" w="full">
                    <VStack align="start" spacing={1}>
                      <Heading size="md">{mockPreviewData.title}</Heading>
                      <Text color="gray.600">
                        {mockPreviewData.description}
                      </Text>
                    </VStack>
                    <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                      {mockPreviewData.framework.toUpperCase()}
                    </Badge>
                  </HStack>

                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
                    <VStack spacing={2}>
                      <Icon as={FiCode} boxSize={6} color="blue.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        {mockPreviewData.filesGenerated}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Files Generated
                      </Text>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiZap} boxSize={6} color="green.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        {mockPreviewData.bundleSize}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Bundle Size
                      </Text>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiCheck} boxSize={6} color="purple.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        {mockPreviewData.performanceScore}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Performance Score
                      </Text>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiSmartphone} boxSize={6} color="orange.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        {mockPreviewData.features.length}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Features
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Preview Tabs */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <Tabs variant="enclosed" colorScheme="blue">
                  <TabList>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiEye} />
                        <Text>Preview</Text>
                      </HStack>
                    </Tab>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiCode} />
                        <Text>Code</Text>
                      </HStack>
                    </Tab>
                    <Tab>
                      <HStack spacing={2}>
                        <Icon as={FiSmartphone} />
                        <Text>Mobile</Text>
                      </HStack>
                    </Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <VStack spacing={6}>
                        <HStack spacing={4}>
                          <Button
                            leftIcon={<FiMonitor />}
                            size="sm"
                            variant="outline"
                          >
                            Desktop
                          </Button>
                          <Button
                            leftIcon={<FiTablet />}
                            size="sm"
                            variant="outline"
                          >
                            Tablet
                          </Button>
                          <Button
                            leftIcon={<FiSmartphone />}
                            size="sm"
                            variant="outline"
                          >
                            Mobile
                          </Button>
                        </HStack>

                        <Box
                          w="full"
                          h="400px"
                          bg="gray.100"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="gray.200"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <VStack spacing={4}>
                            <Icon as={FiEye} boxSize={12} color="gray.400" />
                            <Text color="gray.500">
                              Interactive preview would appear here
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                              Showing: {mockPreviewData.title}
                            </Text>
                          </VStack>
                        </Box>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack spacing={4} align="stretch">
                        <Text fontWeight="bold">Generated Files:</Text>
                        <Code
                          display="block"
                          whiteSpace="pre"
                          p={4}
                          borderRadius="md"
                        >
                          {`src/
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   └── Contact.tsx
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   └── Services.tsx
├── styles/
│   └── globals.css
├── App.tsx
└── index.tsx`}
                        </Code>
                        <Text fontSize="sm" color="gray.600">
                          {mockPreviewData.filesGenerated} files generated with{" "}
                          {mockPreviewData.framework} and TypeScript
                        </Text>
                      </VStack>
                    </TabPanel>

                    <TabPanel>
                      <VStack spacing={4}>
                        <Text fontWeight="bold">Mobile Optimization</Text>
                        <SimpleGrid columns={2} spacing={4} w="full">
                          <Card variant="outline">
                            <CardBody>
                              <VStack spacing={2}>
                                <Icon as={FiCheck} color="green.500" />
                                <Text fontSize="sm" fontWeight="bold">
                                  Responsive Design
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  Mobile-first approach
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>
                          <Card variant="outline">
                            <CardBody>
                              <VStack spacing={2}>
                                <Icon as={FiCheck} color="green.500" />
                                <Text fontSize="sm" fontWeight="bold">
                                  Touch Optimized
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  44px touch targets
                                </Text>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Features List */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md">Included Features</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    {mockPreviewData.features.map((feature, index) => (
                      <HStack key={index} spacing={3}>
                        <Icon as={FiCheck} color="green.500" />
                        <Text>
                          {feature
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Next Steps */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <VStack spacing={4}>
                  <Heading size="md">Next Steps</Heading>
                  <VStack align="start" spacing={2} w="full">
                    <Text>1. Download your project files</Text>
                    <Text>
                      2. Extract and install dependencies:{" "}
                      <Code>npm install</Code>
                    </Text>
                    <Text>
                      3. Start development server: <Code>npm run dev</Code>
                    </Text>
                    <Text>4. Customize and deploy your PWA</Text>
                  </VStack>
                  <Button
                    leftIcon={<FiDownload />}
                    colorScheme="blue"
                    size="lg"
                    onClick={handleDownload}
                  >
                    Download Project
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default PreviewPage;
