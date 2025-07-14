import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FiShield,
  FiArrowLeft,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login, oauthLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
      // Use authentication context
      const result = await login(
        formData.email,
        formData.password,
        formData.rememberMe,
      );

      if (result.success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the Admin Dashboard",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/admin/dashboard");
      } else {
        setLoginError(result.message || "Invalid credentials");
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
      // Use authentication context OAuth login
      const result = await oauthLogin(provider);

      if (result.success) {
        toast({
          title: "OAuth Login Successful",
          description: `Welcome to the Admin Dashboard via ${provider}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        navigate("/admin/dashboard");
      } else {
        toast({
          title: "OAuth Error",
          description: result.message || `Failed to connect to ${provider}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast({
        title: "OAuth Error",
        description: `Failed to connect to ${provider}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setLoginError("");
  };

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box w="full" maxW="md">
        {/* Back to Home Link */}
        <Button
          variant="ghost"
          leftIcon={<Icon as={FiArrowLeft} />}
          onClick={() => navigate("/")}
          mb={6}
          size="sm"
        >
          Back to Home
        </Button>

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
                <Icon as={FiShield} color="white" fontSize="2xl" />
              </Box>
              <Heading size="lg" color="blue.600">
                Admin Login
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Enterprise Platform Control Panel
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
                      Admin Email
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <Icon as={FiMail} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="admin@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        bg={useColorModeValue("white", "gray.700")}
                      />
                    </InputGroup>
                    <FormErrorMessage fontSize="sm">
                      {errors.email}
                    </FormErrorMessage>
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
                        placeholder="Enter admin password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        bg={useColorModeValue("white", "gray.700")}
                      />
                      <InputRightElement>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon
                            as={showPassword ? FiEyeOff : FiEye}
                            color="gray.400"
                          />
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage fontSize="sm">
                      {errors.password}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Remember Me & Forgot Password */}
                  <Flex justify="space-between" align="center" w="full">
                    <Checkbox
                      isChecked={formData.rememberMe}
                      onChange={(e) =>
                        handleInputChange("rememberMe", e.target.checked)
                      }
                      colorScheme="blue"
                      size="sm"
                    >
                      <Text fontSize="sm">Remember me</Text>
                    </Checkbox>
                    <Link
                      color="blue.500"
                      fontSize="sm"
                      fontWeight="medium"
                      onClick={() => {
                        toast({
                          title: "Password Reset",
                          description:
                            "Contact your system administrator for password reset",
                          status: "info",
                          duration: 5000,
                          isClosable: true,
                        });
                      }}
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
                    Sign In to Admin Panel
                  </Button>
                </VStack>
              </Box>

              {/* OAuth Divider */}
              <HStack spacing={4} w="full">
                <Divider />
                <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                  Enterprise SSO
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

              {/* Security Notice */}
              <Box
                bg={useColorModeValue("blue.50", "blue.900")}
                border="1px"
                borderColor={useColorModeValue("blue.200", "blue.700")}
                borderRadius="md"
                p={4}
                w="full"
              >
                <HStack spacing={2}>
                  <Icon as={FiShield} color="blue.500" />
                  <VStack spacing={1} align="start" flex={1}>
                    <Text fontSize="sm" fontWeight="medium" color="blue.700">
                      Secure Admin Access
                    </Text>
                    <Text fontSize="xs" color="blue.600">
                      This is a secure admin portal. All activities are logged
                      and monitored.
                    </Text>
                  </VStack>
                </HStack>
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
                <VStack
                  spacing={1}
                  align="start"
                  fontSize="xs"
                  color="gray.600"
                >
                  <Text>Email: admin@demo.com</Text>
                  <Text>Password: admin123</Text>
                  <Text fontStyle="italic">
                    * For demonstration purposes only
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Footer */}
        <Text textAlign="center" mt={6} fontSize="sm" color="gray.500">
          PWA Template Generator Enterprise Platform
        </Text>
      </Box>
    </Box>
  );
};

export default AdminLoginPage;
