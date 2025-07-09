import React, { useEffect, useState } from "react";
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Divider,
  List,
  ListItem,
  ListIcon,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiZap,
  FiTrendingUp,
  FiCode,
  FiSettings,
  FiCheckCircle,
  FiArrowRight,
  FiStar,
  FiBarChart,
  FiSmartphone,
  FiMonitor,
  FiRefreshCw,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";
import { toast } from "react-hot-toast";

const MotionBox = motion(Box);

const AIRecommendationsStep: React.FC = () => {
  const {
    aiRecommendations,
    isAnalyzing,
    error,
    analyzeBusinessNeeds,
    setCurrentStep,
    setSelectedFramework,
    setSelectedFeatures,
  } = usePWAGeneratorStore();

  const [autoAcceptRecommendations, setAutoAcceptRecommendations] =
    useState(true);
  const [analysisStarted, setAnalysisStarted] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    if (!aiRecommendations.analysis && !isAnalyzing && !analysisStarted) {
      setAnalysisStarted(true);
      analyzeBusinessNeeds();
    }
  }, [
    aiRecommendations.analysis,
    isAnalyzing,
    analysisStarted,
    analyzeBusinessNeeds,
  ]);

  const handleAcceptRecommendations = () => {
    if (aiRecommendations.recommendations) {
      setSelectedFramework(aiRecommendations.recommendations.framework);
      setSelectedFeatures(aiRecommendations.recommendations.features);
      toast.success("AI recommendations accepted!");
      setCurrentStep(2); // Move to framework selection
    }
  };

  const handleRegenerateAnalysis = () => {
    setAnalysisStarted(true);
    analyzeBusinessNeeds();
  };

  if (error) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Analysis Failed!</AlertTitle>
            <AlertDescription>
              {error}. Please try again or contact support if the problem
              persists.
            </AlertDescription>
          </Box>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={handleRegenerateAnalysis}
            ml="auto"
          >
            Retry Analysis
          </Button>
        </Alert>
      </MotionBox>
    );
  }

  if (isAnalyzing) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} align="stretch">
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody py={12}>
              <VStack spacing={6}>
                <Box position="relative">
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                  <Icon
                    as={FiZap}
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    boxSize={6}
                    color="blue.500"
                  />
                </Box>
                <Heading size="lg" textAlign="center">
                  AI is analyzing your business...
                </Heading>
                <Text color="gray.600" textAlign="center" maxW="md">
                  Our AI is processing your business information to create
                  personalized recommendations for your PWA. This includes
                  analyzing your industry, target audience, and competitive
                  landscape.
                </Text>
                <Progress
                  value={85}
                  size="lg"
                  colorScheme="blue"
                  width="300px"
                  borderRadius="full"
                  isAnimated
                />
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </MotionBox>
    );
  }

  if (!aiRecommendations.analysis) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert status="info" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Ready for AI Analysis!</AlertTitle>
            <AlertDescription>
              Click below to start the AI analysis of your business needs.
            </AlertDescription>
          </Box>
          <Button
            colorScheme="blue"
            onClick={() => {
              setAnalysisStarted(true);
              analyzeBusinessNeeds();
            }}
            ml="auto"
          >
            Start Analysis
          </Button>
        </Alert>
      </MotionBox>
    );
  }

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
              <Icon as={FiZap} boxSize={8} color="blue.500" />
              <Heading size="lg" color="blue.500">
                AI Analysis Complete
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Based on your business information, our AI has generated
              personalized recommendations for your PWA. Review the insights
              below and customize as needed.
            </Text>
          </VStack>
        </MotionBox>

        {/* Analysis Results */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs colorScheme="blue" variant="enclosed-colored">
            <TabList>
              <Tab>
                <Icon as={FiBarChart} mr={2} />
                Business Analysis
              </Tab>
              <Tab>
                <Icon as={FiCode} mr={2} />
                Technical Recommendations
              </Tab>
              <Tab>
                <Icon as={FiStar} mr={2} />
                Content Strategy
              </Tab>
              <Tab>
                <Icon as={FiTrendingUp} mr={2} />
                Market Insights
              </Tab>
            </TabList>

            <TabPanels>
              {/* Business Analysis Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Business Overview */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Business Overview</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            Business Type
                          </Text>
                          <Badge colorScheme="blue" fontSize="sm" p={2}>
                            {aiRecommendations.analysis?.businessType}
                          </Badge>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            Target Audience
                          </Text>
                          <Badge colorScheme="green" fontSize="sm" p={2}>
                            {aiRecommendations.analysis?.targetAudience}
                          </Badge>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>

                  {/* Competitive Advantages */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Competitive Advantages</Heading>
                    </CardHeader>
                    <CardBody>
                      <List spacing={3}>
                        {aiRecommendations.analysis?.competitiveAdvantages.map(
                          (advantage, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiCheckCircle} color="green.500" />
                              {advantage}
                            </ListItem>
                          ),
                        )}
                      </List>
                    </CardBody>
                  </Card>

                  {/* User Journey */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Recommended User Journey</Heading>
                    </CardHeader>
                    <CardBody>
                      <HStack spacing={4} wrap="wrap">
                        {aiRecommendations.analysis?.userJourney.map(
                          (step, index) => (
                            <React.Fragment key={index}>
                              <Badge
                                colorScheme="purple"
                                fontSize="sm"
                                p={2}
                                borderRadius="full"
                              >
                                {step}
                              </Badge>
                              {index <
                                aiRecommendations.analysis!.userJourney.length -
                                  1 && (
                                <Icon as={FiArrowRight} color="gray.400" />
                              )}
                            </React.Fragment>
                          ),
                        )}
                      </HStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Technical Recommendations Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Framework Recommendation */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Recommended Framework</Heading>
                    </CardHeader>
                    <CardBody>
                      <HStack spacing={4} align="start">
                        <Icon as={FiCode} boxSize={8} color="blue.500" />
                        <Box>
                          <Text fontSize="xl" fontWeight="bold" mb={2}>
                            {aiRecommendations.recommendations?.framework.toUpperCase()}
                          </Text>
                          <Text color="gray.600" mb={4}>
                            Based on your business needs and target audience,
                            React is the best choice for your PWA. It offers
                            excellent performance, SEO capabilities, and a rich
                            ecosystem.
                          </Text>
                          <HStack spacing={2}>
                            <Badge colorScheme="green">Fast Development</Badge>
                            <Badge colorScheme="blue">SEO Friendly</Badge>
                            <Badge colorScheme="purple">Large Community</Badge>
                          </HStack>
                        </Box>
                      </HStack>
                    </CardBody>
                  </Card>

                  {/* Recommended Features */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Recommended Features</Heading>
                    </CardHeader>
                    <CardBody>
                      <Grid
                        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                        gap={4}
                      >
                        {aiRecommendations.recommendations?.features.map(
                          (feature, index) => (
                            <Box
                              key={index}
                              p={4}
                              bg={statBg}
                              borderRadius="lg"
                              border="1px"
                              borderColor={borderColor}
                            >
                              <HStack spacing={3}>
                                <Icon as={FiSettings} color="green.500" />
                                <Text fontWeight="medium">{feature}</Text>
                              </HStack>
                            </Box>
                          ),
                        )}
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Performance Goals */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Performance Targets</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <Stat>
                          <StatLabel>Largest Contentful Paint</StatLabel>
                          <StatNumber>
                            {aiRecommendations.recommendations?.performance.lcp}
                            s
                          </StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            Excellent
                          </StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>First Input Delay</StatLabel>
                          <StatNumber>
                            {aiRecommendations.recommendations?.performance.fid}
                            ms
                          </StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            Excellent
                          </StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Cumulative Layout Shift</StatLabel>
                          <StatNumber>
                            {aiRecommendations.recommendations?.performance.cls}
                          </StatNumber>
                          <StatHelpText>
                            <StatArrow type="increase" />
                            Excellent
                          </StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Content Strategy Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Hero Content */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Hero Section</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            Hero Title
                          </Text>
                          <Text fontSize="lg" color="blue.600">
                            {aiRecommendations.content?.heroTitle}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            Hero Subtitle
                          </Text>
                          <Text color="gray.600">
                            {aiRecommendations.content?.heroSubtitle}
                          </Text>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* CTA Suggestions */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Call-to-Action Suggestions</Heading>
                    </CardHeader>
                    <CardBody>
                      <HStack spacing={4} wrap="wrap">
                        {aiRecommendations.content?.ctaTexts.map(
                          (cta, index) => (
                            <Button
                              key={index}
                              colorScheme="blue"
                              variant="outline"
                              size="sm"
                            >
                              {cta}
                            </Button>
                          ),
                        )}
                      </HStack>
                    </CardBody>
                  </Card>

                  {/* SEO Recommendations */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">SEO Strategy</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="start">
                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            Meta Description
                          </Text>
                          <Text color="gray.600">
                            {aiRecommendations.content?.metaDescription}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontWeight="bold" mb={2}>
                            Target Keywords
                          </Text>
                          <HStack spacing={2} wrap="wrap">
                            {aiRecommendations.content?.keywords.map(
                              (keyword, index) => (
                                <Badge key={index} colorScheme="orange">
                                  {keyword}
                                </Badge>
                              ),
                            )}
                          </HStack>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Market Insights Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Market Trends */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Market Trends</Heading>
                    </CardHeader>
                    <CardBody>
                      <List spacing={3}>
                        {aiRecommendations.insights?.marketTrends.map(
                          (trend, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiTrendingUp} color="green.500" />
                              {trend}
                            </ListItem>
                          ),
                        )}
                      </List>
                    </CardBody>
                  </Card>

                  {/* AI Recommendations */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">AI Recommendations</Heading>
                    </CardHeader>
                    <CardBody>
                      <List spacing={3}>
                        {aiRecommendations.insights?.recommendations.map(
                          (rec, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiStar} color="yellow.500" />
                              {rec}
                            </ListItem>
                          ),
                        )}
                      </List>
                    </CardBody>
                  </Card>

                  {/* Device Preferences */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Device Optimization</Heading>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <HStack spacing={4}>
                          <Icon
                            as={FiSmartphone}
                            boxSize={8}
                            color="blue.500"
                          />
                          <Box>
                            <Text fontWeight="bold">Mobile First</Text>
                            <Text fontSize="sm" color="gray.600">
                              Prioritize mobile user experience
                            </Text>
                          </Box>
                        </HStack>
                        <HStack spacing={4}>
                          <Icon as={FiMonitor} boxSize={8} color="green.500" />
                          <Box>
                            <Text fontWeight="bold">Desktop Ready</Text>
                            <Text fontSize="sm" color="gray.600">
                              Seamless desktop experience
                            </Text>
                          </Box>
                        </HStack>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MotionBox>

        {/* Action Controls */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack spacing={6}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="auto-accept" mb="0">
                    Auto-accept AI recommendations
                  </FormLabel>
                  <Switch
                    id="auto-accept"
                    colorScheme="blue"
                    isChecked={autoAcceptRecommendations}
                    onChange={(e) =>
                      setAutoAcceptRecommendations(e.target.checked)
                    }
                  />
                </FormControl>

                <Divider />

                <HStack spacing={4} width="full" justify="space-between">
                  <Button
                    variant="outline"
                    leftIcon={<FiRefreshCw />}
                    onClick={handleRegenerateAnalysis}
                    isLoading={isAnalyzing}
                  >
                    Regenerate Analysis
                  </Button>

                  <Button
                    colorScheme="blue"
                    size="lg"
                    rightIcon={<FiArrowRight />}
                    onClick={handleAcceptRecommendations}
                  >
                    Accept Recommendations
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default AIRecommendationsStep;
