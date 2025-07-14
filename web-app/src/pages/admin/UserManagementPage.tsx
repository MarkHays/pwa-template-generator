import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  CheckboxGroup,
  Stack,
  Card,
  CardBody,
  CardHeader,
  Heading,
  useDisclosure,
  useToast,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  Tooltip,
  Icon,
  Switch,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiMail,
  FiCalendar,
  FiActivity,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiEye,
  FiSettings,
} from "react-icons/fi";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
  provider: string;
  isVerified: boolean;
  loginCount: number;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const UserManagementPage: React.FC = () => {
  const toast = useToast();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isRoleOpen,
    onOpen: onRoleOpen,
    onClose: onRoleClose,
  } = useDisclosure();

  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "john.doe@company.com",
      firstName: "John",
      lastName: "Doe",
      role: "Admin",
      status: "active",
      lastLogin: "2024-01-15 10:30:00",
      createdAt: "2024-01-01",
      permissions: ["user.read", "user.write", "admin.access"],
      provider: "google",
      isVerified: true,
      loginCount: 45,
    },
    {
      id: "2",
      email: "sarah.smith@company.com",
      firstName: "Sarah",
      lastName: "Smith",
      role: "Editor",
      status: "active",
      lastLogin: "2024-01-15 09:15:00",
      createdAt: "2024-01-05",
      permissions: ["user.read", "content.write"],
      provider: "github",
      isVerified: true,
      loginCount: 23,
    },
    {
      id: "3",
      email: "mike.wilson@company.com",
      firstName: "Mike",
      lastName: "Wilson",
      role: "User",
      status: "inactive",
      lastLogin: "2024-01-10 16:45:00",
      createdAt: "2024-01-08",
      permissions: ["user.read"],
      provider: "local",
      isVerified: false,
      loginCount: 8,
    },
    {
      id: "4",
      email: "lisa.johnson@company.com",
      firstName: "Lisa",
      lastName: "Johnson",
      role: "Manager",
      status: "active",
      lastLogin: "2024-01-15 11:20:00",
      createdAt: "2024-01-03",
      permissions: ["user.read", "user.write", "reports.read"],
      provider: "microsoft",
      isVerified: true,
      loginCount: 67,
    },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Admin",
      description: "Full system access",
      permissions: [
        "user.read",
        "user.write",
        "user.delete",
        "admin.access",
        "system.config",
      ],
      userCount: 3,
    },
    {
      id: "manager",
      name: "Manager",
      description: "Team management access",
      permissions: ["user.read", "user.write", "reports.read", "team.manage"],
      userCount: 5,
    },
    {
      id: "editor",
      name: "Editor",
      description: "Content editing access",
      permissions: ["user.read", "content.write", "content.read"],
      userCount: 12,
    },
    {
      id: "user",
      name: "User",
      description: "Basic user access",
      permissions: ["user.read", "content.read"],
      userCount: 156,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const allPermissions = [
    { id: "user.read", name: "Read Users", category: "User Management" },
    { id: "user.write", name: "Edit Users", category: "User Management" },
    { id: "user.delete", name: "Delete Users", category: "User Management" },
    { id: "admin.access", name: "Admin Access", category: "Administration" },
    {
      id: "system.config",
      name: "System Configuration",
      category: "Administration",
    },
    { id: "content.read", name: "Read Content", category: "Content" },
    { id: "content.write", name: "Edit Content", category: "Content" },
    { id: "reports.read", name: "View Reports", category: "Analytics" },
    { id: "team.manage", name: "Team Management", category: "Management" },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "inactive":
        return "gray";
      case "suspended":
        return "red";
      default:
        return "gray";
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return "🔍";
      case "github":
        return "🐙";
      case "microsoft":
        return "🟦";
      default:
        return "📧";
    }
  };

  const handleCreateUser = () => {
    setCurrentUser(null);
    onCreateOpen();
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    onEditOpen();
  };

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setUsers(users.filter((u) => u.id !== userId));
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers(
        users.map((u) =>
          u.id === userId
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u,
        ),
      );
      toast({
        title: "Status Updated",
        description: "User status has been updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to perform bulk actions",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      switch (action) {
        case "activate":
          setUsers(
            users.map((u) =>
              selectedUsers.includes(u.id) ? { ...u, status: "active" } : u,
            ),
          );
          break;
        case "deactivate":
          setUsers(
            users.map((u) =>
              selectedUsers.includes(u.id) ? { ...u, status: "inactive" } : u,
            ),
          );
          break;
        case "delete":
          setUsers(users.filter((u) => !selectedUsers.includes(u.id)));
          break;
      }

      setSelectedUsers([]);
      toast({
        title: "Bulk Action Complete",
        description: `${action} action completed for ${selectedUsers.length} users`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify={{ base: "start", md: "space-between" }}
        align={{ base: "start", md: "center" }}
        mb={6}
        gap={{ base: 4, md: 0 }}
      >
        <Box>
          <Heading size="lg" mb={2}>
            User Management
          </Heading>
          <Text color="gray.600">Manage users, roles, and permissions</Text>
        </Box>
        <VStack spacing={3} w={{ base: "full", md: "auto" }}>
          <Button
            leftIcon={<Icon as={FiDownload} />}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Export
          </Button>
          <Button
            leftIcon={<Icon as={FiUpload} />}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Import
          </Button>
          <Button
            leftIcon={<Icon as={FiShield} />}
            onClick={onRoleOpen}
            variant="outline"
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Manage Roles
          </Button>
          <Button
            leftIcon={<Icon as={FiPlus} />}
            colorScheme="blue"
            onClick={handleCreateUser}
            size={{ base: "md", md: "sm" }}
            w={{ base: "full", md: "auto" }}
            maxW="200px"
          >
            Add User
          </Button>
        </VStack>
      </Flex>

      {/* Statistics Cards */}
      <Grid
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gap={4}
        mb={6}
      >
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Users</StatLabel>
              <StatNumber>{users.length}</StatNumber>
              <StatHelpText>Across all roles</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Active Users</StatLabel>
              <StatNumber color="green.500">
                {users.filter((u) => u.status === "active").length}
              </StatNumber>
              <StatHelpText>Currently active</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Admin Users</StatLabel>
              <StatNumber color="blue.500">
                {users.filter((u) => u.role === "Admin").length}
              </StatNumber>
              <StatHelpText>Administrator access</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Pending Verification</StatLabel>
              <StatNumber color="orange.500">
                {users.filter((u) => !u.isVerified).length}
              </StatNumber>
              <StatHelpText>Require verification</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Filters and Search */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <Grid
            templateColumns={{ base: "1fr", md: "2fr 1fr 1fr 1fr" }}
            gap={4}
          >
            <InputGroup>
              <InputLeftElement>
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </Select>

            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </Select>

            <Button leftIcon={<Icon as={FiRefreshCw} />} variant="outline">
              Refresh
            </Button>
          </Grid>

          {selectedUsers.length > 0 && (
            <Alert status="info" mt={4} borderRadius="md">
              <AlertIcon />
              <Box flex={1}>
                <Text fontSize="sm">
                  {selectedUsers.length} user(s) selected
                </Text>
              </Box>
              <HStack spacing={2}>
                <Button size="sm" onClick={() => handleBulkAction("activate")}>
                  Activate
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleBulkAction("deactivate")}
                >
                  Deactivate
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleBulkAction("delete")}
                >
                  Delete
                </Button>
              </HStack>
            </Alert>
          )}
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody p={0}>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg={useColorModeValue("gray.50", "gray.900")}>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      isIndeterminate={
                        selectedUsers.length > 0 &&
                        selectedUsers.length < filteredUsers.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map((u) => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </Th>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Provider</Th>
                  <Th>Last Login</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <Checkbox
                        isChecked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user.id),
                            );
                          }
                        }}
                      />
                    </Td>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar
                          size="sm"
                          name={`${user.firstName} ${user.lastName}`}
                          src={user.avatar}
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium" fontSize="sm">
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {user.email}
                          </Text>
                          {!user.isVerified && (
                            <Badge colorScheme="orange" size="sm">
                              Unverified
                            </Badge>
                          )}
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle">
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={getStatusColor(user.status)}
                        variant="solid"
                      >
                        {user.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Text fontSize="lg">
                          {getProviderIcon(user.provider)}
                        </Text>
                        <Text fontSize="sm" textTransform="capitalize">
                          {user.provider}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {new Date(user.lastLogin).toLocaleTimeString()}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Tooltip label="View Details">
                          <IconButton
                            aria-label="View user"
                            icon={<Icon as={FiEye} />}
                            size="sm"
                            variant="ghost"
                          />
                        </Tooltip>
                        <Tooltip label="Edit User">
                          <IconButton
                            aria-label="Edit user"
                            icon={<Icon as={FiEdit} />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditUser(user)}
                          />
                        </Tooltip>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More actions"
                            icon={<Icon as={FiMoreVertical} />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem
                              icon={
                                <Icon
                                  as={
                                    user.status === "active"
                                      ? FiUserX
                                      : FiUserCheck
                                  }
                                />
                              }
                              onClick={() => handleToggleUserStatus(user.id)}
                            >
                              {user.status === "active"
                                ? "Deactivate"
                                : "Activate"}{" "}
                              User
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiMail} />}>
                              Send Email
                            </MenuItem>
                            <MenuItem icon={<Icon as={FiActivity} />}>
                              View Activity
                            </MenuItem>
                            <Divider />
                            <MenuItem
                              icon={<Icon as={FiTrash2} />}
                              color="red.500"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete User
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          {filteredUsers.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">
                No users found matching your criteria
              </Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Role Management Modal */}
      <Modal isOpen={isRoleOpen} onClose={onRoleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Role Management</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {roles.map((role) => (
                <Card key={role.id} border="1px" borderColor={borderColor}>
                  <CardBody>
                    <Flex justify="space-between" align="start" mb={3}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{role.name}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {role.description}
                        </Text>
                        <Badge colorScheme="blue">{role.userCount} users</Badge>
                      </VStack>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Flex>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>
                      Permissions:
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {role.permissions.map((permission) => (
                        <Tag key={permission} size="sm" colorScheme="gray">
                          <TagLabel>{permission}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onRoleClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.300"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
    </Box>
  );
};

export default UserManagementPage;
