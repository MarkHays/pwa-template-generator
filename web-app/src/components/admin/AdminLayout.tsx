import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
  Badge,
  Tooltip,
  useColorModeValue,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import {
  FiHome,
  FiUsers,
  FiDatabase,
  FiActivity,
  FiCode,
  FiShield,
  FiSettings,
  FiLogOut,
  FiUser,
  FiChevronRight,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sidebarBg = useColorModeValue("gray.50", "gray.900");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onClose]);

  const navItems = [
    {
      label: "Dashboard",
      icon: FiHome,
      path: "/admin/dashboard",
      description: "System overview and metrics",
    },
    {
      label: "User Management",
      icon: FiUsers,
      path: "/admin/users",
      description: "Manage users and permissions",
      badge: "142",
    },
    {
      label: "Database Admin",
      icon: FiDatabase,
      path: "/admin/database",
      description: "Database management and queries",
    },
    {
      label: "System Monitoring",
      icon: FiActivity,
      path: "/admin/monitoring",
      description: "Real-time system health",
      badge: "Live",
      badgeColor: "green",
    },
    {
      label: "API Explorer",
      icon: FiCode,
      path: "/admin/api",
      description: "Test and explore APIs",
    },
    {
      label: "Tenant Management",
      icon: FiHome,
      path: "/admin/tenants",
      description: "Multi-tenant configuration",
    },
    {
      label: "Auth Settings",
      icon: FiShield,
      path: "/admin/auth-settings",
      description: "OAuth and security settings",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    if (pathSegments.length > 1) {
      breadcrumbs.push({ label: "Admin", path: "/admin/dashboard" });

      const currentPage = pathSegments[pathSegments.length - 1];
      const navItem = navItems.find((item) => item.path.includes(currentPage));

      if (navItem) {
        breadcrumbs.push({ label: navItem.label, path: navItem.path });
      }
    }

    return breadcrumbs;
  };

  // Helper function to get current page title for mobile
  const getCurrentPageTitle = (): string => {
    const currentItem = navItems.find(
      (item) => item.path === location.pathname,
    );
    return currentItem?.label || "Dashboard";
  };

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")}>
      <Flex h="100vh">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <Box
          w="280px"
          bg={sidebarBg}
          borderRight="1px"
          borderColor={borderColor}
          position="relative"
          overflow="hidden"
          display={{ base: "none", md: "block" }}
        >
          {/* Logo/Header */}
          <Box p={6} borderBottom="1px" borderColor={borderColor}>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              🏢 Enterprise Admin
            </Text>
            <Text fontSize="sm" color="gray.600" mt={1}>
              PWA Platform Control Panel
            </Text>
          </Box>

          {/* Navigation */}
          <VStack spacing={1} p={4} align="stretch">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Tooltip
                  key={item.path}
                  label={item.description}
                  placement="right"
                  hasArrow
                >
                  <Button
                    variant={isActive ? "solid" : "ghost"}
                    colorScheme={isActive ? "blue" : "gray"}
                    justifyContent="flex-start"
                    leftIcon={<Icon as={item.icon} />}
                    onClick={() => handleNavigation(item.path)}
                    size="md"
                    w="full"
                    px={4}
                    py={6}
                    fontWeight={isActive ? "semibold" : "normal"}
                  >
                    <Flex w="full" align="center" justify="space-between">
                      <Text>{item.label}</Text>
                      {item.badge && (
                        <Badge
                          colorScheme={item.badgeColor || "blue"}
                          variant="solid"
                          fontSize="xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Flex>
                  </Button>
                </Tooltip>
              );
            })}
          </VStack>

          {/* Bottom User Info */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={4}
            borderTop="1px"
            borderColor={borderColor}
            bg={sidebarBg}
          >
            <Menu>
              <MenuButton as={Button} variant="ghost" w="full" p={3}>
                <HStack spacing={3}>
                  <Avatar size="sm" src={user?.avatar} />
                  <VStack spacing={0} align="start" flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      {user?.role}
                    </Text>
                  </VStack>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiUser />}>Profile Settings</MenuItem>
                <MenuItem icon={<FiSettings />}>Preferences</MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>

        {/* Mobile Navigation Drawer */}
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              <HStack spacing={3}>
                <Box
                  w={8}
                  h={8}
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiShield} color="white" size={16} />
                </Box>
                <VStack spacing={0} align="start">
                  <Text fontWeight="bold" fontSize="md">
                    Enterprise Admin
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    PWA Platform Control Panel
                  </Text>
                </VStack>
              </HStack>
            </DrawerHeader>

            <DrawerBody p={0}>
              <VStack spacing={0} align="stretch">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      onClick={() => {
                        handleNavigation(item.path);
                        onClose();
                      }}
                      variant="ghost"
                      justifyContent="flex-start"
                      h="auto"
                      p={4}
                      borderRadius="none"
                      bg={isActive ? "blue.50" : "transparent"}
                      color={isActive ? "blue.600" : "gray.700"}
                      _hover={{
                        bg: isActive ? "blue.50" : "gray.50",
                      }}
                    >
                      <HStack spacing={3} w="full">
                        <Icon as={item.icon} boxSize={5} />
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            {item.label}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {item.description}
                          </Text>
                        </VStack>
                        {item.badge && (
                          <Badge
                            colorScheme={item.badgeColor || "blue"}
                            variant="solid"
                            fontSize="xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </HStack>
                    </Button>
                  );
                })}
              </VStack>

              {/* Mobile User Menu */}
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={4}
                borderTop="1px"
                borderColor={borderColor}
                bg={sidebarBg}
              >
                <Menu>
                  <MenuButton as={Button} variant="ghost" w="full" p={3}>
                    <HStack spacing={3}>
                      <Avatar size="sm" src={user?.avatar} />
                      <VStack spacing={0} align="start" flex={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {user?.firstName} {user?.lastName}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {user?.role}
                        </Text>
                      </VStack>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiUser />}>Profile Settings</MenuItem>
                    <MenuItem icon={<FiSettings />}>Preferences</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Main Content - Full width on mobile */}
        <Flex
          direction="column"
          flex={1}
          overflow="hidden"
          w={{ base: "100%", md: "calc(100% - 280px)" }}
        >
          {/* Top Header */}
          <Box
            bg={bgColor}
            borderBottom="1px"
            borderColor={borderColor}
            px={{ base: 4, md: 6 }}
            py={4}
            zIndex={10}
            w="full"
          >
            <Flex justify="space-between" align="center">
              {/* Mobile Menu Button + Breadcrumbs */}
              <HStack spacing={4}>
                {isMobile && (
                  <IconButton
                    aria-label="Open navigation menu"
                    icon={<FiMenu />}
                    variant="ghost"
                    size="sm"
                    onClick={onOpen}
                  />
                )}

                <Box display={{ base: "none", md: "block" }}>
                  <Breadcrumb
                    spacing="8px"
                    separator={<Icon as={FiChevronRight} color="gray.500" />}
                  >
                    {getBreadcrumbs().map((crumb, index) => (
                      <BreadcrumbItem key={index}>
                        <BreadcrumbLink
                          onClick={() => navigate(crumb.path)}
                          color={
                            index === getBreadcrumbs().length - 1
                              ? "blue.600"
                              : "gray.600"
                          }
                          fontWeight={
                            index === getBreadcrumbs().length - 1
                              ? "semibold"
                              : "normal"
                          }
                        >
                          {crumb.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    ))}
                  </Breadcrumb>
                </Box>

                {/* Mobile: Current Page Title */}
                {isMobile && (
                  <Heading size="sm" color="blue.600">
                    {getCurrentPageTitle()}
                  </Heading>
                )}
              </HStack>

              {/* Header Actions */}
              <HStack spacing={{ base: 2, md: 4 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiSearch />}
                  color="gray.600"
                  display={{ base: "none", md: "flex" }}
                >
                  Search
                </Button>

                {/* Mobile: Just search icon */}
                <IconButton
                  aria-label="Search"
                  icon={<FiSearch />}
                  variant="ghost"
                  size="sm"
                  display={{ base: "flex", md: "none" }}
                />

                <Button variant="ghost" size="sm" position="relative">
                  <Icon as={FiBell} />
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="red"
                    variant="solid"
                    fontSize="xs"
                    borderRadius="full"
                    w="5"
                    h="5"
                  >
                    3
                  </Badge>
                </Button>

                <Text fontSize="sm" color="gray.600">
                  {user?.email}
                </Text>
              </HStack>
            </Flex>
          </Box>

          {/* Page Content */}
          {/* Content Area */}
          <Box
            flex={1}
            overflow="auto"
            p={{ base: 4, md: 6 }}
            bg={useColorModeValue("gray.50", "gray.800")}
          >
            <Container maxW="full" p={0} overflow="hidden">
              <Outlet />
            </Container>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AdminLayout;
