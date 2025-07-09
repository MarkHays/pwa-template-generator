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
      isComplete: !!aiRecommendations.analysis,
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
    if (stepIndex <= currentStep || steps[stepIndex - 1]?.isComplete) {
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
  const canProceed = steps[currentStep]?.isComplete || currentStep === 0;

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
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Heading size="lg">PWA Builder</Heading>
                    <Text color="gray.600">
                      Create your enterprise PWA with AI-powered intelligence
                    </Text>
                  </VStack>
                  <HStack spacing={3}>
                    <Badge
                      colorScheme="purple"
                      px={3}
                      py={1}
                      borderRadius="full"
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
            <Card bg={cardBg} shadow="lg">
              <CardBody py={6}>
                <VStack spacing={6}>
                  <Progress
                    value={(currentStep / (steps.length - 1)) * 100}
                    size="lg"
                    colorScheme="blue"
                    w="full"
                    borderRadius="full"
                  />

                  {/* Step Indicator */}
                  <Stepper index={activeStep} colorScheme="blue" w="full">
                    {steps.map((step, index) => (
                      <Step key={index}>
                        <StepIndicator
                          cursor={index <= currentStep ? "pointer" : "default"}
                          onClick={() => handleStepClick(index)}
                        >
                          <StepStatus
                            complete={<StepIcon />}
                            incomplete={<StepNumber />}
                            active={<StepNumber />}
                          />
                        </StepIndicator>

                        <Box flexShrink="0">
                          <StepTitle>{step.title}</StepTitle>
                          <StepDescription>{step.description}</StepDescription>
                        </Box>

                        <StepSeparator />
                      </Step>
                    ))}
                  </Stepper>
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
              <Card bg={cardBg} shadow="lg">
                <CardBody>
                  <Flex justify="space-between" align="center">
                    <Button
                      leftIcon={<FiArrowLeft />}
                      onClick={handlePrevious}
                      isDisabled={currentStep === 0 || isGenerating}
                      variant="outline"
                      size="lg"
                    >
                      Previous
                    </Button>

                    <VStack spacing={2}>
                      <Text fontSize="sm" color="gray.600">
                        {currentStep + 1} of {steps.length} steps
                      </Text>
                      {!canProceed && currentStep > 0 && (
                        <Text fontSize="xs" color="orange.500">
                          Complete this step to continue
                        </Text>
                      )}
                    </VStack>

                    {isLastStep ? (
                      <Button
                        rightIcon={<FiDownload />}
                        onClick={handleGenerate}
                        isDisabled={!canProceed || isGenerating}
                        isLoading={isGenerating}
                        loadingText="Generating..."
                        colorScheme="green"
                        size="lg"
                      >
                        Generate PWA
                      </Button>
                    ) : (
                      <Button
                        rightIcon={<FiArrowRight />}
                        onClick={handleNext}
                        isDisabled={!canProceed || isGenerating}
                        colorScheme="blue"
                        size="lg"
                      >
                        Next Step
                      </Button>
                    )}
                  </Flex>
                </CardBody>
              </Card>
            </MotionBox>
          </Box>

          {/* AI Insights Sidebar (if recommendations available) */}
          {aiRecommendations.analysis && (
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              bg={cardBg}
              shadow="lg"
              position="fixed"
              right={4}
              top="50%"
              transform="translateY(-50%)"
              w="300px"
              zIndex={10}
              display={{ base: "none", xl: "block" }}
            >
              <CardHeader>
                <HStack spacing={2}>
                  <Icon as={FiStar} color="yellow.500" />
                  <Heading size="md">AI Insights</Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={4} align="start">
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Recommended Framework
                    </Text>
                    <Badge colorScheme="blue">
                      {aiRecommendations.recommendations?.framework}
                    </Badge>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Performance Target
                    </Text>
                    <HStack spacing={2}>
                      <Icon as={FiTrendingUp} color="green.500" boxSize={4} />
                      <Text fontSize="sm">95+ Lighthouse Score</Text>
                    </HStack>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                      Security Features
                    </Text>
                    <HStack spacing={2}>
                      <Icon as={FiShield} color="orange.500" boxSize={4} />
                      <Text fontSize="sm">Enterprise Security</Text>
                    </HStack>
                  </Box>

                  {aiRecommendations.insights?.recommendations && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>
                        Key Recommendations
                      </Text>
                      <VStack spacing={1} align="start">
                        {aiRecommendations.insights?.recommendations
                          ?.slice(0, 3)
                          .map((rec: string, index: number) => (
                            <Text key={index} fontSize="xs" color="gray.600">
                              • {rec}
                            </Text>
                          ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </MotionCard>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default BuilderPage;
