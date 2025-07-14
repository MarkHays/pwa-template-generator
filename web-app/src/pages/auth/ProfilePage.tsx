import React, { useState, useEffect } from "react";
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
  Card,
  CardBody,
  CardHeader,
  Heading,
  Avatar,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Switch,
  useColorModeValue,
  useToast,
  Icon,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCamera,
  FiShield,
  FiSettings,
  FiTrash2,
  FiSave,
  FiEdit,
  FiCheck,
  FiX,
  FiClock,
  FiActivity,
  FiKey,
  FiSmartphone,
  FiGlobe,
  FiLogOut,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaMicrosoft } from "react-icons/fa";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  connectedProviders: string[];
}

interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  device: string;
  location: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isPasswordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose,
  } = useDisclosure();

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    avatar: "/api/placeholder/100/100",
    role: "Admin",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15 10:30:00",
    emailVerified: true,
    twoFactorEnabled: false,
    connectedProviders: ["google", "github"],
  });

  const [formData, setFormData] = useState({
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    email: userProfile.email,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securityLogs] = useState<SecurityLog[]>([
    {
      id: "1",
      action: "Login successful",
      timestamp: "2024-01-15 10:30:00",
      ip: "192.168.1.100",
      device: "Chrome on macOS",
      location: "San Francisco, CA",
    },
    {
      id: "2",
      action: "Password changed",
      timestamp: "2024-01-14 15:20:00",
      ip: "192.168.1.100",
      device: "Chrome on macOS",
      location: "San Francisco, CA",
    },
    {
      id: "3",
      action: "Profile updated",
      timestamp: "2024-01-13 09:15:00",
      ip: "192.168.1.101",
      device: "Safari on iPhone",
      location: "San Francisco, CA",
    },
  ]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    setFormData({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
    });
  }, [userProfile]);

  const validateProfileForm = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUserProfile((prev) => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      }));

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onPasswordClose();
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Failed to change password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserProfile((prev) => ({
        ...prev,
        twoFactorEnabled: !prev.twoFactorEnabled,
      }));
      toast({
        title: userProfile.twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
        description: `Two-factor authentication has been ${userProfile.twoFactorEnabled ? "disabled" : "enabled"}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update 2FA settings",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderDisconnect = async (provider: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUserProfile((prev) => ({
        ...prev,
        connectedProviders: prev.connectedProviders.filter(
          (p) => p !== provider,
        ),
      }));
      toast({
        title: "Provider Disconnected",
        description: `${provider} has been disconnected from your account`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect provider",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return FaGoogle;
      case "github":
        return FaGithub;
      case "microsoft":
        return FaMicrosoft;
      default:
        return FiGlobe;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "google":
        return "#DB4437";
      case "github":
        return "#333";
      case "microsoft":
        return "#00A4EF";
      default:
        return "gray.500";
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>
            My Profile
          </Heading>
          <Text color="gray.600">
            Manage your account settings and preferences
          </Text>
        </Box>
        <HStack spacing={3}>
          <Button
            leftIcon={<Icon as={FiLogOut} />}
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to App
          </Button>
        </HStack>
      </Flex>

      {/* Profile Overview */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <HStack align="center" spacing={6}>
            <VStack spacing={4}>
              <Box position="relative">
                <Avatar
                  size="2xl"
                  name={`${userProfile.firstName} ${userProfile.lastName}`}
                  src={userProfile.avatar}
                />
                <IconButton
                  aria-label="Change avatar"
                  icon={<Icon as={FiCamera} />}
                  size="sm"
                  borderRadius="full"
                  position="absolute"
                  bottom={0}
                  right={0}
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                />
              </Box>
              <Button size="sm" variant="outline">
                Change Photo
              </Button>
            </VStack>

            <VStack align="start" spacing={3} flex={1} ml={8}>
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">
                  {userProfile.firstName} {userProfile.lastName}
                </Text>
                <HStack spacing={2}>
                  <Text color="gray.600">{userProfile.email}</Text>
                  {userProfile.emailVerified && (
                    <Icon as={FiCheck} color="green.500" />
                  )}
                </HStack>
                <Badge colorScheme="blue" variant="solid">
                  {userProfile.role}
                </Badge>
              </VStack>

              <Grid templateColumns="repeat(3, 1fr)" gap={6} w="full">
                <Stat>
                  <StatLabel>Member Since</StatLabel>
                  <StatNumber fontSize="lg">
                    {new Date(userProfile.createdAt).toLocaleDateString()}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Last Login</StatLabel>
                  <StatNumber fontSize="lg">
                    {new Date(userProfile.lastLogin).toLocaleDateString()}
                  </StatNumber>
                  <StatHelpText>
                    {new Date(userProfile.lastLogin).toLocaleTimeString()}
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Security Status</StatLabel>
                  <StatNumber
                    fontSize="lg"
                    color={
                      userProfile.twoFactorEnabled ? "green.500" : "orange.500"
                    }
                  >
                    {userProfile.twoFactorEnabled ? "Secure" : "Basic"}
                  </StatNumber>
                </Stat>
              </Grid>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      {/* Profile Management Tabs */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Personal Information</Tab>
          <Tab>Security</Tab>
          <Tab>Connected Accounts</Tab>
          <Tab>Activity Log</Tab>
        </TabList>

        <TabPanels>
          {/* Personal Information Tab */}
          <TabPanel p={0} pt={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Personal Information</Heading>
              </CardHeader>
              <CardBody>
                <Box as="form" onSubmit={handleProfileUpdate}>
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <FormControl isInvalid={!!errors.firstName}>
                        <FormLabel>First Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <Icon as={FiUser} color="gray.400" />
                          </InputLeftElement>
                          <Input
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            placeholder="First name"
                          />
                        </InputGroup>
                        <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={!!errors.lastName}>
                        <FormLabel>Last Name</FormLabel>
                        <Input
                          value={formData.lastName}
                          onChange={(e) =>
                            handleInputChange("lastName", e.target.value)
                          }
                          placeholder="Last name"
                        />
                        <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                      </FormControl>
                    </HStack>

                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel>Email Address</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <Icon as={FiMail} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Email address"
                        />
                      </InputGroup>
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <Divider />

                    <HStack justify="flex-end" spacing={3}>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setFormData({
                            firstName: userProfile.firstName,
                            lastName: userProfile.lastName,
                            email: userProfile.email,
                          })
                        }
                      >
                        Reset
                      </Button>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        leftIcon={<Icon as={FiSave} />}
                        isLoading={isLoading}
                        loadingText="Saving..."
                      >
                        Save Changes
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Security Tab */}
          <TabPanel p={0} pt={6}>
            <VStack spacing={6} align="stretch">
              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Password & Security</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Flex
                      justify="space-between"
                      align="center"
                      p={4}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">Password</Text>
                        <Text fontSize="sm" color="gray.600">
                          Last changed 2 weeks ago
                        </Text>
                      </VStack>
                      <Button
                        leftIcon={<Icon as={FiKey} />}
                        onClick={onPasswordOpen}
                      >
                        Change Password
                      </Button>
                    </Flex>

                    <Flex
                      justify="space-between"
                      align="center"
                      p={4}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">
                          Two-Factor Authentication
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {userProfile.twoFactorEnabled
                            ? "Enabled"
                            : "Add an extra layer of security"}
                        </Text>
                      </VStack>
                      <Switch
                        isChecked={userProfile.twoFactorEnabled}
                        onChange={handleToggle2FA}
                        colorScheme="green"
                        size="lg"
                      />
                    </Flex>

                    <Flex
                      justify="space-between"
                      align="center"
                      p={4}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">Email Verification</Text>
                        <Text fontSize="sm" color="gray.600">
                          {userProfile.emailVerified
                            ? "Your email is verified"
                            : "Please verify your email"}
                        </Text>
                      </VStack>
                      {userProfile.emailVerified ? (
                        <Badge colorScheme="green" variant="solid">
                          <Icon as={FiCheck} mr={1} />
                          Verified
                        </Badge>
                      ) : (
                        <Button size="sm" colorScheme="orange">
                          Verify Email
                        </Button>
                      )}
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>

              <Card bg={cardBg} border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md" color="red.500">
                    Danger Zone
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Alert status="error" borderRadius="md" mb={4}>
                    <AlertIcon />
                    <AlertDescription>
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </AlertDescription>
                  </Alert>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<Icon as={FiTrash2} />}
                    onClick={onDeleteOpen}
                  >
                    Delete Account
                  </Button>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Connected Accounts Tab */}
          <TabPanel p={0} pt={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Connected Accounts</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {["google", "github", "microsoft"].map((provider) => (
                    <Flex
                      key={provider}
                      justify="space-between"
                      align="center"
                      p={4}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      <HStack spacing={3}>
                        <Box
                          w={10}
                          h={10}
                          bg={getProviderColor(provider)}
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                        >
                          <Icon as={getProviderIcon(provider)} />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium" textTransform="capitalize">
                            {provider}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {userProfile.connectedProviders.includes(provider)
                              ? "Connected"
                              : "Not connected"}
                          </Text>
                        </VStack>
                      </HStack>
                      {userProfile.connectedProviders.includes(provider) ? (
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                          onClick={() => handleProviderDisconnect(provider)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button size="sm" colorScheme="blue">
                          Connect
                        </Button>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Activity Log Tab */}
          <TabPanel p={0} pt={6}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Recent Activity</Heading>
              </CardHeader>
              <CardBody>
                <List spacing={4}>
                  {securityLogs.map((log) => (
                    <ListItem
                      key={log.id}
                      p={4}
                      border="1px"
                      borderColor={borderColor}
                      borderRadius="md"
                    >
                      <Flex justify="space-between" align="start">
                        <HStack spacing={3} align="start">
                          <Icon as={FiActivity} color="blue.500" mt={1} />
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{log.action}</Text>
                            <Text fontSize="sm" color="gray.600">
                              {log.device} • {log.location}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              IP: {log.ip}
                            </Text>
                          </VStack>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(log.timestamp).toLocaleString()}
                        </Text>
                      </Flex>
                    </ListItem>
                  ))}
                </List>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Password Change Modal */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as="form" onSubmit={handlePasswordChange}>
              <VStack spacing={4}>
                <FormControl isInvalid={!!errors.currentPassword}>
                  <FormLabel>Current Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordInputChange(
                          "currentPassword",
                          e.target.value,
                        )
                      }
                      placeholder="Enter current password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle password visibility"
                        icon={
                          <Icon as={showCurrentPassword ? FiEyeOff : FiEye} />
                        }
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.currentPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.newPassword}>
                  <FormLabel>New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordInputChange("newPassword", e.target.value)
                      }
                      placeholder="Enter new password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle password visibility"
                        icon={<Icon as={showNewPassword ? FiEyeOff : FiEye} />}
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormLabel>Confirm New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiLock} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordInputChange(
                          "confirmPassword",
                          e.target.value,
                        )
                      }
                      placeholder="Confirm new password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label="Toggle password visibility"
                        icon={
                          <Icon as={showConfirmPassword ? FiEyeOff : FiEye} />
                        }
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onPasswordClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handlePasswordChange}
              isLoading={isLoading}
              loadingText="Changing..."
            >
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Account Deletion Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red.500">Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              <AlertDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all associated data.
              </AlertDescription>
            </Alert>
            <Text>
              Are you absolutely sure you want to delete your account? All your
              data will be permanently removed.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleAccountDelete}
              isLoading={isLoading}
              loadingText="Deleting..."
            >
              Delete Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
