import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  CardBody,
  CardHeader,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  Code,
  Divider,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiExternalLink, FiCheck, FiX } from "react-icons/fi";
import { aiService } from "../../services/aiService";

const APIKeySettings: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    // Check if user already has an API key
    const existingKey = localStorage.getItem('claude_api_key');
    if (existingKey) {
      setHasExistingKey(true);
      setApiKey(existingKey);
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Claude API key",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!apiKey.startsWith('sk-ant-')) {
      toast({
        title: "Invalid Format",
        description: "Claude API keys should start with 'sk-ant-'",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setIsValid(null);

    try {
      // Set the API key in the service
      aiService.setApiKey(apiKey);

      // Test the API key with a simple request
      await testApiKey();

      setIsValid(true);
      setHasExistingKey(true);
      toast({
        title: "API Key Saved",
        description: "Your Claude API key has been saved and verified!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setIsValid(false);
      toast({
        title: "Invalid API Key",
        description: "The API key could not be verified. Please check and try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testApiKey = async () => {
    setIsLoading(true);
    try {
      // Test with a simple business info
      const testBusinessInfo = {
        businessName: "Test Business",
        industry: "professional-services",
        description: "Test description",
        targetAudience: "General public"
      };

      await aiService.analyzeBusinessNeeds(testBusinessInfo);
      setIsValid(true);
      toast({
        title: "API Key Valid",
        description: "Your Claude API key is working correctly!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setIsValid(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('claude_api_key');
    setApiKey("");
    setHasExistingKey(false);
    setIsValid(null);
    toast({
      title: "API Key Removed",
      description: "Your Claude API key has been removed",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Claude AI Integration
          </Heading>
          <Text color="gray.600">
            Connect your Claude API key to get personalized AI recommendations for your PWA projects.
          </Text>
        </Box>

        {/* Current Status */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader pb={2}>
            <HStack justify="space-between">
              <Text fontWeight="semibold">Current Status</Text>
              {hasExistingKey ? (
                <Badge colorScheme="green" variant="subtle">
                  <HStack spacing={1}>
                    <FiCheck size={12} />
                    <Text>Connected</Text>
                  </HStack>
                </Badge>
              ) : (
                <Badge colorScheme="gray" variant="subtle">
                  <HStack spacing={1}>
                    <FiX size={12} />
                    <Text>Not Connected</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            {hasExistingKey ? (
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Claude AI Connected!</AlertTitle>
                  <AlertDescription>
                    You'll receive personalized AI recommendations based on your business information.
                  </AlertDescription>
                </Box>
              </Alert>
            ) : (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Enhanced Recommendations Available</AlertTitle>
                  <AlertDescription>
                    Add your Claude API key to get AI-powered business analysis and personalized recommendations.
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </CardBody>
        </Card>

        {/* API Key Input */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <Text fontWeight="semibold">Claude API Key</Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl isInvalid={isValid === false}>
                <FormLabel>API Key</FormLabel>
                <InputGroup>
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxx"
                    pr="4.5rem"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showApiKey ? "Hide API key" : "Show API key"}
                      icon={showApiKey ? <FiEyeOff /> : <FiEye />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowApiKey(!showApiKey)}
                    />
                  </InputRightElement>
                </InputGroup>
                {isValid === false ? (
                  <FormErrorMessage>
                    Invalid API key. Please check your key and try again.
                  </FormErrorMessage>
                ) : (
                  <FormHelperText>
                    Your API key is stored locally and never sent to our servers.
                  </FormHelperText>
                )}
              </FormControl>

              <HStack spacing={3}>
                <Button
                  colorScheme="blue"
                  onClick={handleSaveApiKey}
                  isLoading={isLoading}
                  loadingText="Verifying..."
                  isDisabled={!apiKey.trim()}
                >
                  {hasExistingKey ? "Update Key" : "Save & Verify"}
                </Button>
                {hasExistingKey && (
                  <Button
                    variant="outline"
                    onClick={testApiKey}
                    isLoading={isLoading}
                    loadingText="Testing..."
                  >
                    Test Key
                  </Button>
                )}
                {hasExistingKey && (
                  <Button
                    variant="outline"
                    colorScheme="red"
                    onClick={handleRemoveApiKey}
                  >
                    Remove Key
                  </Button>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Instructions */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <Text fontWeight="semibold">How to Get Your Claude API Key</Text>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Follow these steps to get your Claude API key:
              </Text>

              <VStack spacing={2} align="stretch" pl={4}>
                <Text fontSize="sm">
                  1. Visit{" "}
                  <Link
                    href="https://console.anthropic.com"
                    isExternal
                    color="blue.500"
                    textDecoration="underline"
                  >
                    Anthropic Console <FiExternalLink style={{ display: "inline" }} />
                  </Link>
                </Text>
                <Text fontSize="sm">
                  2. Sign up or log in to your account
                </Text>
                <Text fontSize="sm">
                  3. Navigate to "API Keys" in the dashboard
                </Text>
                <Text fontSize="sm">
                  4. Click "Create Key" and copy your new API key
                </Text>
                <Text fontSize="sm">
                  5. Paste it here and click "Save & Verify"
                </Text>
              </VStack>

              <Divider />

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  API Key Format:
                </Text>
                <Code fontSize="xs" p={2} borderRadius="md" display="block">
                  sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                </Code>
              </Box>

              <Alert status="warning" borderRadius="md" size="sm">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Keep your API key secure and never share it publicly. It's stored locally in your browser.
                </AlertDescription>
              </Alert>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default APIKeySettings;
