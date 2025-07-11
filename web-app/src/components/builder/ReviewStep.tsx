import React from "react";
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
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Code,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiEye,
  FiDownload,
  FiZap,
  FiUser,
  FiCode,
  FiSliders,
  FiCloud,
  FiStar,
  FiEdit,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

const ReviewStep: React.FC = () => {
  const {
    businessInfo,
    aiRecommendations,
    selectedFramework,
    selectedFeatures,
    typescript,
    customization,
    deployment,
    isGenerating,
    generationProgress,
    generationStep,
    generateProject,
    setCurrentStep,
  } = usePWAGeneratorStore();

  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleGenerate = async () => {
    try {
      await generateProject();
      toast.success("PWA generated successfully!");
      navigate("/download");
    } catch (error) {
      toast.error("Failed to generate PWA. Please try again.");
    }
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const estimatedGenerationTime = selectedFeatures.length * 2 + 10; // Mock calculation
  const complexityScore =
    selectedFeatures.length +
    (typescript ? 1 : 0) +
    deployment.platforms.length;

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
              <Icon as={FiEye} boxSize={8} color="blue.500" />
              <Heading size="lg" color="blue.500">
                Review & Generate
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Review your PWA configuration and generate your project. All
              settings can be modified later in the generated code.
            </Text>
          </VStack>
        </MotionBox>

        {/* Generation Progress */}
        {isGenerating && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box w="full">
                <AlertTitle>Generating Your PWA...</AlertTitle>
                <AlertDescription mb={4}>
                  {generationStep} - Please wait while we create your project.
                </AlertDescription>
                <Progress
                  value={generationProgress}
                  colorScheme="blue"
                  borderRadius="full"
                  size="lg"
                />
              </Box>
            </Alert>
          </MotionBox>
        )}

        {/* Generation Stats */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Generation Overview</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Stat>
                  <StatLabel>Estimated Time</StatLabel>
                  <StatNumber>{estimatedGenerationTime}s</StatNumber>
                  <StatHelpText>Based on selected features</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Complexity Score</StatLabel>
                  <StatNumber>{complexityScore}/10</StatNumber>
                  <StatHelpText>
                    {complexityScore <= 3
                      ? "Simple"
                      : complexityScore <= 6
                        ? "Moderate"
                        : "Complex"}{" "}
                    project
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Components</StatLabel>
                  <StatNumber>{selectedFeatures.length + 5}</StatNumber>
                  <StatHelpText>Core + selected features</StatHelpText>
                </Stat>
              </SimpleGrid>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Review Sections */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion allowToggle defaultIndex={[0]}>
            {/* Business Information */}
            <AccordionItem>
              <AccordionButton>
                <HStack spacing={3} flex={1} textAlign="left">
                  <Icon as={FiUser} color="blue.500" />
                  <Box>
                    <Text fontWeight="bold">Business Information</Text>
                    <Text fontSize="sm" color="gray.600">
                      {businessInfo.businessName} • {businessInfo.industry}
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiEdit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStep(0);
                    }}
                  >
                    Edit
                  </Button>
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Basic Details
                    </Text>
                    <VStack spacing={2} align="start">
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Name:
                        </Text>
                        <Text fontSize="sm">{businessInfo.businessName}</Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Industry:
                        </Text>
                        <Badge colorScheme="blue">
                          {businessInfo.industry}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Target Audience:
                        </Text>
                        <Text fontSize="sm">{businessInfo.targetAudience}</Text>
                      </HStack>
                      {businessInfo.location && (
                        <HStack>
                          <Text fontSize="sm" color="gray.600">
                            Location:
                          </Text>
                          <Text fontSize="sm">{businessInfo.location}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Contact Information
                    </Text>
                    <VStack spacing={2} align="start">
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Email:
                        </Text>
                        <Text fontSize="sm">{businessInfo.contactEmail}</Text>
                      </HStack>
                      {businessInfo.contactPhone && (
                        <HStack>
                          <Text fontSize="sm" color="gray.600">
                            Phone:
                          </Text>
                          <Text fontSize="sm">{businessInfo.contactPhone}</Text>
                        </HStack>
                      )}
                      {businessInfo.website && (
                        <HStack>
                          <Text fontSize="sm" color="gray.600">
                            Website:
                          </Text>
                          <Text fontSize="sm">{businessInfo.website}</Text>
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                </Grid>
              </AccordionPanel>
            </AccordionItem>

            {/* AI Recommendations */}
            <AccordionItem>
              <AccordionButton>
                <HStack spacing={3} flex={1} textAlign="left">
                  <Icon as={FiZap} color="yellow.500" />
                  <Box>
                    <Text fontWeight="bold">AI Recommendations Applied</Text>
                    <Text fontSize="sm" color="gray.600">
                      {aiRecommendations?.recommendations
                        ? "AI analysis complete"
                        : "No AI recommendations"}
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiEdit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStep(1);
                    }}
                  >
                    Edit
                  </Button>
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                {aiRecommendations?.recommendations ? (
                  <VStack spacing={4} align="stretch">
                    <Grid
                      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                      gap={6}
                    >
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Recommended Framework
                        </Text>
                        <Badge colorScheme="purple" fontSize="sm" p={2}>
                          {aiRecommendations?.recommendations.framework}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Suggested Features
                        </Text>
                        <HStack spacing={2} wrap="wrap">
                          {aiRecommendations?.recommendations.features
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <Badge
                                key={idx}
                                colorScheme="green"
                                fontSize="xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                          {aiRecommendations?.recommendations.features.length >
                            3 && (
                            <Badge colorScheme="gray" fontSize="xs">
                              +
                              {aiRecommendations?.recommendations.features
                                .length - 3}{" "}
                              more
                            </Badge>
                          )}
                        </HStack>
                      </Box>
                    </Grid>
                    {aiRecommendations?.insights?.recommendations && (
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Key Insights
                        </Text>
                        <List spacing={1}>
                          {aiRecommendations?.insights.recommendations
                            .slice(0, 3)
                            .map((insight, idx) => (
                              <ListItem key={idx} fontSize="sm">
                                <ListIcon as={FiStar} color="yellow.500" />
                                {insight}
                              </ListItem>
                            ))}
                        </List>
                      </Box>
                    )}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.600">
                    No AI recommendations available. Consider running the AI
                    analysis for better results.
                  </Text>
                )}
              </AccordionPanel>
            </AccordionItem>

            {/* Technical Configuration */}
            <AccordionItem>
              <AccordionButton>
                <HStack spacing={3} flex={1} textAlign="left">
                  <Icon as={FiCode} color="green.500" />
                  <Box>
                    <Text fontWeight="bold">Technical Configuration</Text>
                    <Text fontSize="sm" color="gray.600">
                      {selectedFramework || "No framework selected"} •{" "}
                      {selectedFeatures.length} features
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiEdit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStep(2);
                    }}
                  >
                    Edit
                  </Button>
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Framework & Language
                    </Text>
                    <VStack spacing={2} align="start">
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Framework:
                        </Text>
                        <Badge colorScheme="blue">
                          {selectedFramework || "Not selected"}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          TypeScript:
                        </Text>
                        <Badge colorScheme={typescript ? "green" : "gray"}>
                          {typescript ? "Enabled" : "Disabled"}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Selected Features
                    </Text>
                    {selectedFeatures.length > 0 ? (
                      <HStack spacing={2} wrap="wrap">
                        {selectedFeatures.map((feature) => (
                          <Badge
                            key={feature}
                            colorScheme="purple"
                            fontSize="xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </HStack>
                    ) : (
                      <Text fontSize="sm" color="gray.600">
                        No features selected
                      </Text>
                    )}
                  </Box>
                </Grid>
              </AccordionPanel>
            </AccordionItem>

            {/* Design & Customization */}
            <AccordionItem>
              <AccordionButton>
                <HStack spacing={3} flex={1} textAlign="left">
                  <Icon as={FiSliders} color="pink.500" />
                  <Box>
                    <Text fontWeight="bold">Design & Customization</Text>
                    <Text fontSize="sm" color="gray.600">
                      {customization.colorScheme} theme •{" "}
                      {customization.fontFamily} font
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiEdit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStep(4);
                    }}
                  >
                    Edit
                  </Button>
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Theme & Colors
                    </Text>
                    <VStack spacing={2} align="start">
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Color Scheme:
                        </Text>
                        <Badge colorScheme="blue">
                          {customization.colorScheme}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Primary Color:
                        </Text>
                        <Box
                          w="20px"
                          h="20px"
                          bg={customization.primaryColor}
                          borderRadius="md"
                          border="1px"
                          borderColor="gray.300"
                        />
                        <Code fontSize="xs">{customization.primaryColor}</Code>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Dark Mode:
                        </Text>
                        <Badge
                          colorScheme={
                            customization.darkMode ? "purple" : "gray"
                          }
                        >
                          {customization.darkMode ? "Enabled" : "Disabled"}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Typography & Layout
                    </Text>
                    <VStack spacing={2} align="start">
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Font Family:
                        </Text>
                        <Badge colorScheme="green">
                          {customization.fontFamily}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Layout:
                        </Text>
                        <Badge colorScheme="orange">
                          {customization.layout}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Animations:
                        </Text>
                        <Badge
                          colorScheme={
                            customization.animations ? "yellow" : "gray"
                          }
                        >
                          {customization.animations ? "Enabled" : "Disabled"}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>
                </Grid>
              </AccordionPanel>
            </AccordionItem>

            {/* Deployment Configuration */}
            <AccordionItem>
              <AccordionButton>
                <HStack spacing={3} flex={1} textAlign="left">
                  <Icon as={FiCloud} color="orange.500" />
                  <Box>
                    <Text fontWeight="bold">Deployment Configuration</Text>
                    <Text fontSize="sm" color="gray.600">
                      {deployment.platforms.length} platform
                      {deployment.platforms.length !== 1 ? "s" : ""}
                      {deployment.domain && ` • ${deployment.domain}`}
                    </Text>
                  </Box>
                </HStack>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<FiEdit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditStep(5);
                    }}
                  >
                    Edit
                  </Button>
                  <AccordionIcon />
                </HStack>
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={6}
                >
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Hosting Platforms
                    </Text>
                    {deployment.platforms.length > 0 ? (
                      <HStack spacing={2} wrap="wrap">
                        {deployment.platforms.map((platform) => (
                          <Badge key={platform} colorScheme="blue">
                            {platform}
                          </Badge>
                        ))}
                      </HStack>
                    ) : (
                      <Text fontSize="sm" color="gray.600">
                        No platforms selected
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      Configuration
                    </Text>
                    <VStack spacing={2} align="start">
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          CI/CD:
                        </Text>
                        <Badge colorScheme="purple">
                          {deployment.cicd || "Not configured"}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          SSL:
                        </Text>
                        <Badge colorScheme={deployment.ssl ? "green" : "red"}>
                          {deployment.ssl ? "Enabled" : "Disabled"}
                        </Badge>
                      </HStack>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          Testing:
                        </Text>
                        <Badge
                          colorScheme={deployment.testing ? "green" : "gray"}
                        >
                          {deployment.testing ? "Enabled" : "Disabled"}
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>
                </Grid>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </MotionBox>

        {/* Generation Actions */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={6}>
                <Alert status="success" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Ready to Generate!</AlertTitle>
                    <AlertDescription>
                      Your PWA configuration is complete. Click the button below
                      to generate your project with all the selected features
                      and configurations.
                    </AlertDescription>
                  </Box>
                </Alert>

                <HStack spacing={4} width="full" justify="space-between">
                  <Button
                    variant="outline"
                    leftIcon={<FiEye />}
                    onClick={onOpen}
                    isDisabled={isGenerating}
                  >
                    Preview Configuration
                  </Button>

                  <Button
                    colorScheme="green"
                    size="lg"
                    leftIcon={<FiDownload />}
                    onClick={handleGenerate}
                    isLoading={isGenerating}
                    loadingText="Generating..."
                  >
                    Generate My PWA
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </VStack>

      {/* Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Configuration Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Project Structure
                </Text>
                <Code p={4} display="block" whiteSpace="pre-wrap" fontSize="xs">
                  {`my-pwa/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── utils/
├── public/
├── package.json
└── README.md`}
                </Code>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Key Features
                </Text>
                <List spacing={1}>
                  <ListItem fontSize="sm">
                    <ListIcon as={FiCheck} color="green.500" />
                    {selectedFramework || "React"} with TypeScript:{" "}
                    {typescript ? "Yes" : "No"}
                  </ListItem>
                  <ListItem fontSize="sm">
                    <ListIcon as={FiCheck} color="green.500" />
                    {selectedFeatures.length} custom features integrated
                  </ListItem>
                  <ListItem fontSize="sm">
                    <ListIcon as={FiCheck} color="green.500" />
                    {customization.colorScheme} theme with custom colors
                  </ListItem>
                  <ListItem fontSize="sm">
                    <ListIcon as={FiCheck} color="green.500" />
                    Ready for deployment to {deployment.platforms.length}{" "}
                    platform{deployment.platforms.length !== 1 ? "s" : ""}
                  </ListItem>
                </List>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReviewStep;
