import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiCode, FiZap, FiBook, FiInfo, FiHome } from "react-icons/fi";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");

  const navItems = [
    { name: "Home", path: "/", icon: FiHome },
    { name: "Builder", path: "/builder", icon: FiCode },
    { name: "About", path: "/about", icon: FiInfo },
    { name: "Docs", path: "/docs", icon: FiBook },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box
        bg={bgColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={10}
        shadow="sm"
      >
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            {/* Logo */}
            <Link to="/">
              <HStack spacing={3} cursor="pointer">
                <Box
                  w={10}
                  h={10}
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiZap color="white" size={20} />
                </Box>
                <VStack spacing={0} align="start">
                  <Heading size="sm" color="gray.800">
                    PWA Generator
                  </Heading>
                  <Text fontSize="xs" color={textColor}>
                    Enterprise Edition
                  </Text>
                </VStack>
              </HStack>
            </Link>

            {/* Desktop Navigation */}
            <HStack spacing={8} display={{ base: "none", md: "flex" }}>
              {navItems.map((item) => (
                <ChakraLink
                  key={item.path}
                  as={Link}
                  to={item.path}
                  px={3}
                  py={2}
                  borderRadius="md"
                  fontWeight={isActive(item.path) ? "600" : "500"}
                  color={isActive(item.path) ? "blue.600" : textColor}
                  bg={isActive(item.path) ? "blue.50" : "transparent"}
                  _hover={{
                    bg: "blue.50",
                    color: "blue.600",
                    textDecoration: "none",
                  }}
                  transition="all 0.2s"
                >
                  <HStack spacing={2}>
                    <Box as={item.icon} size={4} />
                    <Text>{item.name}</Text>
                  </HStack>
                </ChakraLink>
              ))}
            </HStack>

            {/* CTA Button */}
            <HStack spacing={4}>
              <Button
                as={Link}
                to="/builder"
                colorScheme="blue"
                variant="solid"
                size="sm"
                display={{ base: "none", sm: "flex" }}
                leftIcon={<FiCode />}
              >
                Start Building
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                aria-label="Open menu"
                icon={<FiMenu />}
                variant="ghost"
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiZap color="white" size={16} />
              </Box>
              <Text>PWA Generator</Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  as={Link}
                  to={item.path}
                  variant={isActive(item.path) ? "solid" : "ghost"}
                  colorScheme={isActive(item.path) ? "blue" : "gray"}
                  justifyContent="flex-start"
                  leftIcon={<Box as={item.icon} size={4} />}
                  onClick={onClose}
                >
                  {item.name}
                </Button>
              ))}

              <Button
                as={Link}
                to="/builder"
                colorScheme="blue"
                variant="solid"
                leftIcon={<FiCode />}
                onClick={onClose}
              >
                Start Building
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box as="main" flex={1}>
        {children}
      </Box>

      {/* Footer */}
      <Box
        as="footer"
        bg={bgColor}
        borderTopWidth="1px"
        borderColor={borderColor}
        py={8}
        mt={12}
      >
        <Container maxW="7xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <FiZap color="white" size={16} />
              </Box>
              <VStack spacing={0} align="start">
                <Text fontWeight="600" color="gray.800">
                  PWA Generator
                </Text>
                <Text fontSize="sm" color={textColor}>
                  Enterprise Edition v2.0
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={6} mt={{ base: 4, md: 0 }}>
              <ChakraLink
                as={Link}
                to="/about"
                fontSize="sm"
                color={textColor}
                _hover={{ color: "blue.600" }}
              >
                About
              </ChakraLink>
              <ChakraLink
                as={Link}
                to="/docs"
                fontSize="sm"
                color={textColor}
                _hover={{ color: "blue.600" }}
              >
                Documentation
              </ChakraLink>
              <ChakraLink
                href="https://github.com/your-org/pwa-generator"
                fontSize="sm"
                color={textColor}
                _hover={{ color: "blue.600" }}
                isExternal
              >
                GitHub
              </ChakraLink>
            </HStack>
          </Flex>

          <Box mt={6} pt={6} borderTopWidth="1px" borderColor={borderColor}>
            <Text fontSize="sm" color={textColor} textAlign="center">
              © {new Date().getFullYear()} PWA Generator. Built with ❤️ for
              developers.
            </Text>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
