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
  RadioGroup,
  Radio,
  List,
  ListItem,
  ListIcon,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiCode,
  FiZap,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiLayers,
  FiSettings,
  FiArrowRight,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";
import { toast } from "react-hot-toast";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface Framework {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  popularity: number;
  learningCurve: "Easy" | "Medium" | "Hard";
  performance: number;
  ecosystem: number;
  recommended?: boolean;
}

const FRAMEWORKS: Framework[] = [
  {
    id: "react",
    name: "React",
    description:
      "A JavaScript library for building user interfaces with component-based architecture.",
    icon: FiCode,
    color: "blue",
    pros: [
      "Large ecosystem and community",
      "Component reusability",
      "Virtual DOM for performance",
      "Strong TypeScript support",
      "Excellent developer tools",
    ],
    cons: [
      "Steep learning curve",
      "Rapid ecosystem changes",
      "JSX syntax learning",
    ],
    bestFor: ["Complex applications", "Large teams", "Long-term projects"],
    popularity: 95,
    learningCurve: "Medium",
    performance: 90,
    ecosystem: 95,
    recommended: true,
  },
  {
    id: "vue",
    name: "Vue.js",
    description:
      "The Progressive JavaScript Framework with an approachable, versatile core.",
    icon: FiLayers,
    color: "green",
    pros: [
      "Gentle learning curve",
      "Excellent documentation",
      "Template-based approach",
      "Great performance",
      "Vue CLI tooling",
    ],
    cons: [
      "Smaller ecosystem than React",
      "Less job market demand",
      "Newer framework",
    ],
    bestFor: [
      "Small to medium projects",
      "Teams new to frameworks",
      "Rapid prototyping",
    ],
    popularity: 85,
    learningCurve: "Easy",
    performance: 85,
    ecosystem: 80,
  },
  {
    id: "angular",
    name: "Angular",
    description:
      "A platform for building mobile and desktop web applications using TypeScript.",
    icon: FiShield,
    color: "red",
    pros: [
      "Full framework solution",
      "TypeScript by default",
      "Powerful CLI",
      "Enterprise-ready",
      "Comprehensive tooling",
    ],
    cons: [
      "Steep learning curve",
      "Complex for simple apps",
      "Large bundle size",
    ],
    bestFor: [
      "Enterprise applications",
      "Large teams",
      "Complex business logic",
    ],
    popularity: 75,
    learningCurve: "Hard",
    performance: 80,
    ecosystem: 85,
  },
  {
    id: "svelte",
    name: "Svelte",
    description:
      "A radical new approach to building user interfaces with compile-time optimizations.",
    icon: FiZap,
    color: "orange",
    pros: [
      "No runtime overhead",
      "Smaller bundle sizes",
      "Easy to learn",
      "Great performance",
      "Modern syntax",
    ],
    cons: [
      "Smaller ecosystem",
      "Limited job market",
      "Fewer learning resources",
    ],
    bestFor: [
      "Performance-critical apps",
      "Small to medium projects",
      "Modern web development",
    ],
    popularity: 70,
    learningCurve: "Easy",
    performance: 95,
    ecosystem: 65,
  },
];

const FrameworkSelectionStep: React.FC = () => {
  const {
    selectedFramework,
    setSelectedFramework,
    aiRecommendations,
    typescript,
    setTypescript,
    setCurrentStep,
  } = usePWAGeneratorStore();

  const [hoveredFramework, setHoveredFramework] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const handleFrameworkSelect = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    toast.success(
      `${FRAMEWORKS.find((f) => f.id === frameworkId)?.name} selected!`,
    );
  };

  const handleContinue = () => {
    if (selectedFramework) {
      setCurrentStep(3); // Move to features selection
    } else {
      toast.error("Please select a framework to continue");
    }
  };

  const recommendedFramework = FRAMEWORKS.find(
    (f) => f.id === aiRecommendations?.recommendations?.framework,
  );

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
              <Icon as={FiCode} boxSize={8} color="blue.500" />
              <Heading size="lg" color="blue.500">
                Choose Your Framework
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Select the framework that best fits your project needs and team
              expertise. Each framework has its own strengths and ideal use
              cases.
            </Text>
          </VStack>
        </MotionBox>

        {/* AI Recommendation Banner */}
        {recommendedFramework && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card bg="blue.50" borderColor="blue.200" border="2px">
              <CardBody>
                <HStack spacing={4}>
                  <Icon as={FiStar} boxSize={6} color="blue.500" />
                  <Box>
                    <Text fontWeight="bold" color="blue.700" mb={1}>
                      AI Recommendation
                    </Text>
                    <Text color="blue.600">
                      Based on your business needs, we recommend{" "}
                      <Badge colorScheme="blue" mx={1}>
                        {recommendedFramework.name}
                      </Badge>
                      for your PWA. It's ideal for{" "}
                      {recommendedFramework.bestFor.join(", ").toLowerCase()}.
                    </Text>
                  </Box>
                </HStack>
              </CardBody>
            </Card>
          </MotionBox>
        )}

        {/* Framework Selection */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RadioGroup
            value={selectedFramework}
            onChange={handleFrameworkSelect}
          >
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              {FRAMEWORKS.map((framework, index) => (
                <MotionCard
                  key={framework.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  bg={
                    selectedFramework === framework.id
                      ? `${framework.color}.50`
                      : cardBg
                  }
                  border="2px"
                  borderColor={
                    selectedFramework === framework.id
                      ? `${framework.color}.300`
                      : borderColor
                  }
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  _hover={{
                    bg:
                      selectedFramework === framework.id
                        ? `${framework.color}.50`
                        : hoverBg,
                    borderColor: `${framework.color}.300`,
                    transform: "translateY(-4px)",
                    shadow: "lg",
                  }}
                  onClick={() => handleFrameworkSelect(framework.id)}
                  onMouseEnter={() => setHoveredFramework(framework.id)}
                  onMouseLeave={() => setHoveredFramework(null)}
                >
                  {framework.recommended && (
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      colorScheme="yellow"
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      Recommended
                    </Badge>
                  )}

                  <CardHeader>
                    <HStack spacing={4} align="start">
                      <Radio
                        value={framework.id}
                        size="lg"
                        colorScheme={framework.color}
                      />
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack spacing={3}>
                          <Icon
                            as={framework.icon}
                            boxSize={8}
                            color={`${framework.color}.500`}
                          />
                          <Box>
                            <Heading size="md" color={`${framework.color}.600`}>
                              {framework.name}
                            </Heading>
                            <Text fontSize="sm" color="gray.600">
                              {framework.description}
                            </Text>
                          </Box>
                        </HStack>
                      </VStack>
                    </HStack>
                  </CardHeader>

                  <CardBody pt={0}>
                    <VStack spacing={4} align="stretch">
                      {/* Stats */}
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>
                          <Text fontSize="xs" color="gray.500" mb={1}>
                            POPULARITY
                          </Text>
                          <HStack spacing={2}>
                            <Text fontSize="sm" fontWeight="bold">
                              {framework.popularity}%
                            </Text>
                            <Box
                              w="40px"
                              h="4px"
                              bg="gray.200"
                              borderRadius="full"
                              overflow="hidden"
                            >
                              <Box
                                w={`${framework.popularity}%`}
                                h="full"
                                bg={`${framework.color}.400`}
                                transition="width 0.3s ease"
                              />
                            </Box>
                          </HStack>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.500" mb={1}>
                            LEARNING CURVE
                          </Text>
                          <Badge
                            colorScheme={
                              framework.learningCurve === "Easy"
                                ? "green"
                                : framework.learningCurve === "Medium"
                                  ? "yellow"
                                  : "red"
                            }
                            fontSize="xs"
                          >
                            {framework.learningCurve}
                          </Badge>
                        </Box>
                      </Grid>

                      {/* Best For */}
                      <Box>
                        <Text fontSize="xs" color="gray.500" mb={2}>
                          BEST FOR
                        </Text>
                        <HStack spacing={2} wrap="wrap">
                          {framework.bestFor.map((item, idx) => (
                            <Badge
                              key={idx}
                              colorScheme={framework.color}
                              fontSize="xs"
                              variant="subtle"
                            >
                              {item}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>

                      {/* Pros (shown on hover or selection) */}
                      {(hoveredFramework === framework.id ||
                        selectedFramework === framework.id) && (
                        <Box>
                          <Text fontSize="xs" color="gray.500" mb={2}>
                            KEY BENEFITS
                          </Text>
                          <List spacing={1}>
                            {framework.pros.slice(0, 3).map((pro, idx) => (
                              <ListItem key={idx} fontSize="xs">
                                <ListIcon
                                  as={FiCheckCircle}
                                  color="green.500"
                                />
                                {pro}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </Grid>
          </RadioGroup>
        </MotionBox>

        {/* TypeScript Option */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <HStack spacing={4} justify="space-between">
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <Icon as={FiSettings} boxSize={5} color="purple.500" />
                    <Heading size="md">TypeScript Support</Heading>
                  </HStack>
                  <Text color="gray.600">
                    Add type safety, better IDE support, and improved developer
                    experience. Highly recommended for larger projects and
                    teams.
                  </Text>
                </VStack>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="typescript-toggle" mb="0" mr={3}>
                    Use TypeScript
                  </FormLabel>
                  <Switch
                    id="typescript-toggle"
                    colorScheme="purple"
                    size="lg"
                    isChecked={typescript}
                    onChange={(e) => setTypescript(e.target.checked)}
                  />
                </FormControl>
              </HStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Framework Details (if selected) */}
        {selectedFramework && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">
                  {FRAMEWORKS.find((f) => f.id === selectedFramework)?.name}{" "}
                  Details
                </Heading>
              </CardHeader>
              <CardBody>
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={8}
                >
                  <Box>
                    <Text fontWeight="bold" mb={3} color="green.600">
                      Advantages
                    </Text>
                    <List spacing={2}>
                      {FRAMEWORKS.find(
                        (f) => f.id === selectedFramework,
                      )?.pros.map((pro, idx) => (
                        <ListItem key={idx} fontSize="sm">
                          <ListIcon as={FiCheckCircle} color="green.500" />
                          {pro}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={3} color="orange.600">
                      Considerations
                    </Text>
                    <List spacing={2}>
                      {FRAMEWORKS.find(
                        (f) => f.id === selectedFramework,
                      )?.cons.map((con, idx) => (
                        <ListItem key={idx} fontSize="sm">
                          <ListIcon as={FiSettings} color="orange.500" />
                          {con}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </CardBody>
            </Card>
          </MotionBox>
        )}

        {/* Continue Button */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Flex justify="flex-end">
            <Button
              colorScheme="blue"
              size="lg"
              rightIcon={<FiArrowRight />}
              onClick={handleContinue}
              isDisabled={!selectedFramework}
            >
              Continue to Features
            </Button>
          </Flex>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default FrameworkSelectionStep;
