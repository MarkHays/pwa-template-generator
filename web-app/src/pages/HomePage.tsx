import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Badge,
  Card,
  CardBody,
  Flex,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiZap,
  FiCode,
  FiSmartphone,
  FiCloud,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiArrowRight,
  FiCheck,
  FiX,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, pink.50)",
    "linear(to-br, gray.900, blue.900, purple.900)",
  );
  const cardBg = useColorModeValue("white", "gray.800");

  const features = [
    {
      icon: FiZap,
      title: "AI-Powered Intelligence",
      description:
        "Our AI analyzes your business needs and generates personalized recommendations for optimal PWA performance.",
      color: "yellow",
    },
    {
      icon: FiCode,
      title: "Multi-Framework Support",
      description:
        "Generate PWAs with React, Vue, Angular, Next.js, Svelte, or Astro - all with TypeScript support.",
      color: "blue",
    },
    {
      icon: FiSmartphone,
      title: "Enterprise Components",
      description:
        "25+ pre-built, accessible components optimized for performance and user experience.",
      color: "green",
    },
    {
      icon: FiCloud,
      title: "Cloud-Ready Deployment",
      description:
        "Automated deployment to AWS, Azure, GCP, Netlify, Vercel, and more with CI/CD pipelines.",
      color: "purple",
    },
    {
      icon: FiShield,
      title: "Enterprise Security",
      description:
        "Built-in OAuth, RBAC, CSRF protection, and compliance features for enterprise applications.",
      color: "red",
    },
    {
      icon: FiTrendingUp,
      title: "Performance Optimized",
      description:
        "Core Web Vitals optimization, advanced caching, and bundle optimization out of the box.",
      color: "orange",
    },
  ];

  const frameworks = [
    { icon: FiCode, name: "React", color: "#61DAFB" },
    { icon: FiCode, name: "Vue.js", color: "#4FC08D" },
    { icon: FiCode, name: "Angular", color: "#DD0031" },
    { icon: FiCode, name: "Next.js", color: "#000000" },
    { icon: FiCode, name: "Svelte", color: "#FF3E00" },
  ];

  const comparison = [
    {
      feature: "Code Generation",
      ourGenerator: true,
      pwaBuilder: false,
      others: false,
    },
    {
      feature: "AI-Powered Analysis",
      ourGenerator: true,
      pwaBuilder: false,
      others: false,
    },
    {
      feature: "Multi-Framework Support",
      ourGenerator: true,
      pwaBuilder: false,
      others: false,
    },
    {
      feature: "Enterprise Components",
      ourGenerator: true,
      pwaBuilder: false,
      others: false,
    },
    {
      feature: "TypeScript Support",
      ourGenerator: true,
      pwaBuilder: false,
      others: true,
    },
    {
      feature: "Testing Integration",
      ourGenerator: true,
      pwaBuilder: false,
      others: false,
    },
    {
      feature: "CI/CD Pipelines",
      ourGenerator: true,
      pwaBuilder: false,
      others: false,
    },
  ];

  const stats = [
    { label: "Components Generated", value: "25+", icon: FiCode },
    { label: "Frameworks Supported", value: "6", icon: FiUsers },
    { label: "Performance Score", value: "95+", icon: FiTrendingUp },
    { label: "Security Features", value: "15+", icon: FiShield },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                colorScheme="purple"
                px={3}
                py={1}
                borderRadius="full"
                mb={4}
              >
                🚀 Enterprise PWA Generator v2.0
              </Badge>
              <Heading
                size="2xl"
                bgGradient="linear(to-r, blue.600, purple.600)"
                bgClip="text"
                mb={4}
                lineHeight="shorter"
              >
                Build Enterprise PWAs with
                <br />
                AI-Powered Intelligence
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
                The only PWA generator that creates complete, production-ready
                applications from scratch with AI business intelligence and
                multi-framework support.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HStack spacing={4}>
                <Button
                  size="lg"
                  colorScheme="blue"
                  rightIcon={<FiArrowRight />}
                  onClick={() => navigate("/builder")}
                  px={8}
                  py={6}
                  fontSize="lg"
                >
                  Start Building Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/about")}
                  px={8}
                  py={6}
                  fontSize="lg"
                >
                  Learn More
                </Button>
              </HStack>
            </MotionBox>

            {/* Framework Icons */}
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Text fontSize="sm" color="gray.500" mb={4}>
                Supports all major frameworks
              </Text>
              <HStack spacing={6}>
                {frameworks.map((framework, index) => (
                  <MotionBox
                    key={framework.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <VStack spacing={2}>
                      <Icon
                        as={framework.icon}
                        boxSize={8}
                        color={framework.color}
                      />
                      <Text fontSize="xs" color="gray.500">
                        {framework.name}
                      </Text>
                    </VStack>
                  </MotionBox>
                ))}
              </HStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={12} bg={cardBg}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <MotionBox
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <VStack spacing={2} textAlign="center">
                  <Icon as={stat.icon} boxSize={8} color="blue.500" />
                  <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {stat.label}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20}>
        <Container maxW="7xl">
          <VStack spacing={12}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              textAlign="center"
            >
              <Heading size="xl" mb={4}>
                Why Choose Our PWA Generator?
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Unlike basic conversion tools, we generate complete,
                enterprise-ready applications with AI-powered business
                intelligence.
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {features.map((feature, index) => (
                <MotionCard
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  bg={cardBg}
                  shadow="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <CardBody p={6}>
                    <VStack align="start" spacing={4}>
                      <Icon
                        as={feature.icon}
                        boxSize={8}
                        color={`${feature.color}.500`}
                      />
                      <Heading size="md">{feature.title}</Heading>
                      <Text color="gray.600">{feature.description}</Text>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Comparison Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="6xl">
          <VStack spacing={12}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              textAlign="center"
            >
              <Heading size="xl" mb={4}>
                How We Compare to the Competition
              </Heading>
              <Text fontSize="lg" color="gray.600">
                See why our generator dominates PWABuilder and other tools
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              w="full"
            >
              <Card bg={cardBg} shadow="xl">
                <CardBody p={0}>
                  <Box overflowX="auto">
                    <Box minW="600px">
                      {/* Header */}
                      <Flex bg="gray.100" p={4}>
                        <Box flex="2" fontWeight="bold">
                          Feature
                        </Box>
                        <Center flex="1" fontWeight="bold" color="blue.600">
                          Our Generator
                        </Center>
                        <Center flex="1" fontWeight="bold" color="gray.600">
                          PWABuilder
                        </Center>
                        <Center flex="1" fontWeight="bold" color="gray.600">
                          Others
                        </Center>
                      </Flex>

                      {/* Comparison Rows */}
                      {comparison.map((item, index) => (
                        <Flex
                          key={item.feature}
                          p={4}
                          borderBottomWidth="1px"
                          borderColor="gray.200"
                          bg={index % 2 === 0 ? "white" : "gray.50"}
                        >
                          <Box flex="2" fontWeight="medium">
                            {item.feature}
                          </Box>
                          <Center flex="1">
                            <Icon
                              as={item.ourGenerator ? FiCheck : FiX}
                              color={
                                item.ourGenerator ? "green.500" : "red.500"
                              }
                              boxSize={5}
                            />
                          </Center>
                          <Center flex="1">
                            <Icon
                              as={item.pwaBuilder ? FiCheck : FiX}
                              color={item.pwaBuilder ? "green.500" : "red.500"}
                              boxSize={5}
                            />
                          </Center>
                          <Center flex="1">
                            <Icon
                              as={item.others ? FiCheck : FiX}
                              color={item.others ? "green.500" : "red.500"}
                              boxSize={5}
                            />
                          </Center>
                        </Flex>
                      ))}
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={20} bgGradient="linear(to-r, blue.600, purple.600)">
        <Container maxW="4xl">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            textAlign="center"
          >
            <VStack spacing={6} color="white">
              <Icon as={FiAward} boxSize={16} color="yellow.300" />
              <Heading size="xl">Ready to Build Something Amazing?</Heading>
              <Text fontSize="lg" opacity={0.9} maxW="2xl">
                Join thousands of developers who are building enterprise-grade
                PWAs with our AI-powered generator. Get started in minutes, not
                hours.
              </Text>
              <HStack spacing={4} pt={4}>
                <Button
                  size="lg"
                  bg="white"
                  color="blue.600"
                  rightIcon={<FiArrowRight />}
                  onClick={() => navigate("/builder")}
                  px={8}
                  py={6}
                  fontSize="lg"
                  _hover={{ bg: "gray.100" }}
                >
                  Start Building Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  color="white"
                  borderColor="white"
                  onClick={() => navigate("/docs")}
                  px={8}
                  py={6}
                  fontSize="lg"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  View Documentation
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
