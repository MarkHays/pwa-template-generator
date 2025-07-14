import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
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
  FiUserPlus,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call - replace with actual Phase 2 auth API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        await response.json();

        toast({
          title: "Account Created",
          description:
            "Your account has been created successfully. Please check your email for verification.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Redirect to login page
        navigate("/auth/login", {
          state: { message: "Account created successfully. Please sign in." },
        });
      } else {
        const errorData = await response.json();
        setRegisterError(errorData.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: string) => {
    setIsLoading(true);
    try {
      // Mock OAuth redirect - replace with actual Phase 2 OAuth URLs
      const oauthUrl = `/api/auth/oauth/${provider}?action=register`;
      window.location.href = oauthUrl;
    } catch (error) {
      console.error(`${provider} registration error:`, error);
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
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setRegisterError("");
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
            <Icon as={FiUserPlus} color="white" fontSize="2xl" />
          </Box>
          <Heading size="lg" color="blue.600">
            Create Account
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Join our enterprise platform today
          </Text>
        </VStack>
      </CardHeader>

      <CardBody pt={0}>
        <VStack spacing={6}>
          {/* Error Alert */}
          {registerError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">{registerError}</Text>
            </Alert>
          )}

          {/* Registration Form */}
          <Box as="form" onSubmit={handleSubmit} w="full">
            <VStack spacing={4}>
              {/* Name Fields */}
              <HStack spacing={3} w="full">
                <FormControl isInvalid={!!errors.firstName}>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    First Name
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiUser} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      bg={useColorModeValue("white", "gray.700")}
                    />
                  </InputGroup>
                  <FormErrorMessage fontSize="sm">
                    {errors.firstName}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.lastName}>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Last Name
                  </FormLabel>
                  <Input
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    bg={useColorModeValue("white", "gray.700")}
                  />
                  <FormErrorMessage fontSize="sm">
                    {errors.lastName}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

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
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={FiLock} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    bg={useColorModeValue("white", "gray.700")}
                  />
                  <InputRightElement>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Icon
                        as={showConfirmPassword ? FiEyeOff : FiEye}
                        color="gray.400"
                      />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="sm">
                  {errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>

              {/* Terms Agreement */}
              <FormControl isInvalid={!!errors.agreeToTerms}>
                <Checkbox
                  isChecked={formData.agreeToTerms}
                  onChange={(e) =>
                    handleInputChange("agreeToTerms", e.target.checked)
                  }
                  colorScheme="blue"
                  size="sm"
                >
                  <Text fontSize="sm">
                    I agree to the{" "}
                    <Link color="blue.500" fontWeight="medium" href="/terms">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link color="blue.500" fontWeight="medium" href="/privacy">
                      Privacy Policy
                    </Link>
                  </Text>
                </Checkbox>
                <FormErrorMessage fontSize="sm">
                  {errors.agreeToTerms}
                </FormErrorMessage>
              </FormControl>

              {/* Register Button */}
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="full"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Create Account
              </Button>
            </VStack>
          </Box>

          {/* OAuth Divider */}
          <HStack spacing={4} w="full">
            <Divider />
            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
              Or sign up with
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
              onClick={() => handleOAuthRegister("google")}
              isDisabled={isLoading}
            >
              Continue with Google
            </Button>

            <HStack spacing={3} w="full">
              <Button
                variant="outline"
                flex={1}
                leftIcon={<FaGithub />}
                onClick={() => handleOAuthRegister("github")}
                isDisabled={isLoading}
              >
                GitHub
              </Button>
              <Button
                variant="outline"
                flex={1}
                leftIcon={<FaMicrosoft color="#00A4EF" />}
                onClick={() => handleOAuthRegister("microsoft")}
                isDisabled={isLoading}
              >
                Microsoft
              </Button>
            </HStack>
          </VStack>

          {/* Sign In Link */}
          <Box textAlign="center">
            <Text fontSize="sm" color="gray.600">
              Already have an account?{" "}
              <Link
                color="blue.500"
                fontWeight="medium"
                onClick={() => navigate("/auth/login")}
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                Sign in here
              </Link>
            </Text>
          </Box>

          {/* Enterprise Notice */}
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
                🏢 Enterprise Platform Access
              </Text>
              <Text fontSize="xs" color="blue.600">
                • Full admin dashboard access
              </Text>
              <Text fontSize="xs" color="blue.600">
                • Database management tools
              </Text>
              <Text fontSize="xs" color="blue.600">
                • Real-time monitoring
              </Text>
              <Text fontSize="xs" color="blue.600">
                • API exploration interface
              </Text>
            </VStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default RegisterPage;
