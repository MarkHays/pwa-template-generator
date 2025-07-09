import React, { useState } from "react";
import {
  VStack,
  HStack,
  Box,
  Text,
  Heading,
  Button,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Icon,
  useColorModeValue,
  Badge,
  Flex,
  RadioGroup,
  Radio,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiSettings,
  FiType,
  FiLayout,
  FiSun,
  FiMoon,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";
import { toast } from "react-hot-toast";

const MotionBox = motion(Box);

interface ColorScheme {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  preview: string[];
}

interface FontFamily {
  id: string;
  name: string;
  category: string;
  preview: string;
  googleFont: boolean;
}

interface Layout {
  id: string;
  name: string;
  description: string;
  preview: string;
  bestFor: string[];
}

const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and corporate look",
    primary: "#3182ce",
    secondary: "#718096",
    accent: "#38a169",
    background: "#ffffff",
    preview: ["#3182ce", "#718096", "#38a169", "#f7fafc"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Trendy and contemporary",
    primary: "#805ad5",
    secondary: "#4a5568",
    accent: "#ed8936",
    background: "#ffffff",
    preview: ["#805ad5", "#4a5568", "#ed8936", "#faf5ff"],
  },
  {
    id: "vibrant",
    name: "Vibrant",
    description: "Bold and energetic",
    primary: "#e53e3e",
    secondary: "#2d3748",
    accent: "#d69e2e",
    background: "#ffffff",
    preview: ["#e53e3e", "#2d3748", "#d69e2e", "#fff5f5"],
  },
  {
    id: "nature",
    name: "Nature",
    description: "Earth tones and organic",
    primary: "#38a169",
    secondary: "#4a5568",
    accent: "#d69e2e",
    background: "#ffffff",
    preview: ["#38a169", "#4a5568", "#d69e2e", "#f0fff4"],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool blues and teals",
    primary: "#0987a0",
    secondary: "#4a5568",
    accent: "#3182ce",
    background: "#ffffff",
    preview: ["#0987a0", "#4a5568", "#3182ce", "#e6fffa"],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm oranges and reds",
    primary: "#ed8936",
    secondary: "#4a5568",
    accent: "#e53e3e",
    background: "#ffffff",
    preview: ["#ed8936", "#4a5568", "#e53e3e", "#fffbf0"],
  },
];

const FONT_FAMILIES: FontFamily[] = [
  {
    id: "inter",
    name: "Inter",
    category: "Sans Serif",
    preview: "The quick brown fox jumps over the lazy dog",
    googleFont: true,
  },
  {
    id: "roboto",
    name: "Roboto",
    category: "Sans Serif",
    preview: "The quick brown fox jumps over the lazy dog",
    googleFont: true,
  },
  {
    id: "poppins",
    name: "Poppins",
    category: "Sans Serif",
    preview: "The quick brown fox jumps over the lazy dog",
    googleFont: true,
  },
  {
    id: "playfair",
    name: "Playfair Display",
    category: "Serif",
    preview: "The quick brown fox jumps over the lazy dog",
    googleFont: true,
  },
  {
    id: "lora",
    name: "Lora",
    category: "Serif",
    preview: "The quick brown fox jumps over the lazy dog",
    googleFont: true,
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    category: "Monospace",
    preview: "The quick brown fox jumps over the lazy dog",
    googleFont: true,
  },
];

const LAYOUTS: Layout[] = [
  {
    id: "standard",
    name: "Standard",
    description: "Traditional header, main content, footer layout",
    preview: "⬛⬛⬛\n⬜⬜⬜\n⬜⬜⬜\n⬛⬛⬛",
    bestFor: ["Business sites", "Portfolios", "General purpose"],
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "Side navigation with main content area",
    preview: "⬛⬜⬜\n⬛⬜⬜\n⬛⬜⬜\n⬛⬜⬜",
    bestFor: ["Dashboards", "Admin panels", "Data-heavy apps"],
  },
  {
    id: "grid",
    name: "Grid",
    description: "Card-based grid layout for content",
    preview: "⬛⬛⬛\n⬜⬜⬜\n⬜⬜⬜\n⬜⬜⬜",
    bestFor: ["Galleries", "Product catalogs", "Content sites"],
  },
  {
    id: "landing",
    name: "Landing",
    description: "Single page with hero and sections",
    preview: "⬛⬛⬛\n⬜⬜⬜\n⬜⬜⬜\n⬜⬜⬜",
    bestFor: ["Marketing sites", "Product launches", "Services"],
  },
];

const CustomizationStep: React.FC = () => {
  const { customization, setCustomization, businessInfo, setCurrentStep } =
    usePWAGeneratorStore();

  const [activeTab, setActiveTab] = useState(0);
  const [customPrimary, setCustomPrimary] = useState(
    customization.primaryColor,
  );
  const [customSecondary, setCustomSecondary] = useState(
    customization.secondaryColor,
  );

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const previewBg = useColorModeValue("gray.50", "gray.700");

  const handleColorSchemeChange = (schemeId: string) => {
    const scheme = COLOR_SCHEMES.find((s) => s.id === schemeId);
    if (scheme) {
      setCustomization({
        colorScheme: schemeId,
        primaryColor: scheme.primary,
        secondaryColor: scheme.secondary,
      });
      setCustomPrimary(scheme.primary);
      setCustomSecondary(scheme.secondary);
      toast.success(`${scheme.name} theme applied!`);
    }
  };

  const handleCustomColorChange = (
    type: "primary" | "secondary",
    color: string,
  ) => {
    if (type === "primary") {
      setCustomPrimary(color);
      setCustomization({ primaryColor: color });
    } else {
      setCustomSecondary(color);
      setCustomization({ secondaryColor: color });
    }
  };

  const handleFontChange = (fontId: string) => {
    const font = FONT_FAMILIES.find((f) => f.id === fontId);
    if (font) {
      setCustomization({ fontFamily: fontId });
      toast.success(`${font.name} font selected!`);
    }
  };

  const handleLayoutChange = (layoutId: string) => {
    const layout = LAYOUTS.find((l) => l.id === layoutId);
    if (layout) {
      setCustomization({ layout: layoutId });
      toast.success(`${layout.name} layout selected!`);
    }
  };

  const handleContinue = () => {
    setCurrentStep(5); // Move to deployment step
  };

  const selectedScheme = COLOR_SCHEMES.find(
    (s) => s.id === customization.colorScheme,
  );
  const selectedFont = FONT_FAMILIES.find(
    (f) => f.id === customization.fontFamily,
  );

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <VStack spacing={4} align="start">
            <HStack spacing={3}>
              <Icon as={FiSettings} boxSize={8} color="blue.500" />
              <Heading size="lg" color="blue.500">
                Customize Your Design
              </Heading>
            </HStack>
            <Text color="gray.600" fontSize="lg">
              Make your PWA uniquely yours with custom colors, fonts, and layout
              options. Preview changes in real-time as you customize.
            </Text>
          </VStack>
        </MotionBox>

        {/* Customization Tabs */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs
            index={activeTab}
            onChange={setActiveTab}
            colorScheme="blue"
            variant="enclosed"
          >
            <TabList>
              <Tab>
                <Icon as={FiSettings} mr={2} />
                Colors & Theme
              </Tab>
              <Tab>
                <Icon as={FiType} mr={2} />
                Typography
              </Tab>
              <Tab>
                <Icon as={FiLayout} mr={2} />
                Layout
              </Tab>
              <Tab>
                <Icon as={FiSettings} mr={2} />
                Advanced
              </Tab>
            </TabList>

            <TabPanels>
              {/* Colors & Theme Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Color Schemes */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Color Schemes</Heading>
                    </CardHeader>
                    <CardBody>
                      <RadioGroup
                        value={customization.colorScheme}
                        onChange={handleColorSchemeChange}
                      >
                        <Grid
                          templateColumns={{
                            base: "1fr",
                            md: "repeat(2, 1fr)",
                            lg: "repeat(3, 1fr)",
                          }}
                          gap={4}
                        >
                          {COLOR_SCHEMES.map((scheme) => (
                            <MotionBox
                              key={scheme.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                border="2px"
                                borderColor={
                                  customization.colorScheme === scheme.id
                                    ? scheme.primary
                                    : borderColor
                                }
                                cursor="pointer"
                                onClick={() =>
                                  handleColorSchemeChange(scheme.id)
                                }
                                _hover={{ borderColor: scheme.primary }}
                              >
                                <CardBody>
                                  <VStack spacing={4}>
                                    <HStack spacing={3}>
                                      <Radio
                                        value={scheme.id}
                                        colorScheme="blue"
                                      />
                                      <VStack align="start" spacing={1}>
                                        <Text fontWeight="bold">
                                          {scheme.name}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                          {scheme.description}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                    <HStack spacing={2}>
                                      {scheme.preview.map((color, index) => (
                                        <Box
                                          key={index}
                                          w="20px"
                                          h="20px"
                                          bg={color}
                                          borderRadius="full"
                                          border="1px"
                                          borderColor="gray.300"
                                        />
                                      ))}
                                    </HStack>
                                  </VStack>
                                </CardBody>
                              </Card>
                            </MotionBox>
                          ))}
                        </Grid>
                      </RadioGroup>
                    </CardBody>
                  </Card>

                  {/* Custom Colors */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Custom Colors</Heading>
                    </CardHeader>
                    <CardBody>
                      <Grid
                        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                        gap={6}
                      >
                        <FormControl>
                          <FormLabel>Primary Color</FormLabel>
                          <InputGroup>
                            <InputLeftElement>
                              <Box
                                w="20px"
                                h="20px"
                                bg={customPrimary}
                                borderRadius="md"
                                border="1px"
                                borderColor="gray.300"
                              />
                            </InputLeftElement>
                            <Input
                              type="color"
                              value={customPrimary}
                              onChange={(e) =>
                                handleCustomColorChange(
                                  "primary",
                                  e.target.value,
                                )
                              }
                            />
                          </InputGroup>
                        </FormControl>
                        <FormControl>
                          <FormLabel>Secondary Color</FormLabel>
                          <InputGroup>
                            <InputLeftElement>
                              <Box
                                w="20px"
                                h="20px"
                                bg={customSecondary}
                                borderRadius="md"
                                border="1px"
                                borderColor="gray.300"
                              />
                            </InputLeftElement>
                            <Input
                              type="color"
                              value={customSecondary}
                              onChange={(e) =>
                                handleCustomColorChange(
                                  "secondary",
                                  e.target.value,
                                )
                              }
                            />
                          </InputGroup>
                        </FormControl>
                      </Grid>
                    </CardBody>
                  </Card>

                  {/* Dark Mode */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                      <HStack spacing={4} justify="space-between">
                        <VStack align="start" spacing={2}>
                          <HStack spacing={3}>
                            <Icon
                              as={customization.darkMode ? FiMoon : FiSun}
                              color="purple.500"
                            />
                            <Heading size="md">Dark Mode</Heading>
                          </HStack>
                          <Text color="gray.600">
                            Enable dark mode for better viewing in low-light
                            conditions
                          </Text>
                        </VStack>
                        <Switch
                          colorScheme="purple"
                          size="lg"
                          isChecked={customization.darkMode}
                          onChange={(e) =>
                            setCustomization({ darkMode: e.target.checked })
                          }
                        />
                      </HStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Typography Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Font Family</Heading>
                    </CardHeader>
                    <CardBody>
                      <RadioGroup
                        value={customization.fontFamily}
                        onChange={handleFontChange}
                      >
                        <Grid
                          templateColumns={{
                            base: "1fr",
                            md: "repeat(2, 1fr)",
                          }}
                          gap={4}
                        >
                          {FONT_FAMILIES.map((font) => (
                            <Card
                              key={font.id}
                              border="2px"
                              borderColor={
                                customization.fontFamily === font.id
                                  ? "blue.300"
                                  : borderColor
                              }
                              cursor="pointer"
                              onClick={() => handleFontChange(font.id)}
                              _hover={{ borderColor: "blue.300" }}
                            >
                              <CardBody>
                                <VStack spacing={4} align="start">
                                  <HStack spacing={3}>
                                    <Radio value={font.id} colorScheme="blue" />
                                    <VStack align="start" spacing={1}>
                                      <Text fontWeight="bold">{font.name}</Text>
                                      <Badge colorScheme="blue" size="sm">
                                        {font.category}
                                      </Badge>
                                    </VStack>
                                  </HStack>
                                  <Text
                                    fontSize="sm"
                                    fontFamily={font.id}
                                    color="gray.600"
                                  >
                                    {font.preview}
                                  </Text>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}
                        </Grid>
                      </RadioGroup>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Layout Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Layout Options</Heading>
                    </CardHeader>
                    <CardBody>
                      <RadioGroup
                        value={customization.layout}
                        onChange={handleLayoutChange}
                      >
                        <Grid
                          templateColumns={{
                            base: "1fr",
                            md: "repeat(2, 1fr)",
                          }}
                          gap={4}
                        >
                          {LAYOUTS.map((layout) => (
                            <Card
                              key={layout.id}
                              border="2px"
                              borderColor={
                                customization.layout === layout.id
                                  ? "blue.300"
                                  : borderColor
                              }
                              cursor="pointer"
                              onClick={() => handleLayoutChange(layout.id)}
                              _hover={{ borderColor: "blue.300" }}
                            >
                              <CardBody>
                                <VStack spacing={4} align="start">
                                  <HStack spacing={3}>
                                    <Radio
                                      value={layout.id}
                                      colorScheme="blue"
                                    />
                                    <VStack align="start" spacing={1}>
                                      <Text fontWeight="bold">
                                        {layout.name}
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {layout.description}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Box
                                    w="full"
                                    h="60px"
                                    bg={previewBg}
                                    borderRadius="md"
                                    border="1px"
                                    borderColor="gray.300"
                                    p={2}
                                  >
                                    <Text
                                      fontSize="xs"
                                      fontFamily="monospace"
                                      lineHeight={1.2}
                                    >
                                      {layout.preview}
                                    </Text>
                                  </Box>
                                  <HStack spacing={2} wrap="wrap">
                                    {layout.bestFor.map((use, index) => (
                                      <Badge
                                        key={index}
                                        colorScheme="green"
                                        fontSize="xs"
                                      >
                                        {use}
                                      </Badge>
                                    ))}
                                  </HStack>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}
                        </Grid>
                      </RadioGroup>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Advanced Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Animations */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardBody>
                      <HStack spacing={4} justify="space-between">
                        <VStack align="start" spacing={2}>
                          <HStack spacing={3}>
                            <Icon as={FiZap} color="yellow.500" />
                            <Heading size="md">Animations</Heading>
                          </HStack>
                          <Text color="gray.600">
                            Enable smooth animations and transitions for
                            enhanced user experience
                          </Text>
                        </VStack>
                        <Switch
                          colorScheme="yellow"
                          size="lg"
                          isChecked={customization.animations}
                          onChange={(e) =>
                            setCustomization({ animations: e.target.checked })
                          }
                        />
                      </HStack>
                    </CardBody>
                  </Card>

                  {/* Custom CSS */}
                  <Card bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Custom CSS</Heading>
                    </CardHeader>
                    <CardBody>
                      <FormControl>
                        <FormLabel>Additional CSS Styles</FormLabel>
                        <Textarea
                          value={customization.customCSS}
                          onChange={(e) =>
                            setCustomization({ customCSS: e.target.value })
                          }
                          placeholder="/* Add your custom CSS here */&#10;.custom-class {&#10;  color: #333;&#10;  font-size: 16px;&#10;}"
                          rows={8}
                          fontFamily="monospace"
                          fontSize="sm"
                        />
                      </FormControl>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MotionBox>

        {/* Preview */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Live Preview</Heading>
            </CardHeader>
            <CardBody>
              <Box
                w="full"
                h="200px"
                bg={selectedScheme?.background || "#ffffff"}
                border="1px"
                borderColor="gray.300"
                borderRadius="lg"
                p={4}
                position="relative"
                overflow="hidden"
              >
                {/* Mock preview content */}
                <VStack spacing={4} align="start">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={customPrimary}
                    fontFamily={selectedFont?.id}
                  >
                    {businessInfo.businessName || "Your Business Name"}
                  </Text>
                  <Text
                    fontSize="md"
                    color={customSecondary}
                    fontFamily={selectedFont?.id}
                  >
                    {businessInfo.description ||
                      "Your business description will appear here"}
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    style={{
                      backgroundColor: customPrimary,
                      fontFamily: selectedFont?.id,
                    }}
                  >
                    Get Started
                  </Button>
                </VStack>
              </Box>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Continue Button */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Flex justify="flex-end">
            <Button
              colorScheme="blue"
              size="lg"
              rightIcon={<FiArrowRight />}
              onClick={handleContinue}
            >
              Continue to Deployment
            </Button>
          </Flex>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default CustomizationStep;
