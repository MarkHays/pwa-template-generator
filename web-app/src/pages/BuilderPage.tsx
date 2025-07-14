import React, { useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Progress,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Icon,
  Badge,
  useColorModeValue,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiSettings,
  FiCode,
  FiZap,
  FiDownload,
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiCloud,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../store/PWAGeneratorStore";
import BusinessInfoStep from "../components/builder/BusinessInfoStep";
import AIRecommendationsStep from "../components/builder/AIRecommendationsStep";
import FrameworkSelectionStep from "../components/builder/FrameworkSelectionStep";
import FeaturesSelectionStep from "../components/builder/FeaturesSelectionStep";
import EnterpriseConfigStep from "../components/builder/EnterpriseConfigStep";
import CustomizationStep from "../components/builder/CustomizationStep";
import DeploymentStep from "../components/builder/DeploymentStep";
import ReviewStep from "../components/builder/ReviewStep";
import { toast } from "react-hot-toast";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface BuilderStep {
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType;
  isComplete?: boolean;
}

const BuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    businessInfo,
    aiRecommendations,
    selectedFramework,
    selectedFeatures,
    enterpriseConfig,
    customization,
    deployment,
    isGenerating,
    generateProject,
    resetBuilder,
  } = usePWAGeneratorStore();

  const cardBg = useColorModeValue("white", "gray.800");
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, blue.900)",
  );

  const steps: BuilderStep[] = [
    {
      title: "Business Info",
      description: "Tell us about your business",
      icon: FiUser,
      component: BusinessInfoStep,
      isComplete: !!businessInfo.businessName,
    },
    {
      title: "AI Analysis",
      description: "Get personalized recommendations",
      icon: FiZap,
      component: AIRecommendationsStep,
      isComplete: !!aiRecommendations?.analysis,
    },
    {
      title: "Framework",
      description: "Choose your tech stack",
      icon: FiCode,
      component: FrameworkSelectionStep,
      isComplete: !!selectedFramework,
    },
    {
      title: "Features",
      description: "Select your features",
      icon: FiSettings,
      component: FeaturesSelectionStep,
      isComplete: selectedFeatures.length > 0,
    },
    {
      title: "Enterprise",
      description: "Configure enterprise features",
      icon: FiShield,
      component: EnterpriseConfigStep,
      isComplete:
        !enterpriseConfig.enabled ||
        (enterpriseConfig.enabled &&
          (enterpriseConfig.authProviders.length > 0 ||
            Boolean(enterpriseConfig.database))),
    },
    {
      title: "Customize",
      description: "Design and styling",
      icon: FiCode,
      component: CustomizationStep,
      isComplete: !!customization.colorScheme,
    },
    {
      title: "Deployment",
      description: "Configure deployment",
      icon: FiCloud,
      component: DeploymentStep,
      isComplete: deployment.platforms.length > 0,
    },
    {
      title: "Review",
      description: "Review and generate",
      icon: FiCheck,
      component: ReviewStep,
      isComplete: false,
    },
  ];

  const { activeStep, setActiveStep } = useSteps({
    index: currentStep,
    count: steps.length,
  });

  useEffect(() => {
    setActiveStep(currentStep);
  }, [currentStep, setActiveStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to completed steps or next step
    if (stepIndex <= currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleGenerate = async () => {
    try {
      await generateProject();
      toast.success("PWA generated successfully!");
      navigate("/preview");
    } catch (error) {
      toast.error("Failed to generate PWA. Please try again.");
      console.error("Generation error:", error);
    }
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to start over? All progress will be lost.")
    ) {
      resetBuilder();
      toast.success("Builder reset successfully");
    }
  };

  const CurrentStepComponent = steps[currentStep]?.component;
  const isLastStep = currentStep === steps.length - 1;

  // More intelligent step completion logic
  const getCurrentStepCompletion = () => {
    switch (currentStep) {
      case 0: // Business Info
        return (
          !!businessInfo.businessName &&
          !!businessInfo.industry &&
          !!businessInfo.description
        );
      case 1: // AI Analysis
        return !!aiRecommendations?.analysis;
      case 2: // Framework
        return !!selectedFramework;
      case 3: // Features
        return selectedFeatures.length > 0;
      case 4: // Enterprise
        return (
          !enterpriseConfig.enabled ||
          (enterpriseConfig.enabled &&
            (enterpriseConfig.authProviders.length > 0 ||
              Boolean(enterpriseConfig.database)))
        );
      case 5: // Customize
        return !!customization.colorScheme;
      case 6: // Deployment
        return deployment.platforms.length > 0;
      case 7: // Review
        return true; // Review step is always "complete"
      default:
        return false;
    }
  };

  const canProceed = getCurrentStepCompletion();

  return (
    <Box minH="100vh" bgGradient={bgGradient} overflow="hidden">
      <Container maxW="7xl" py={8} overflow="hidden">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card bg={cardBg} shadow="lg" overflow="hidden">
              <CardHeader>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify={{ base: "center", md: "space-between" }}
                  align={{ base: "center", md: "center" }}
                  gap={{ base: 4, md: 0 }}
                >
                  <VStack align={{ base: "center", md: "start" }} spacing={1}>
                    <Heading size={{ base: "md", md: "lg" }}>
                      PWA Builder
                    </Heading>
                    <Text
                      color="gray.600"
                      fontSize={{ base: "sm", md: "md" }}
                      textAlign={{ base: "center", md: "left" }}
                    >
                      Create your enterprise PWA with AI-powered intelligence
                      and Phase 2 features
                    </Text>
                  </VStack>
                  <HStack spacing={3}>
                    <Badge
                      colorScheme="purple"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Step {currentStep + 1} of {steps.length}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      leftIcon={<FiArrowLeft />}
                    >
                      Start Over
                    </Button>
                  </HStack>
                </Flex>
              </CardHeader>
            </Card>
          </MotionBox>

          {/* Progress Bar */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card bg={cardBg} shadow="lg" overflow="hidden">
              <CardBody py={{ base: 3, md: 6 }} px={{ base: 3, md: 6 }}>
                <VStack spacing={{ base: 3, md: 6 }}>
                  <Box w="full">
                    <Text
                      fontSize="xs"
                      color="gray.500"
                      mb={2}
                      textAlign="center"
                    >
                      Progress:{" "}
                      {Math.round((currentStep / (steps.length - 1)) * 100)}%
                    </Text>
                    <Progress
                      value={(currentStep / (steps.length - 1)) * 100}
                      size={{ base: "md", md: "lg" }}
                      colorScheme="blue"
                      w="full"
                      borderRadius="full"
                      bg="gray.100"
                      sx={{
                        "& > div": {
                          transition: "width 0.3s ease-in-out",
                        },
                      }}
                    />
                  </Box>

                  {/* Step Indicator */}
                  <Box w="full" overflow="auto" pb={2}>
                    <Stepper
                      index={activeStep}
                      colorScheme="blue"
                      w="full"
                      orientation="horizontal"
                      size={{ base: "sm", md: "md" }}
                      gap={{ base: 0, md: 2 }}
                    >
                      {steps.map((step, index) => (
                        <Step key={index} flex="1">
                          <StepIndicator
                            cursor={
                              index <= currentStep ? "pointer" : "default"
                            }
                            onClick={() => handleStepClick(index)}
                          >
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>

                          <Box
                            ml={{ base: 0, md: 2 }}
                            minW={0}
                            overflow="hidden"
                            display={{ base: "none", lg: "block" }}
                          >
                            <StepTitle
                              fontSize={{ base: "xs", md: "sm" }}
                              noOfLines={1}
                            >
                              {step.title}
                            </StepTitle>
                            <StepDescription
                              fontSize="xs"
                              noOfLines={1}
                              display={{ base: "none", xl: "block" }}
                            >
                              {step.description}
                            </StepDescription>
                          </Box>

                          <StepSeparator />
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  {/* Mobile Step Info */}
                  <Box
                    display={{ base: "block", lg: "none" }}
                    textAlign="center"
                    p={3}
                    bg="blue.50"
                    borderRadius="md"
                    w="full"
                  >
                    <Text fontSize="sm" fontWeight="medium" color="blue.800">
                      {steps[currentStep]?.title}
                    </Text>
                    <Text fontSize="xs" color="blue.600" mt={1}>
                      {steps[currentStep]?.description}
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>

          {/* Main Content */}
          <Box position="relative">
            <AnimatePresence mode="wait">
              <MotionCard
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                bg={cardBg}
                shadow="xl"
                minH="600px"
              >
                <CardHeader>
                  <HStack spacing={4}>
                    <Icon
                      as={steps[currentStep]?.icon}
                      boxSize={8}
                      color="blue.500"
                    />
                    <VStack align="start" spacing={0}>
                      <Heading size="lg">{steps[currentStep]?.title}</Heading>
                      <Text color="gray.600">
                        {steps[currentStep]?.description}
                      </Text>
                    </VStack>
                  </HStack>
                </CardHeader>

                <Divider />

                <CardBody py={8}>
                  {CurrentStepComponent && <CurrentStepComponent />}

                  {isGenerating && (
                    <Alert status="info" borderRadius="lg">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Generating your PWA...</AlertTitle>
                        <AlertDescription>
                          Our AI is creating your enterprise-grade PWA with all
                          the features you selected. This may take a few
                          moments.
                        </AlertDescription>
                      </Box>
                      <Spinner size="lg" ml="auto" />
                    </Alert>
                  )}
                </CardBody>
              </MotionCard>
            </AnimatePresence>

            {/* Navigation Controls */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              mt={6}
            >
              <Card bg={cardBg} shadow="lg" overflow="hidden">
                <CardBody py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="center"
                    gap={{ base: 4, md: 0 }}
                  >
                    <Button
                      leftIcon={<FiArrowLeft />}
                      onClick={handlePrevious}
                      isDisabled={currentStep === 0 || isGenerating}
                      variant="outline"
                      size={{ base: "md", md: "lg" }}
                      w={{ base: "full", md: "auto" }}
                    >
                      Previous
                    </Button>

                    <VStack spacing={2} order={{ base: -1, md: 0 }}>
                      <Text fontSize="sm" color="gray.600" textAlign="center">
                        {currentStep + 1} of {steps.length} steps
                      </Text>
                      {!canProceed && (
                        <Text
                          fontSize="xs"
                          color="orange.500"
                          textAlign="center"
                        >
                          Please complete required fields to continue
                        </Text>
                      )}
                    </VStack>

                    {isLastStep ? (
                      <Button
                        rightIcon={<FiDownload />}
                        onClick={handleGenerate}
                        isDisabled={isGenerating}
                        isLoading={isGenerating}
                        loadingText="Generating..."
                        colorScheme="green"
                        size={{ base: "md", md: "lg" }}
                        w={{ base: "full", md: "auto" }}
                      >
                        Generate PWA
                      </Button>
                    ) : (
                      <Button
                        rightIcon={<FiArrowRight />}
                        onClick={handleNext}
                        isDisabled={!canProceed || isGenerating}
                        colorScheme="blue"
                        size={{ base: "md", md: "lg" }}
                        w={{ base: "full", md: "auto" }}
                      >
                        Continue
                      </Button>
                    )}
                  </Flex>
                </CardBody>
              </Card>
            </MotionBox>
          </Box>

          {/* AI Insights - Moved to top of content area */}
          {aiRecommendations?.analysis && (
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              bg="blue.50"
              borderColor="blue.200"
              borderWidth="1px"
              shadow="sm"
              mb={6}
              overflow="hidden"
            >
              <CardHeader pb={3}>
                <HStack spacing={2} justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={FiStar} color="blue.500" />
                    <Heading size="sm" color="blue.800">
                      AI Insights
                    </Heading>
                  </HStack>
                  <Badge colorScheme="blue" size="sm">
                    Smart Recommendations
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <HStack spacing={6} wrap="wrap">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" fontWeight="medium" color="blue.700">
                      Framework
                    </Text>
                    <Badge colorScheme="blue" size="sm">
                      {aiRecommendations?.recommendations?.framework}
                    </Badge>
                  </VStack>

                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" fontWeight="medium" color="blue.700">
                      Performance
                    </Text>
                    <HStack spacing={1}>
                      <Icon as={FiTrendingUp} color="green.500" boxSize={3} />
                      <Text fontSize="xs">95+ Score</Text>
                    </HStack>
                  </VStack>

                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" fontWeight="medium" color="blue.700">
                      Security
                    </Text>
                    <HStack spacing={1}>
                      <Icon as={FiShield} color="orange.500" boxSize={3} />
                      <Text fontSize="xs">Enterprise</Text>
                    </HStack>
                  </VStack>

                  {aiRecommendations?.insights?.recommendations && (
                    <VStack align="start" spacing={1} flex={1} minW="200px">
                      <Text fontSize="xs" fontWeight="medium" color="blue.700">
                        Key Recommendation
                      </Text>
                      <Text fontSize="xs" color="blue.600">
                        • {aiRecommendations?.insights?.recommendations[0]}
                      </Text>
                    </VStack>
                  )}
                </HStack>
              </CardBody>
            </MotionCard>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BuilderPage;
