import React, { useEffect } from "react";
import {
  VStack,
  HStack,
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Button,
  Card,
  CardBody,
  Text,
  Heading,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  FiUser,
  FiGlobe,
  FiMapPin,
  FiTarget,
  FiInfo,
  FiTrendingUp,
  FiShoppingCart,
  FiHeart,
  FiBook,
  FiMusic,
  FiCamera,
  FiHome,
  FiTool,
  FiDollarSign,
} from "react-icons/fi";
import { usePWAGeneratorStore } from "../../store/PWAGeneratorStore";
import { toast } from "react-hot-toast";

const MotionBox = motion(Box);

// Industry options with icons
const INDUSTRIES = [
  { value: "ecommerce", label: "E-commerce & Retail", icon: FiShoppingCart },
  { value: "healthcare", label: "Healthcare & Medical", icon: FiHeart },
  { value: "education", label: "Education & Training", icon: FiBook },
  { value: "entertainment", label: "Entertainment & Media", icon: FiMusic },
  { value: "photography", label: "Photography & Creative", icon: FiCamera },
  { value: "realestate", label: "Real Estate", icon: FiHome },
  { value: "services", label: "Professional Services", icon: FiTool },
  { value: "finance", label: "Finance & Banking", icon: FiDollarSign },
  { value: "technology", label: "Technology & Software", icon: FiTrendingUp },
  { value: "other", label: "Other", icon: FiInfo },
];

// Target audience options
const TARGET_AUDIENCES = [
  "General Consumers",
  "Business Professionals",
  "Students",
  "Seniors",
  "Millennials",
  "Gen Z",
  "Small Business Owners",
  "Enterprise Customers",
  "Mobile Users",
  "Desktop Users",
];

// Validation schema
const businessInfoSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(1, "Please select an industry"),
  targetAudience: z.string().min(1, "Please select your target audience"),
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  location: z.string().optional(),
});

type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;

const BusinessInfoStep: React.FC = () => {
  const { businessInfo, setBusinessInfo } = usePWAGeneratorStore();
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<BusinessInfoFormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      businessName: businessInfo.businessName || "",
      description: businessInfo.description || "",
      industry: businessInfo.industry || "",
      targetAudience: businessInfo.targetAudience || "",
      website: businessInfo.website || "",
      location: businessInfo.location || "",
    },
    mode: "onChange",
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isValid) {
      setBusinessInfo(watchedValues);
    }
  }, [watchedValues, isValid, setBusinessInfo]);

  const onSubmit = (data: BusinessInfoFormData) => {
    const businessData = {
      ...data,
      currentChallenges: businessInfo.currentChallenges || [],
      businessGoals: businessInfo.businessGoals || [],
    };
    setBusinessInfo(businessData);
    toast.success("Business information saved!");
  };

  const selectedIndustry = INDUSTRIES.find(
    (ind) => ind.value === watchedValues.industry,
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
            <Heading size="lg" color="blue.500">
              Tell us about your business
            </Heading>
            <Text color="gray.600" fontSize="lg">
              We'll use this information to create personalized recommendations
              and generate a PWA that perfectly fits your needs.
            </Text>
          </VStack>
        </MotionBox>

        {/* Form */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6}>
              {/* Basic Information */}
              <Card bg={cardBg} w="full" border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Flex align="center" gap={3}>
                      <Icon as={FiUser} boxSize={5} color="blue.500" />
                      <Heading size="md">Basic Information</Heading>
                    </Flex>

                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={6}
                    >
                      <GridItem>
                        <FormControl isInvalid={!!errors.businessName}>
                          <FormLabel>Business Name *</FormLabel>
                          <Input
                            {...register("businessName")}
                            placeholder="Enter your business name"
                            size="lg"
                          />
                          <FormErrorMessage>
                            {errors.businessName?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>

                      <GridItem>
                        <FormControl isInvalid={!!errors.industry}>
                          <FormLabel>Industry *</FormLabel>
                          <Select
                            {...register("industry")}
                            placeholder="Select your industry"
                            size="lg"
                          >
                            {INDUSTRIES.map((industry) => (
                              <option
                                key={industry.value}
                                value={industry.value}
                              >
                                {industry.label}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>
                            {errors.industry?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                    </Grid>

                    <FormControl isInvalid={!!errors.description}>
                      <FormLabel>Business Description *</FormLabel>
                      <Textarea
                        {...register("description")}
                        placeholder="Describe your business, what you do, and what makes you unique..."
                        rows={4}
                        size="lg"
                      />
                      <FormErrorMessage>
                        {errors.description?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.targetAudience}>
                      <FormLabel>Target Audience *</FormLabel>
                      <Select
                        {...register("targetAudience")}
                        placeholder="Who is your primary audience?"
                        size="lg"
                      >
                        {TARGET_AUDIENCES.map((audience) => (
                          <option key={audience} value={audience}>
                            {audience}
                          </option>
                        ))}
                      </Select>
                      <FormErrorMessage>
                        {errors.targetAudience?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Additional Information */}
              <Card bg={cardBg} w="full" border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Flex align="center" gap={3}>
                      <Icon as={FiGlobe} boxSize={5} color="green.500" />
                      <Heading size="md">Additional Information</Heading>
                    </Flex>

                    <Grid
                      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                      gap={6}
                    >
                      <GridItem>
                        <FormControl isInvalid={!!errors.website}>
                          <FormLabel>Website URL</FormLabel>
                          <InputGroup size="lg">
                            <InputLeftElement>
                              <Icon as={FiGlobe} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              {...register("website")}
                              type="url"
                              placeholder="https://yourbusiness.com"
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            {errors.website?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>

                      <GridItem>
                        <FormControl isInvalid={!!errors.location}>
                          <FormLabel>Location</FormLabel>
                          <InputGroup size="lg">
                            <InputLeftElement>
                              <Icon as={FiMapPin} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              {...register("location")}
                              placeholder="City, State, Country"
                            />
                          </InputGroup>
                          <FormErrorMessage>
                            {errors.location?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </VStack>
                </CardBody>
              </Card>

              {/* Business Goals & Challenges */}
              <Card bg={cardBg} w="full" border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Flex align="center" gap={3}>
                      <Icon as={FiTarget} boxSize={5} color="purple.500" />
                      <Heading size="md">Business Goals & Challenges</Heading>
                    </Flex>

                    <FormControl>
                      <FormLabel>Current Business Challenges</FormLabel>
                      <Textarea
                        placeholder="What challenges is your business currently facing? (e.g., low online presence, customer engagement, mobile accessibility)"
                        rows={3}
                        size="lg"
                        defaultValue={
                          businessInfo.currentChallenges?.join("\n") || ""
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Business Goals</FormLabel>
                      <Textarea
                        placeholder="What are your main business goals for this PWA? (e.g., increase sales, improve customer experience, expand market reach)"
                        rows={3}
                        size="lg"
                        defaultValue={
                          businessInfo.businessGoals?.join("\n") || ""
                        }
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Industry Preview */}
              {selectedIndustry && (
                <MotionBox
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  w="full"
                >
                  <Card bg="blue.50" borderColor="blue.200" border="1px">
                    <CardBody>
                      <HStack spacing={4}>
                        <Icon
                          as={selectedIndustry.icon}
                          boxSize={8}
                          color="blue.500"
                        />
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <Text fontWeight="bold" color="blue.700">
                              Industry Selected:
                            </Text>
                            <Badge colorScheme="blue" px={3} py={1}>
                              {selectedIndustry.label}
                            </Badge>
                          </HStack>
                          <Text color="blue.600" fontSize="sm">
                            We'll customize your PWA recommendations based on{" "}
                            {selectedIndustry.label.toLowerCase()} industry best
                            practices.
                          </Text>
                        </VStack>
                      </HStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              )}

              {/* Submit Button */}
              <Flex justify="flex-end" w="full">
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  isDisabled={!isValid}
                  leftIcon={<Icon as={FiTarget} />}
                >
                  Save & Continue
                </Button>
              </Flex>
            </VStack>
          </form>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default BusinessInfoStep;
