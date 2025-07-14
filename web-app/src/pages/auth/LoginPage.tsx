import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  Divider,
  Alert,
  AlertIcon,
  Link,
  useColorModeValue,
  useToast,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Get redirect URL from location state or default to home
  const from = location.state?.from?.pathname || "/";

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual Phase 2 auth API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store user token and info
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        if (formData.rememberMe) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.firstName}!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        // Redirect to intended page or home
        navigate(from, { replace: true });
      } else {
        const errorData = await response.json();
        setLoginError(errorData.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      // Mock OAuth redirect - replace with actual Phase 2 OAuth URLs
      const oauthUrl = `/api/auth/oauth/${provider}?redirect=${encodeURIComponent(from)}`;
      window.location.href = oauthUrl;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "OAuth Error",
        description: `Failed to connect to ${provider}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    setLoginError("");
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset functionality coming soon",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="lg">
      <CardHeader textAlign="center" pb={4}>
        <VStack spacing={2}>
          <Box
            w={16}
            h={16}
            bg="blue.500"
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={2}
          >
            <Icon as={FiUser} color="white" fontSize="2xl" />
          </Box>
          <Heading size="lg" color="blue.600">
            Welcome Back
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Sign in to your account to continue
          </Text>
        </VStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={6}>
          {/* Error Alert */}
          {loginError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">{loginError}</Text>
            </Alert>
          )}

          {/* Login Form */}
          <Box as="form" onSubmit={handleSubmit} w="full">
            <VStack spacing={4}>
              {/* Email Field */}
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Email Address
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FiMail} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    bg={useColorModeValue("white", "gray.700")}
                  />
                </InputGroup>
                <FormErrorMessage fontSize="sm">{errors.email}</FormErrorMessage>
              </FormControl>

              {/* Password Field */}
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    bg={useColorModeValue("white", "gray.700")}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon as={showPassword ? FiEyeOff : FiEye} color="gray.400" />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="sm">{errors.password}</FormErrorMessage>
              </FormControl>

              {/* Remember Me & Forgot Password */}
              <Flex justify="space-between" align="center" w="full">
                <Checkbox
                  isChecked={formData.rememberMe}
                  onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
                  colorScheme="blue"
                  size="sm"
                >
                  <Text fontSize="sm">Remember me</Text>
                </Checkbox>
                <Link
                  color="blue.500"
                  fontSize="sm"
                  fontWeight="medium"
                  onClick={handleForgotPassword}
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot password?
                </Link>
              </Flex>

              {/* Login Button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </Box>

          {/* OAuth Divider */}
          <HStack spacing={4} w="full">
            <Divider />
            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
              Or continue with
            </Text>
            <Divider />
          </HStack>

          {/* OAuth Buttons */}
          <VStack spacing={3} w="full">
            <Button
              variant="outline"
              size="lg"
              w="full"
              leftIcon={<FaGoogle color="#DB4437" />}
              onClick={() => handleOAuthLogin("google")}
              isDisabled={isLoading}
            >
              Continue with Google
            </Button>

            <HStack spacing={3} w="full">
              <Button
                variant="outline"
                flex={1}
                leftIcon={<FaGithub />}
                onClick={() => handleOAuthLogin("github")}
                isDisabled={isLoading}
              >
                GitHub
              </Button>
              <Button
                variant="outline"
                flex={1}
                leftIcon={<FaMicrosoft color="#00A4EF" />}
                onClick={() => handleOAuthLogin("microsoft")}
                isDisabled={isLoading}
              >
                Microsoft
              </Button>
            </HStack>
          </VStack>

          {/* Sign Up Link */}
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.600">
              Don't have an account?{" "}
              <Link
                color="blue.500"
                fontWeight="medium"
                onClick={() => navigate("/auth/register")}
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                Sign up for free
              </Link>
            </Text>
          </Box>

          {/* Demo Credentials */}
          <Box
            bg={useColorModeValue("gray.50", "gray.700")}
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={4}
            w="full"
          >
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Demo Credentials:
            </Text>
            <VStack spacing={1} align="start" fontSize="xs" color="gray.600">
              <Text>Email: demo@company.com</Text>
              <Text>Password: demo123</Text>
              <Text fontStyle="italic">
                * For demonstration purposes only
              </Text>
            </VStack>
          </Box>

          {/* Enterprise Features Notice */}
          <Box
            bg={useColorModeValue("blue.50", "blue.900")}
            border="1px"
            borderColor={useColorModeValue("blue.200", "blue.700")}
            borderRadius="md"
            p={4}
            w="full"
          >
            <VStack spacing={2} align="start">
              <Text fontSize="sm" fontWeight="medium" color="blue.700">
                🏢 Enterprise Features Available
              </Text>
              <Text fontSize="xs" color="blue.600">
                • Multi-provider authentication
              </Text>
              <Text fontSize="xs" color="blue.600">
                • Role-based access control
              </Text>
              <Text fontSize="xs" color="blue.600">
                • Database integration
              </Text>
              <Text fontSize="xs" color="blue.600">
                • Real-time collaboration
              </Text>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default LoginPage;
