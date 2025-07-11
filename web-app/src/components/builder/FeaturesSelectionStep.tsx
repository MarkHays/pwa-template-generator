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
  Switch,
  FormControl,
  FormLabel,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiUser,
  FiCreditCard,
  FiBell,
  FiSearch,
  FiMessageSquare,
  FiStar,
  FiMap,
  FiShare2,
  FiDatabase,
  FiWifi,
  FiBarChart,
  FiShield,
  FiGlobe,
  FiCalendar,
  FiArrowRight,
  FiCheck,
  FiMail,
  FiImage,
  FiMessageCircle,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";
import { toast } from "react-hot-toast";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  category: "core" | "user" | "business" | "technical";
  complexity: "Easy" | "Medium" | "Hard";
  recommended?: boolean;
  dependencies?: string[];
  premium?: boolean;
}

const FEATURES: Feature[] = [
  // Core Features
  {
    id: "auth",
    name: "User Authentication",
    description: "Secure login and registration system with multiple providers",
    icon: FiUser,
    color: "blue",
    category: "core",
    complexity: "Medium",
    recommended: true,
  },
  {
    id: "pwa",
    name: "PWA Features",
    description: "Offline support, push notifications, and app-like experience",
    icon: FiWifi,
    color: "purple",
    category: "core",
    complexity: "Easy",
    recommended: true,
  },
  {
    id: "responsive",
    name: "Responsive Design",
    description: "Mobile-first design that works on all devices",
    icon: FiGlobe,
    color: "green",
    category: "core",
    complexity: "Easy",
    recommended: true,
  },

  // User Features
  {
    id: "profile",
    name: "User Profiles",
    description: "User profile management with avatar and preferences",
    icon: FiUser,
    color: "blue",
    category: "user",
    complexity: "Medium",
    dependencies: ["auth"],
  },
  {
    id: "notifications",
    name: "Push Notifications",
    description: "Real-time notifications for user engagement",
    icon: FiBell,
    color: "orange",
    category: "user",
    complexity: "Medium",
    dependencies: ["pwa"],
  },
  {
    id: "search",
    name: "Search Functionality",
    description: "Advanced search with filters and suggestions",
    icon: FiSearch,
    color: "gray",
    category: "user",
    complexity: "Hard",
  },
  {
    id: "chat",
    name: "Real-time Chat",
    description: "Live messaging and communication features",
    icon: FiMessageSquare,
    color: "teal",
    category: "user",
    complexity: "Hard",
    premium: true,
  },
  {
    id: "gallery",
    name: "Image Gallery",
    description: "Beautiful image galleries and photo showcases",
    icon: FiImage,
    color: "purple",
    category: "user",
    complexity: "Easy",
  },

  // Business Features
  {
    id: "contact-form",
    name: "Contact Forms",
    description: "Professional contact forms and inquiry management",
    icon: FiMail,
    color: "blue",
    category: "business",
    complexity: "Medium",
    recommended: true,
  },
  {
    id: "testimonials",
    name: "Customer Testimonials",
    description: "Showcase customer reviews and success stories",
    icon: FiMessageCircle,
    color: "green",
    category: "business",
    complexity: "Easy",
    recommended: true,
  },
  {
    id: "payments",
    name: "Payment Processing",
    description: "Secure payment integration with multiple providers",
    icon: FiCreditCard,
    color: "green",
    category: "business",
    complexity: "Hard",
    premium: true,
  },
  {
    id: "reviews",
    name: "Reviews & Ratings",
    description: "Customer feedback and rating system",
    icon: FiStar,
    color: "yellow",
    category: "business",
    complexity: "Medium",
  },
  {
    id: "booking",
    name: "Booking System",
    description: "Appointment and reservation management",
    icon: FiCalendar,
    color: "purple",
    category: "business",
    complexity: "Hard",
  },
  {
    id: "geolocation",
    name: "Location Services",
    description: "Maps, GPS, and location-based features",
    icon: FiMap,
    color: "red",
    category: "business",
    complexity: "Medium",
  },

  // Technical Features
  {
    id: "analytics",
    name: "Analytics Dashboard",
    description: "User behavior tracking and business insights",
    icon: FiBarChart,
    color: "blue",
    category: "technical",
    complexity: "Medium",
  },
  {
    id: "security",
    name: "Advanced Security",
    description: "Two-factor auth, encryption, and security monitoring",
    icon: FiShield,
    color: "red",
    category: "technical",
    complexity: "Hard",
    dependencies: ["auth"],
  },
  {
    id: "api",
    name: "REST API",
    description: "Backend API for data management and integrations",
    icon: FiDatabase,
    color: "gray",
    category: "technical",
    complexity: "Hard",
  },
  {
    id: "social",
    name: "Social Sharing",
    description: "Social media integration and sharing features",
    icon: FiShare2,
    color: "pink",
    category: "technical",
    complexity: "Easy",
  },
];

const CATEGORIES = [
  { id: "core", name: "Core Features", color: "blue" },
  { id: "user", name: "User Experience", color: "green" },
  { id: "business", name: "Business Features", color: "purple" },
  { id: "technical", name: "Technical Features", color: "orange" },
];

const FeaturesSelectionStep: React.FC = () => {
  const {
    selectedFeatures,
    setSelectedFeatures,
    aiRecommendations,
    setCurrentStep,
  } = usePWAGeneratorStore();

  const [selectedCategory, setSelectedCategory] = useState<string>("core");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const categoryBg = useColorModeValue("gray.50", "gray.700");

  const handleFeatureToggle = (featureId: string) => {
    const feature = FEATURES.find((f) => f.id === featureId);
    if (!feature) return;

    if (selectedFeatures.includes(featureId)) {
      // Remove feature and its dependents
      const dependentFeatures = FEATURES.filter((f) =>
        f.dependencies?.includes(featureId),
      ).map((f) => f.id);

      const newFeatures = selectedFeatures.filter(
        (id) => id !== featureId && !dependentFeatures.includes(id),
      );

      setSelectedFeatures(newFeatures);
    } else {
      // Add feature and its dependencies
      const dependencies = feature.dependencies || [];
      const newFeatures = [...selectedFeatures, featureId, ...dependencies];
      setSelectedFeatures([...new Set(newFeatures)]);
    }
  };

  const handleContinue = () => {
    if (selectedFeatures.length === 0) {
      toast.error("Please select at least one feature to continue");
      return;
    }
    setCurrentStep(4); // Move to customization step
  };

  const recommendedFeatures =
    aiRecommendations?.recommendations?.features || [];
  const filteredFeatures = FEATURES.filter(
    (feature) =>
      feature.category === selectedCategory &&
      (showAdvanced || feature.complexity !== "Hard"),
  );

  const selectedCount = selectedFeatures.length;
  const recommendedCount = recommendedFeatures.length;

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
              <Icon as={FiSettings} boxSize={8} color="blue.500" />
              <Heading size="lg" color="blue.500">
                Select Your Features
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Choose the features that will make your PWA stand out. Start with
              the recommended features and add more as needed.
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue" px={3} py={1}>
                {selectedCount} selected
              </Badge>
              <Badge colorScheme="green" px={3} py={1}>
                {recommendedCount} recommended
              </Badge>
            </HStack>
          </VStack>
        </MotionBox>

        {/* AI Recommendations */}
        {recommendedFeatures.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>AI Recommendations</AlertTitle>
                <AlertDescription>
                  Based on your business analysis, we recommend these features:
                  {recommendedFeatures.map((featureId) => {
                    const feature = FEATURES.find((f) => f.id === featureId);
                    return feature ? (
                      <Badge key={featureId} colorScheme="blue" mx={1}>
                        {feature.name}
                      </Badge>
                    ) : null;
                  })}
                </AlertDescription>
              </Box>
            </Alert>
          </MotionBox>
        )}

        {/* Category Navigation */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <HStack spacing={4} wrap="wrap">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "solid" : "outline"
                    }
                    colorScheme={category.color}
                    onClick={() => setSelectedCategory(category.id)}
                    size="sm"
                  >
                    {category.name}
                  </Button>
                ))}
                <Divider orientation="vertical" h="20px" />
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="advanced-toggle" mb="0" fontSize="sm">
                    Show Advanced
                  </FormLabel>
                  <Switch
                    id="advanced-toggle"
                    colorScheme="purple"
                    size="sm"
                    isChecked={showAdvanced}
                    onChange={(e) => setShowAdvanced(e.target.checked)}
                  />
                </FormControl>
              </HStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Features Grid */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {filteredFeatures.map((feature, index) => {
              const isSelected = selectedFeatures.includes(feature.id);
              const isRecommended = recommendedFeatures.includes(feature.id);
              const isDisabled = feature.dependencies?.some(
                (dep) => !selectedFeatures.includes(dep),
              );

              return (
                <MotionCard
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  bg={isSelected ? `${feature.color}.50` : cardBg}
                  border="2px"
                  borderColor={
                    isSelected ? `${feature.color}.300` : borderColor
                  }
                  cursor={isDisabled ? "not-allowed" : "pointer"}
                  opacity={isDisabled ? 0.6 : 1}
                  position="relative"
                  _hover={{
                    bg: isSelected ? `${feature.color}.50` : categoryBg,
                    borderColor: `${feature.color}.300`,
                    transform: isDisabled ? "none" : "translateY(-2px)",
                    shadow: isDisabled ? "none" : "md",
                  }}
                  onClick={() => !isDisabled && handleFeatureToggle(feature.id)}
                >
                  {/* Badges */}
                  <Box position="absolute" top={3} right={3}>
                    <VStack spacing={1}>
                      {isRecommended && (
                        <Badge colorScheme="green" fontSize="xs">
                          Recommended
                        </Badge>
                      )}
                      {feature.premium && (
                        <Badge colorScheme="purple" fontSize="xs">
                          Premium
                        </Badge>
                      )}
                    </VStack>
                  </Box>

                  <CardHeader>
                    <HStack spacing={4} align="start">
                      <Checkbox
                        isChecked={isSelected}
                        isDisabled={isDisabled}
                        colorScheme={feature.color}
                        size="lg"
                        onChange={() =>
                          !isDisabled && handleFeatureToggle(feature.id)
                        }
                      />
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack spacing={3}>
                          <Icon
                            as={feature.icon}
                            boxSize={6}
                            color={`${feature.color}.500`}
                          />
                          <Box>
                            <Heading size="sm" color={`${feature.color}.600`}>
                              {feature.name}
                            </Heading>
                            <Text fontSize="xs" color="gray.500">
                              {feature.complexity} complexity
                            </Text>
                          </Box>
                        </HStack>
                      </VStack>
                    </HStack>
                  </CardHeader>

                  <CardBody pt={0}>
                    <VStack spacing={3} align="stretch">
                      <Text fontSize="sm" color="gray.600">
                        {feature.description}
                      </Text>

                      {feature.dependencies &&
                        feature.dependencies.length > 0 && (
                          <Box>
                            <Text fontSize="xs" color="gray.500" mb={1}>
                              REQUIRES:
                            </Text>
                            <HStack spacing={1} wrap="wrap">
                              {feature.dependencies.map((depId) => {
                                const dep = FEATURES.find(
                                  (f) => f.id === depId,
                                );
                                return dep ? (
                                  <Badge
                                    key={depId}
                                    colorScheme={
                                      selectedFeatures.includes(depId)
                                        ? "green"
                                        : "red"
                                    }
                                    fontSize="xs"
                                    variant="subtle"
                                  >
                                    {dep.name}
                                  </Badge>
                                ) : null;
                              })}
                            </HStack>
                          </Box>
                        )}

                      {isSelected && (
                        <HStack spacing={2} align="center">
                          <Icon as={FiCheck} color="green.500" boxSize={4} />
                          <Text
                            fontSize="xs"
                            color="green.600"
                            fontWeight="medium"
                          >
                            Selected
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </CardBody>
                </MotionCard>
              );
            })}
          </Grid>
        </MotionBox>

        {/* Dependencies Info */}
        {selectedFeatures.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Selected Features Summary</Heading>
              </CardHeader>
              <CardBody>
                <HStack spacing={2} wrap="wrap">
                  {selectedFeatures.map((featureId) => {
                    const feature = FEATURES.find((f) => f.id === featureId);
                    return feature ? (
                      <Badge
                        key={featureId}
                        colorScheme={feature.color}
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {feature.name}
                      </Badge>
                    ) : null;
                  })}
                </HStack>
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
              isDisabled={selectedFeatures.length === 0}
            >
              Continue to Customization
            </Button>
          </Flex>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default FeaturesSelectionStep;
