import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Container,
  useColorModeValue,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiHome,
} from "react-icons/fi";

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  const handleBackToHome = () => {
    navigate("/");
  };

  const isLoginPage = location.pathname.includes("/login");
  const isRegisterPage = location.pathname.includes("/register");
  const isProfilePage = location.pathname.includes("/profile");

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg={cardBg} borderBottom="1px" borderColor={useColorModeValue("gray.200", "gray.700")} py={4}>
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Button
                variant="ghost"
                leftIcon={<Icon as={FiArrowLeft} />}
                onClick={handleBackToHome}
                size="sm"
              >
                Back to Home
              </Button>
              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                🏢 Enterprise PWA Platform
              </Text>
            </HStack>

            <HStack spacing={4}>
              {!isProfilePage && (
                <>
                  {!isLoginPage && (
                    <ChakraLink
                      onClick={() => navigate("/auth/login")}
                      color="blue.500"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Sign In
                    </ChakraLink>
                  )}
                  {!isRegisterPage && (
                    <ChakraLink
                      onClick={() => navigate("/auth/register")}
                      color="blue.500"
                      fontSize="sm"
                      fontWeight="medium"
                      cursor="pointer"
                      _hover={{ textDecoration: "underline" }}
                    >
                      Sign Up
                    </ChakraLink>
                  )}
                </>
              )}
              <Button
                leftIcon={<Icon as={FiHome} />}
                variant="outline"
                size="sm"
                onClick={handleBackToHome}
              >
                Home
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="calc(100vh - 200px)">
          <Box w="full" maxW="md">
            <Outlet />
          </Box>
        </Flex>
      </Container>

      {/* Footer */}
      <Box
        bg={cardBg}
        borderTop="1px"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        py={6}
        mt="auto"
      >
        <Container maxW="container.xl">
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Enterprise PWA Platform - Secure Authentication
            </Text>
            <HStack spacing={4} fontSize="xs" color="gray.500">
              <ChakraLink href="/privacy" _hover={{ textDecoration: "underline" }}>
                Privacy Policy
              </ChakraLink>
              <ChakraLink href="/terms" _hover={{ textDecoration: "underline" }}>
                Terms of Service
              </ChakraLink>
              <ChakraLink href="/support" _hover={{ textDecoration: "underline" }}>
                Support
              </ChakraLink>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;
