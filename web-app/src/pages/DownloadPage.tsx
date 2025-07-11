import React from "react";
import { toast } from "react-hot-toast";
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  List,
  ListItem,
  ListIcon,
  Divider,
  Link,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiDownload,
  FiCheck,
  FiExternalLink,
  FiFolder,
  FiCode,
  FiZap,
  FiArrowLeft,
  FiGithub,
  FiBook,
  FiHeart,
  FiStar,
  FiPlay,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../store/PWAGeneratorStore";

const MotionBox = motion(Box);

const DownloadPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    generatedProject,
    businessInfo,
    selectedFramework,
    selectedFeatures,
  } = usePWAGeneratorStore();

  const cardBg = useColorModeValue("white", "gray.800");
  const bgGradient = useColorModeValue(
    "linear(to-br, green.50, blue.50)",
    "linear(to-br, gray.900, green.900)",
  );

  const handleDownload = () => {
    if (generatedProject?.downloadUrl) {
      const element = document.createElement("a");
      element.href = generatedProject.downloadUrl;
      element.download = `${generatedProject.name.toLowerCase().replace(/\s+/g, "-")}.zip`;
      element.click();
    } else {
      toast.error("No project available for download");
    }
  };

  const handleStartNew = () => {
    navigate("/builder");
  };

  const downloadData = {
    title: generatedProject?.name || businessInfo.businessName || "My PWA",
    framework: generatedProject?.framework || selectedFramework || "react",
    features: generatedProject?.features || selectedFeatures || [],
    filesGenerated: generatedProject?.files?.length || 0,
    bundleSize: "245KB",
    downloadSize: "1.2MB",
    estimatedSetupTime: "5 minutes",
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Success Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody py={8}>
                <VStack spacing={6} textAlign="center">
                  <Box
                    w={20}
                    h={20}
                    bg="green.100"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiCheck} w={10} h={10} color="green.500" />
                  </Box>
                  <VStack spacing={2}>
                    <Heading size="xl" color="green.600">
                      PWA Generated Successfully!
                    </Heading>
                    <Text fontSize="lg" color="gray.600">
                      Your enterprise-grade Progressive Web App is ready for
                      download
                    </Text>
                  </VStack>
                  <Badge
                    colorScheme="green"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="md"
                  >
                    🎉 Generation Complete
                  </Badge>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Download Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <VStack spacing={6}>
                  <HStack justify="space-between" w="full">
                    <VStack align="start" spacing={1}>
                      <Heading size="lg">{downloadData.title}</Heading>
                      <HStack spacing={3}>
                        <Badge colorScheme="blue">
                          {downloadData.framework}
                        </Badge>
                        <Badge colorScheme="purple">
                          {downloadData.features.length} features
                        </Badge>
                        <Badge colorScheme="green">
                          {downloadData.downloadSize}
                        </Badge>
                      </HStack>
                    </VStack>
                    <Button
                      leftIcon={<FiDownload />}
                      colorScheme="blue"
                      size="lg"
                      onClick={handleDownload}
                    >
                      Download Project
                    </Button>
                  </HStack>

                  <Divider />

                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                    <VStack spacing={2}>
                      <Icon as={FiFolder} boxSize={6} color="blue.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        {downloadData.filesGenerated}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Files Generated
                      </Text>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiZap} boxSize={6} color="green.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        {downloadData.bundleSize}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Optimized Bundle
                      </Text>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiPlay} boxSize={6} color="purple.500" />
                      <Text fontSize="lg" fontWeight="bold">
                        {downloadData.estimatedSetupTime}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Setup Time
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Setup Instructions */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <VStack align="start" spacing={6}>
                  <Heading size="md">🚀 Quick Setup Guide</Heading>

                  <List spacing={4} w="full">
                    <ListItem>
                      <ListIcon as={FiCheck} color="green.500" />
                      <Text display="inline" fontWeight="bold">
                        Extract the downloaded ZIP file
                      </Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCode} color="blue.500" />
                      <Text display="inline" fontWeight="bold">
                        Navigate to project directory:
                      </Text>
                      <Code ml={2} px={2} py={1}>
                        cd{" "}
                        {businessInfo.businessName
                          ?.toLowerCase()
                          .replace(/\s+/g, "-") || "my-pwa"}
                      </Code>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiDownload} color="purple.500" />
                      <Text display="inline" fontWeight="bold">
                        Install dependencies:
                      </Text>
                      <Code ml={2} px={2} py={1}>
                        npm install
                      </Code>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiPlay} color="orange.500" />
                      <Text display="inline" fontWeight="bold">
                        Start development server:
                      </Text>
                      <Code ml={2} px={2} py={1}>
                        npm run dev
                      </Code>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiExternalLink} color="teal.500" />
                      <Text display="inline" fontWeight="bold">
                        Open in browser:
                      </Text>
                      <Code ml={2} px={2} py={1}>
                        http://localhost:3000
                      </Code>
                    </ListItem>
                  </List>

                  <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Pro Tip!</AlertTitle>
                      <AlertDescription>
                        Your PWA is production-ready and includes all the
                        features you selected. Check the README.md file for
                        detailed deployment instructions.
                      </AlertDescription>
                    </Box>
                  </Alert>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Features Summary */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md">✨ Included Features</Heading>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 3 }}
                    spacing={4}
                    w="full"
                  >
                    {downloadData.features.map((feature, index) => (
                      <HStack key={index} spacing={3}>
                        <Icon as={FiCheck} color="green.500" />
                        <Text>
                          {feature
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Text>
                      </HStack>
                    ))}
                    <HStack spacing={3}>
                      <Icon as={FiCheck} color="green.500" />
                      <Text>TypeScript Support</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiCheck} color="green.500" />
                      <Text>PWA Optimizations</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiCheck} color="green.500" />
                      <Text>Responsive Design</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiCheck} color="green.500" />
                      <Text>Performance Optimized</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiCheck} color="green.500" />
                      <Text>SEO Ready</Text>
                    </HStack>
                    <HStack spacing={3}>
                      <Icon as={FiCheck} color="green.500" />
                      <Text>Testing Setup</Text>
                    </HStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Resources & Support */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Card bg={cardBg} shadow="lg">
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                      <Icon as={FiBook} boxSize={6} color="blue.500" />
                      <Heading size="md">Resources</Heading>
                    </HStack>
                    <VStack align="start" spacing={2}>
                      <Link
                        href="/docs"
                        color="blue.500"
                        _hover={{ textDecoration: "underline" }}
                      >
                        📚 Documentation
                      </Link>
                      <Link
                        href="https://github.com/MarkHays/pwa-template-generator"
                        isExternal
                        color="blue.500"
                        _hover={{ textDecoration: "underline" }}
                      >
                        <HStack spacing={1}>
                          <Icon as={FiGithub} />
                          <Text>GitHub Repository</Text>
                        </HStack>
                      </Link>
                      <Link
                        href="/about"
                        color="blue.500"
                        _hover={{ textDecoration: "underline" }}
                      >
                        ℹ️ About PWA Generator
                      </Link>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} shadow="lg">
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <HStack spacing={3}>
                      <Icon as={FiHeart} boxSize={6} color="red.500" />
                      <Heading size="md">What's Next?</Heading>
                    </HStack>
                    <VStack align="start" spacing={2}>
                      <Text>🎨 Customize your design and branding</Text>
                      <Text>🔧 Add your business logic and content</Text>
                      <Text>🚀 Deploy to your preferred platform</Text>
                      <Text>📊 Set up analytics and monitoring</Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </MotionBox>

          {/* Action Buttons */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <VStack spacing={4}>
                  <Text fontSize="lg" fontWeight="bold" textAlign="center">
                    Ready to build another PWA?
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<FiArrowLeft />}
                      variant="outline"
                      onClick={() => navigate("/")}
                    >
                      Home
                    </Button>
                    <Button
                      leftIcon={<FiZap />}
                      colorScheme="blue"
                      onClick={handleStartNew}
                    >
                      Start New Project
                    </Button>
                    <Button
                      leftIcon={<FiStar />}
                      colorScheme="purple"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          "https://github.com/MarkHays/pwa-template-generator",
                          "_blank",
                        )
                      }
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

export default DownloadPage;
