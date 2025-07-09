import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Badge,
  HStack,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiZap,
  FiCode,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiShield,
  FiArrowRight,
} from 'react-icons/fi';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, gray.900, blue.900)'
  );

  const stats = [
    { label: 'Frameworks Supported', value: '6+', icon: FiCode },
    { label: 'Components Generated', value: '25+', icon: FiZap },
    { label: 'Developers Served', value: '1000+', icon: FiUsers },
    { label: 'Performance Score', value: '95+', icon: FiTrendingUp },
  ];

  const features = [
    {
      title: 'AI-Powered Intelligence',
      description: 'Our AI analyzes your business needs and generates personalized recommendations.',
      icon: FiZap,
    },
    {
      title: 'Enterprise Security',
      description: 'Built-in security features including OAuth, RBAC, and compliance tools.',
      icon: FiShield,
    },
    {
      title: 'Performance Optimized',
      description: 'Core Web Vitals optimization and advanced caching strategies.',
      icon: FiTrendingUp,
    },
    {
      title: 'Award-Winning',
      description: 'Recognized for innovation in developer tooling and automation.',
      icon: FiAward,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box bgGradient={bgGradient} py={20}>
        <Container maxW="7xl">
          <VStack spacing={8} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full" mb={4}>
                About Enterprise PWA Generator
              </Badge>
              <Heading size="2xl" mb={4}>
                Building the Future of
                <br />
                Progressive Web Apps
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="3xl">
                We're on a mission to democratize enterprise-grade web application development
                through AI-powered tools and intelligent automation.
              </Text>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box py={16} bg={cardBg}>
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
                <VStack spacing={3} textAlign="center">
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

      {/* Mission Section */}
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
              <Heading size="xl" mb={6}>
                Our Mission
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="4xl">
                We believe that every business should have access to enterprise-grade web applications
                without the complexity and cost traditionally associated with custom development.
                Our AI-powered generator bridges the gap between simple templates and complex
                enterprise solutions.
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <MotionCard
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  bg={cardBg}
                  shadow="lg"
                  whileHover={{ y: -5 }}
                >
                  <CardBody>
                    <HStack spacing={4} align="start">
                      <Icon as={feature.icon} boxSize={6} color="blue.500" mt={1} />
                      <VStack align="start" spacing={2}>
                        <Heading size="md">{feature.title}</Heading>
                        <Text color="gray.600">{feature.description}</Text>
                      </VStack>
                    </HStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Story Section */}
      <Box py={20} bg="gray.50">
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={12} alignItems="center">
            <MotionBox
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Heading size="xl" mb={6}>
                The Story Behind the Generator
              </Heading>
              <VStack spacing={4} align="start">
                <Text color="gray.600">
                  Born from the frustration of repetitive web development tasks and the need
                  for enterprise-grade solutions, our PWA Generator was created by developers,
                  for developers.
                </Text>
                <Text color="gray.600">
                  We noticed that while tools like PWABuilder existed, they only converted
                  existing websites. There was no solution that could generate complete,
                  production-ready applications with AI intelligence and enterprise features.
                </Text>
                <Text color="gray.600">
                  Today, thousands of developers use our generator to create amazing PWAs
                  that perform at scale, meet enterprise requirements, and deliver exceptional
                  user experiences.
                </Text>
              </VStack>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card bg={cardBg} shadow="xl">
                <CardBody p={8}>
                  <VStack spacing={4}>
                    <Box
                      w={16}
                      h={16}
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      borderRadius="xl"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={FiZap} w={8} h={8} color="white" />
                    </Box>
                    <Heading size="lg" textAlign="center">
                      Ready to Get Started?
                    </Heading>
                    <Text color="gray.600" textAlign="center">
                      Join thousands of developers building enterprise PWAs with our AI-powered generator.
                    </Text>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      rightIcon={<FiArrowRight />}
                      onClick={() => navigate('/builder')}
                      mt={4}
                    >
                      Start Building
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </MotionBox>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Team Section */}
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
                Built by Developers, for Developers
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="3xl">
                Our team combines decades of experience in enterprise software development,
                AI/ML engineering, and developer experience design to create tools that
                truly make a difference.
              </Text>
            </MotionBox>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {[
                {
                  name: 'Engineering Team',
                  role: 'Full-Stack Development',
                  description: 'Expert developers with experience at Google, Microsoft, and leading startups.',
                },
                {
                  name: 'AI/ML Team',
                  role: 'Artificial Intelligence',
                  description: 'Machine learning engineers specializing in code generation and business intelligence.',
                },
                {
                  name: 'DevOps Team',
                  role: 'Infrastructure & Security',
                  description: 'Cloud architects and security experts ensuring enterprise-grade reliability.',
                },
              ].map((team, index) => (
                <MotionCard
                  key={team.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  bg={cardBg}
                  shadow="md"
                  whileHover={{ y: -5 }}
                >
                  <CardBody textAlign="center">
                    <VStack spacing={3}>
                      <Heading size="md">{team.name}</Heading>
                      <Text color="blue.500" fontWeight="500">
                        {team.role}
                      </Text>
                      <Text color="gray.600" fontSize="sm">
                        {team.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </MotionCard>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;
