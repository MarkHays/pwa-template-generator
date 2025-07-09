import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { toast } from "react-hot-toast";
import {
  generateProjectFiles,
  createProjectZip,
} from "../utils/projectGenerator";

// Types
export interface BusinessInfo {
  businessName: string;
  industry: string;
  description: string;
  targetAudience: string;
  location?: string;
  website?: string;
  contactEmail?: string;
  contactPhone?: string;
  currentChallenges: string[];
  businessGoals: string[];
}

export interface AIRecommendations {
  analysis: {
    businessType: string;
    targetAudience: string;
    competitiveAdvantages: string[];
    keyFeatures: string[];
    contentStrategy: string;
    userJourney: string[];
    conversionGoals: string[];
  } | null;
  recommendations: {
    framework: string;
    features: string[];
    components: string[];
    colorScheme: string;
    layout: string;
    integrations: string[];
    performance: any;
    seo: any;
  } | null;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    aboutText: string;
    servicesIntro: string;
    ctaTexts: string[];
    testimonialPlaceholders: any[];
    metaDescription: string;
    keywords: string[];
  } | null;
  seoStrategy: any;
  performanceGoals: any;
  insights: {
    competitiveAnalysis: any;
    marketTrends: string[];
    userBehavior: any;
    conversionOptimization: any;
    technicalRecommendations: any;
    recommendations: string[];
  } | null;
}

export interface Customization {
  colorScheme: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  layout: string;
  darkMode: boolean;
  animations: boolean;
  customCSS: string;
}

export interface Deployment {
  platforms: string[];
  cicd: string;
  testing: boolean;
  monitoring: string[];
  analytics: string[];
  domain?: string;
  ssl: boolean;
}

export interface GeneratedProject {
  id: string;
  name: string;
  framework: string;
  features: string[];
  files: Array<{
    path: string;
    content: string;
    type: string;
  }>;
  downloadUrl?: string;
  createdAt: string;
}

export interface PWAGeneratorState {
  // Current step in the wizard
  currentStep: number;

  // Business information
  businessInfo: BusinessInfo;

  // AI recommendations
  aiRecommendations: AIRecommendations;

  // Technical selections
  selectedFramework: string;
  selectedFeatures: string[];
  typescript: boolean;

  // Customization
  customization: Customization;

  // Deployment
  deployment: Deployment;

  // Generation state
  isGenerating: boolean;
  generationProgress: number;
  generationStep: string;
  generatedProject: GeneratedProject | null;

  // UI state
  isAnalyzing: boolean;
  error: string | null;

  // History
  projectHistory: GeneratedProject[];
}

// Actions
export type PWAGeneratorAction =
  | { type: "SET_CURRENT_STEP"; payload: number }
  | { type: "SET_BUSINESS_INFO"; payload: Partial<BusinessInfo> }
  | { type: "SET_AI_RECOMMENDATIONS"; payload: AIRecommendations }
  | { type: "SET_SELECTED_FRAMEWORK"; payload: string }
  | { type: "SET_SELECTED_FEATURES"; payload: string[] }
  | { type: "SET_TYPESCRIPT"; payload: boolean }
  | { type: "SET_CUSTOMIZATION"; payload: Partial<Customization> }
  | { type: "SET_DEPLOYMENT"; payload: Partial<Deployment> }
  | { type: "SET_GENERATING"; payload: boolean }
  | {
      type: "SET_GENERATION_PROGRESS";
      payload: { progress: number; step: string };
    }
  | { type: "SET_GENERATED_PROJECT"; payload: GeneratedProject }
  | { type: "SET_ANALYZING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_TO_HISTORY"; payload: GeneratedProject }
  | { type: "RESET_BUILDER" };

// Initial state
const initialState: PWAGeneratorState = {
  currentStep: 0,
  businessInfo: {
    businessName: "",
    industry: "",
    description: "",
    targetAudience: "",
    location: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    currentChallenges: [],
    businessGoals: [],
  },
  aiRecommendations: {
    analysis: null,
    recommendations: null,
    content: null,
    seoStrategy: null,
    performanceGoals: null,
    insights: null,
  },
  selectedFramework: "",
  selectedFeatures: [],
  typescript: true,
  customization: {
    colorScheme: "professional",
    primaryColor: "#3182ce",
    secondaryColor: "#718096",
    fontFamily: "Inter",
    layout: "standard",
    darkMode: false,
    animations: true,
    customCSS: "",
  },
  deployment: {
    platforms: [],
    cicd: "",
    testing: false,
    monitoring: [],
    analytics: [],
    domain: "",
    ssl: true,
  },
  isGenerating: false,
  generationProgress: 0,
  generationStep: "",
  generatedProject: null,
  isAnalyzing: false,
  error: null,
  projectHistory: [],
};

// Reducer
function pwaGeneratorReducer(
  state: PWAGeneratorState,
  action: PWAGeneratorAction,
): PWAGeneratorState {
  switch (action.type) {
    case "SET_CURRENT_STEP":
      return {
        ...state,
        currentStep: action.payload,
        error: null,
      };

    case "SET_BUSINESS_INFO":
      return {
        ...state,
        businessInfo: {
          ...state.businessInfo,
          ...action.payload,
        },
      };

    case "SET_AI_RECOMMENDATIONS":
      return {
        ...state,
        aiRecommendations: action.payload,
        isAnalyzing: false,
      };

    case "SET_SELECTED_FRAMEWORK":
      return {
        ...state,
        selectedFramework: action.payload,
      };

    case "SET_SELECTED_FEATURES":
      return {
        ...state,
        selectedFeatures: action.payload,
      };

    case "SET_TYPESCRIPT":
      return {
        ...state,
        typescript: action.payload,
      };

    case "SET_CUSTOMIZATION":
      return {
        ...state,
        customization: {
          ...state.customization,
          ...action.payload,
        },
      };

    case "SET_DEPLOYMENT":
      return {
        ...state,
        deployment: {
          ...state.deployment,
          ...action.payload,
        },
      };

    case "SET_GENERATING":
      return {
        ...state,
        isGenerating: action.payload,
        generationProgress: action.payload ? 0 : state.generationProgress,
        generationStep: action.payload ? "Starting..." : state.generationStep,
      };

    case "SET_GENERATION_PROGRESS":
      return {
        ...state,
        generationProgress: action.payload.progress,
        generationStep: action.payload.step,
      };

    case "SET_GENERATED_PROJECT":
      return {
        ...state,
        generatedProject: action.payload,
        isGenerating: false,
        generationProgress: 100,
        generationStep: "Complete",
      };

    case "SET_ANALYZING":
      return {
        ...state,
        isAnalyzing: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isGenerating: false,
        isAnalyzing: false,
      };

    case "ADD_TO_HISTORY":
      return {
        ...state,
        projectHistory: [action.payload, ...state.projectHistory.slice(0, 9)], // Keep last 10
      };

    case "RESET_BUILDER":
      return {
        ...initialState,
        projectHistory: state.projectHistory, // Keep history
      };

    default:
      return state;
  }
}

// Context
const PWAGeneratorContext = createContext<{
  state: PWAGeneratorState;
  dispatch: React.Dispatch<PWAGeneratorAction>;
} | null>(null);

// Provider component
export const PWAGeneratorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(pwaGeneratorReducer, initialState);

  return (
    <PWAGeneratorContext.Provider value={{ state, dispatch }}>
      {children}
    </PWAGeneratorContext.Provider>
  );
};

// Custom hook
export const usePWAGeneratorStore = () => {
  const context = useContext(PWAGeneratorContext);
  if (!context) {
    throw new Error(
      "usePWAGeneratorStore must be used within a PWAGeneratorProvider",
    );
  }

  const { state, dispatch } = context;

  // Action creators
  const setCurrentStep = (step: number) => {
    dispatch({ type: "SET_CURRENT_STEP", payload: step });
  };

  const setBusinessInfo = (info: Partial<BusinessInfo>) => {
    dispatch({ type: "SET_BUSINESS_INFO", payload: info });
  };

  const setAIRecommendations = (recommendations: AIRecommendations) => {
    dispatch({ type: "SET_AI_RECOMMENDATIONS", payload: recommendations });
  };

  const setSelectedFramework = (framework: string) => {
    dispatch({ type: "SET_SELECTED_FRAMEWORK", payload: framework });
  };

  const setSelectedFeatures = (features: string[]) => {
    dispatch({ type: "SET_SELECTED_FEATURES", payload: features });
  };

  const setTypescript = (typescript: boolean) => {
    dispatch({ type: "SET_TYPESCRIPT", payload: typescript });
  };

  const setCustomization = (customization: Partial<Customization>) => {
    dispatch({ type: "SET_CUSTOMIZATION", payload: customization });
  };

  const setDeployment = (deployment: Partial<Deployment>) => {
    dispatch({ type: "SET_DEPLOYMENT", payload: deployment });
  };

  const setError = (error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  };

  const resetBuilder = () => {
    dispatch({ type: "RESET_BUILDER" });
  };

  // Async actions
  const analyzeBusinessNeeds = async () => {
    try {
      dispatch({ type: "SET_ANALYZING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Mock AI analysis - in real app, this would call your AI service
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockRecommendations: AIRecommendations = {
        analysis: {
          businessType: state.businessInfo.industry,
          targetAudience: state.businessInfo.targetAudience,
          competitiveAdvantages: [
            "Quality service",
            "Local presence",
            "Expertise",
          ],
          keyFeatures: ["Contact form", "Service showcase", "Testimonials"],
          contentStrategy: "Focus on trust and expertise",
          userJourney: ["Landing", "Services", "Contact"],
          conversionGoals: ["Contact form submission", "Phone call"],
        },
        recommendations: {
          framework: "react",
          features: ["contact-form", "gallery", "testimonials"],
          components: ["Header", "Hero", "Services", "Contact", "Footer"],
          colorScheme: "professional",
          layout: "standard",
          integrations: ["google-analytics"],
          performance: { lcp: 2.5, fid: 100, cls: 0.1 },
          seo: {
            title: `${state.businessInfo.businessName} - Professional Services`,
          },
        },
        content: {
          heroTitle: `Welcome to ${state.businessInfo.businessName}`,
          heroSubtitle: "Professional services you can trust",
          aboutText: `${state.businessInfo.businessName} provides quality services with expertise and dedication.`,
          servicesIntro:
            "Our comprehensive services are designed to meet your needs.",
          ctaTexts: ["Get Started", "Contact Us", "Learn More"],
          testimonialPlaceholders: [
            { name: "John Doe", text: "Excellent service!", rating: 5 },
            { name: "Jane Smith", text: "Highly recommended.", rating: 5 },
          ],
          metaDescription: `${state.businessInfo.businessName} - ${state.businessInfo.description}`,
          keywords: [
            state.businessInfo.businessName.toLowerCase(),
            state.businessInfo.industry,
          ],
        },
        seoStrategy: {
          title: `${state.businessInfo.businessName} - ${state.businessInfo.industry}`,
          description: state.businessInfo.description,
          keywords: [
            state.businessInfo.businessName,
            state.businessInfo.industry,
          ],
        },
        performanceGoals: {
          coreWebVitals: { LCP: 2.5, FID: 100, CLS: 0.1 },
          budgets: { javascript: "200KB", css: "50KB" },
        },
        insights: {
          competitiveAnalysis: {
            strengths: ["Local presence"],
            opportunities: ["Online presence"],
          },
          marketTrends: ["Mobile-first", "Fast loading", "Local SEO"],
          userBehavior: {
            primaryActions: ["contact"],
            devicePreferences: ["mobile"],
          },
          conversionOptimization: {
            primaryCTA: "contact",
            trustSignals: ["testimonials"],
          },
          technicalRecommendations: [
            "responsive design",
            "fast loading",
            "SEO optimization",
          ],
          recommendations: [
            "Focus on mobile optimization",
            "Implement contact forms",
            "Add customer testimonials",
            "Optimize for local search",
          ],
        },
      };

      dispatch({
        type: "SET_AI_RECOMMENDATIONS",
        payload: mockRecommendations,
      });
      toast.success("AI analysis complete!");
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to analyze business needs",
      });
      toast.error("AI analysis failed");
    }
  };

  const generateProject = async () => {
    try {
      dispatch({ type: "SET_GENERATING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const steps = [
        "Analyzing business requirements...",
        "Creating project structure...",
        "Generating components...",
        "Setting up PWA configuration...",
        "Implementing selected features...",
        "Optimizing performance...",
        "Creating deployment files...",
        "Finalizing build...",
      ];

      // Simulate progress updates
      for (let i = 0; i < steps.length; i++) {
        dispatch({
          type: "SET_GENERATION_PROGRESS",
          payload: {
            progress: ((i + 1) / steps.length) * 100,
            step: steps[i],
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Generate all project files using the new generator
      const files = generateProjectFiles(
        state.businessInfo,
        state.selectedFramework || "react",
        state.selectedFeatures,
        state.typescript,
      );

      // Add deployment files
      if (state.deployment.platforms.includes("vercel")) {
        files.push({
          path: "vercel.json",
          content: JSON.stringify(
            {
              rewrites: [{ source: "/(.*)", destination: "/index.html" }],
            },
            null,
            2,
          ),
          type: "json",
        });
      }

      if (state.deployment.platforms.includes("netlify")) {
        files.push({
          path: "_redirects",
          content: "/*    /index.html   200",
          type: "text",
        });
      }

      // Create downloadable zip file
      const projectName =
        state.businessInfo.businessName.toLowerCase().replace(/\s+/g, "-") ||
        "my-pwa";
      const zipBlob = await createProjectZip(
        files,
        projectName,
        state.selectedFeatures,
      );
      const downloadUrl = URL.createObjectURL(zipBlob);

      const generatedProject: GeneratedProject = {
        id: Date.now().toString(),
        name: state.businessInfo.businessName || "My PWA",
        framework: state.selectedFramework || "react",
        features: state.selectedFeatures,
        files,
        downloadUrl,
        createdAt: new Date().toISOString(),
      };

      dispatch({ type: "SET_GENERATED_PROJECT", payload: generatedProject });
      dispatch({ type: "ADD_TO_HISTORY", payload: generatedProject });
      toast.success("PWA generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to generate project" });
      toast.error("Generation failed");
    }
  };

  return {
    // State
    ...state,

    // Actions
    setCurrentStep,
    setBusinessInfo,
    setAIRecommendations,
    setSelectedFramework,
    setSelectedFeatures,
    setTypescript,
    setCustomization,
    setDeployment,
    setError,
    resetBuilder,

    // Async actions
    analyzeBusinessNeeds,
    generateProject,
  };
};
