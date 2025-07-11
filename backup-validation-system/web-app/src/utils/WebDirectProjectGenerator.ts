/**
 * Web-Compatible Direct Project Generator
 * Generates working PWA projects directly in the browser without filesystem operations
 */

import { AIRecommendations } from "../services/aiService";
import { enhancedProjectValidator } from "../services/enhancedProjectValidator";

interface ProjectConfig {
  projectName: string;
  businessName: string;
  framework: string;
  industry: string;
  location?: string;
  targetAudience: string;
  primaryGoal: string;
  features: string[];
  selectedFeatures: string[];
  aiRecommendations?: AIRecommendations;
  businessData: {
    name: string;
    location?: string;
    targetAudience: string;
    primaryGoal: string;
    description: string;
    contactEmail?: string;
    contactPhone?: string;
  };
}

interface GeneratedFile {
  path: string;
  content: string;
  type: string;
}

export class WebDirectProjectGenerator {
  constructor(_options: { typescript?: boolean } = {}) {
    // TypeScript support is implicit in this web generator
  }

  async generateProject(config: ProjectConfig): Promise<GeneratedFile[]> {
    console.log("🚀 Web Direct PWA Generation Starting...");

    const context = this.buildContext(config);
    const files: GeneratedFile[] = [];

    // Generate all files
    files.push(...this.generatePackageJson(context));
    files.push(...this.generateMainFiles(context));
    files.push(...this.generateComponents(context));
    files.push(...this.generatePages(context));
    files.push(...this.generateStyles(context));
    files.push(...this.generateConfigFiles(context));
    files.push(...this.generatePublicFiles(context));

    console.log("✅ Web Direct PWA generated successfully!");
    return files;
  }

  private buildContext(config: ProjectConfig) {
    const selectedFeatures = config.features || config.selectedFeatures || [];
    const pages = this.determinePagesFromFeatures(selectedFeatures);
    const components = this.determineComponentsFromFeatures(selectedFeatures);

    // Use AI-generated content when available, otherwise fallback to industry templates
    let aiContent;
    if (config.aiRecommendations?.content) {
      // Transform AI recommendations into the format expected by page generators
      aiContent = {
        hero: {
          title: config.aiRecommendations.content.heroTitle,
          subtitle: config.aiRecommendations.content.heroSubtitle,
        },
        services: [
          {
            title: "Our Services",
            description: config.aiRecommendations.content.servicesIntro,
          },
          {
            title: "Professional Consulting",
            description: "Expert advice and guidance for your business",
          },
          {
            title: "Quality Solutions",
            description: "Tailored solutions that meet your specific needs",
          },
        ],
        testimonials: config.aiRecommendations.content
          .testimonialPlaceholders || [
          {
            name: "Satisfied Customer",
            text: "Excellent service and professional approach.",
            rating: 5,
          },
        ],
        aboutText: config.aiRecommendations.content.aboutText,
        ctaTexts: config.aiRecommendations.content.ctaTexts || [
          "Get Started",
          "Contact Us",
          "Learn More",
        ],
      };
    } else {
      // Fallback to industry-based content generation
      aiContent = this.generateContentForIndustry(
        config.industry,
        config.businessData,
      );
    }

    return {
      projectName: config.projectName || "my-pwa-app",
      businessName: config.businessName || "My Business",
      description:
        config.businessData.description ||
        config.aiRecommendations?.content?.metaDescription ||
        "An AI-powered PWA application",
      framework: config.framework || "react",
      industry: config.industry || "small-business",
      selectedFeatures,
      pages,
      components,
      aiContent,
      businessData: config.businessData,
    };
  }

  private determinePagesFromFeatures(features: string[]): string[] {
    const pages = ["home", "about", "services"]; // Always include these

    if (features.includes("contact-form")) pages.push("contact");
    if (features.includes("gallery")) pages.push("gallery");
    if (features.includes("testimonials")) pages.push("testimonials");
    if (features.includes("auth")) pages.push("login", "register", "profile");
    if (features.includes("reviews")) pages.push("reviews");
    if (features.includes("chat")) pages.push("chat");

    // Extended features
    if (features.includes("profile") && !features.includes("auth")) {
      pages.push("profile");
    }
    if (features.includes("search")) pages.push("search");
    if (features.includes("payments")) pages.push("payments");
    if (features.includes("booking")) pages.push("booking");
    if (features.includes("analytics")) pages.push("analytics");
    if (features.includes("geolocation")) pages.push("locations");

    return pages;
  }

  private determineComponentsFromFeatures(features: string[]): string[] {
    const components = ["Navigation", "LoadingSpinner", "ErrorFallback"];

    if (features.includes("contact-form")) components.push("ContactForm");
    if (features.includes("gallery")) components.push("Gallery");
    if (features.includes("testimonials")) components.push("TestimonialCard");
    if (features.includes("auth")) components.push("AuthForm");
    if (features.includes("reviews")) components.push("ReviewCard");
    if (features.includes("chat"))
      components.push("LiveChat", "ChatMessage", "ChatWidget");

    // Extended features
    if (features.includes("search"))
      components.push("SearchBox", "SearchResults");
    if (features.includes("payments"))
      components.push("PaymentForm", "PaymentStatus");
    if (features.includes("booking"))
      components.push("BookingForm", "BookingCalendar");
    if (features.includes("analytics"))
      components.push("AnalyticsChart", "AnalyticsMetrics");
    if (features.includes("geolocation"))
      components.push("LocationMap", "LocationPicker");
    if (features.includes("notifications"))
      components.push("NotificationBanner", "NotificationList");
    if (features.includes("social"))
      components.push("SocialShare", "SocialLogin");
    if (features.includes("profile") && !features.includes("auth")) {
      components.push("ProfileForm");
    }

    return components;
  }

  private generateContentForIndustry(industry: string, businessData: any) {
    const contentMap: { [key: string]: any } = {
      restaurant: {
        hero: {
          title: `Welcome to ${businessData.name}`,
          subtitle:
            "Exceptional dining experience with fresh, locally-sourced ingredients",
        },
        services: [
          {
            title: "Fine Dining",
            description: "Exquisite cuisine crafted by our expert chefs",
          },
          {
            title: "Catering",
            description: "Full-service catering for your special events",
          },
          {
            title: "Private Events",
            description: "Intimate dining experiences for special occasions",
          },
        ],
        testimonials: [
          {
            name: "Sarah Johnson",
            text: "The food was absolutely incredible! Best dining experience in town.",
            rating: 5,
          },
          {
            name: "Mike Chen",
            text: "Amazing atmosphere and exceptional service. Highly recommend!",
            rating: 5,
          },
          {
            name: "Lisa Rodriguez",
            text: "Every dish was a masterpiece. Can't wait to come back!",
            rating: 5,
          },
        ],
      },
      technology: {
        hero: {
          title: `${businessData.name} - Innovation at Scale`,
          subtitle: "Cutting-edge technology solutions for modern businesses",
        },
        services: [
          {
            title: "Software Development",
            description: "Custom software solutions tailored to your needs",
          },
          {
            title: "Cloud Solutions",
            description: "Scalable cloud infrastructure and services",
          },
          {
            title: "AI & Machine Learning",
            description: "Intelligent automation and data-driven insights",
          },
        ],
        testimonials: [
          {
            name: "David Wilson",
            text: "Their technical expertise transformed our business operations.",
            rating: 5,
          },
          {
            name: "Emily Davis",
            text: "Outstanding development team with innovative solutions.",
            rating: 5,
          },
          {
            name: "James Brown",
            text: "Reliable, efficient, and always ahead of the curve.",
            rating: 5,
          },
        ],
      },
      healthcare: {
        hero: {
          title: `${businessData.name} - Your Health, Our Priority`,
          subtitle: "Comprehensive healthcare services with compassionate care",
        },
        services: [
          {
            title: "Primary Care",
            description: "Comprehensive medical care for all ages",
          },
          {
            title: "Specialist Services",
            description: "Expert care from certified specialists",
          },
          {
            title: "Preventive Care",
            description: "Proactive health maintenance and wellness programs",
          },
        ],
        testimonials: [
          {
            name: "Mary Thompson",
            text: "Excellent care and very professional staff.",
            rating: 5,
          },
          {
            name: "Robert Garcia",
            text: "They truly care about their patients' wellbeing.",
            rating: 5,
          },
          {
            name: "Jennifer Lee",
            text: "Best healthcare experience I've ever had.",
            rating: 5,
          },
        ],
      },
      default: {
        hero: {
          title: `Welcome to ${businessData.name}`,
          subtitle: "Professional services you can trust",
        },
        services: [
          {
            title: "Professional Consulting",
            description: "Expert advice and guidance for your business",
          },
          {
            title: "Quality Solutions",
            description: "Tailored solutions that meet your specific needs",
          },
          {
            title: "Customer Support",
            description: "Dedicated support when you need it most",
          },
        ],
        testimonials: [
          {
            name: "John Smith",
            text: "Outstanding service and professional approach.",
            rating: 5,
          },
          {
            name: "Maria Gonzalez",
            text: "Highly recommended for their expertise.",
            rating: 5,
          },
          {
            name: "Alex Johnson",
            text: "Excellent results and great communication.",
            rating: 5,
          },
        ],
      },
    };

    return contentMap[industry] || contentMap.default;
  }

  private generatePackageJson(context: any): GeneratedFile[] {
    const packageJson = {
      name: context.projectName.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0.0",
      description: context.description,
      type: "module",
      scripts: {
        dev: "vite",
        build: "tsc && vite build",
        preview: "vite preview",
        lint: "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
      },
      dependencies: {
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.20.0",
      },
      devDependencies: {
        "@types/react": "^18.2.43",
        "@types/react-dom": "^18.2.17",
        "@typescript-eslint/eslint-plugin": "^6.14.0",
        "@typescript-eslint/parser": "^6.14.0",
        "@vitejs/plugin-react": "^4.2.1",
        eslint: "^8.55.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.5",
        typescript: "^5.2.2",
        vite: "^5.0.8",
      },
    };

    return [
      {
        path: "package.json",
        content: JSON.stringify(packageJson, null, 2),
        type: "json",
      },
    ];
  }

  private generateMainFiles(context: any): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // main.tsx
    files.push({
      path: "src/main.tsx",
      content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
      type: "tsx",
    });

    // App.tsx
    files.push({
      path: "src/App.tsx",
      content: this.generateAppComponent(context),
      type: "tsx",
    });

    // index.css
    files.push({
      path: "src/index.css",
      content: this.generateGlobalStyles(),
      type: "css",
    });

    return files;
  }

  private generateAppComponent(context: any): string {
    const routes = context.pages
      .map((page: string) => {
        const componentName = this.capitalize(page);
        return `        <Route path="${page === "home" ? "/" : `/${page}`}" element={<${componentName} />} />`;
      })
      .join("\n");

    const imports = context.pages
      .map((page: string) => {
        const componentName = this.capitalize(page);
        return `import ${componentName} from './pages/${componentName}';`;
      })
      .join("\n");

    return `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
${imports}
import './App.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Navigation />
        <main>
          <Routes>
${routes}
            <Route path="*" element={
              <div className="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;`;
  }

  private generateComponents(context: any): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // Navigation Component
    files.push({
      path: "src/components/Navigation.tsx",
      content: this.generateNavigationComponent(context),
      type: "tsx",
    });

    // LoadingSpinner Component
    files.push({
      path: "src/components/LoadingSpinner.tsx",
      content: this.generateLoadingSpinnerComponent(),
      type: "tsx",
    });

    // ErrorFallback Component
    files.push({
      path: "src/components/ErrorFallback.tsx",
      content: this.generateErrorFallbackComponent(),
      type: "tsx",
    });

    // Chat Components (if chat feature is enabled)
    if (context.components.includes("LiveChat")) {
      files.push({
        path: "src/components/LiveChat.tsx",
        content: this.generateLiveChatComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("ChatMessage")) {
      files.push({
        path: "src/components/ChatMessage.tsx",
        content: this.generateChatMessageComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("ChatWidget")) {
      files.push({
        path: "src/components/ChatWidget.tsx",
        content: this.generateChatWidgetComponent(),
        type: "tsx",
      });
    }

    // Search Components
    if (context.components.includes("SearchBox")) {
      files.push({
        path: "src/components/SearchBox.tsx",
        content: this.generateSearchBoxComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("SearchResults")) {
      files.push({
        path: "src/components/SearchResults.tsx",
        content: this.generateSearchResultsComponent(),
        type: "tsx",
      });
    }

    // Payment Components
    if (context.components.includes("PaymentForm")) {
      files.push({
        path: "src/components/PaymentForm.tsx",
        content: this.generatePaymentFormComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("PaymentStatus")) {
      files.push({
        path: "src/components/PaymentStatus.tsx",
        content: this.generatePaymentStatusComponent(),
        type: "tsx",
      });
    }

    // Booking Components
    if (context.components.includes("BookingForm")) {
      files.push({
        path: "src/components/BookingForm.tsx",
        content: this.generateBookingFormComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("BookingCalendar")) {
      files.push({
        path: "src/components/BookingCalendar.tsx",
        content: this.generateBookingCalendarComponent(),
        type: "tsx",
      });
    }

    // Analytics Components
    if (context.components.includes("AnalyticsChart")) {
      files.push({
        path: "src/components/AnalyticsChart.tsx",
        content: this.generateAnalyticsChartComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("AnalyticsMetrics")) {
      files.push({
        path: "src/components/AnalyticsMetrics.tsx",
        content: this.generateAnalyticsMetricsComponent(),
        type: "tsx",
      });
    }

    // Location Components
    if (context.components.includes("LocationMap")) {
      files.push({
        path: "src/components/LocationMap.tsx",
        content: this.generateLocationMapComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("LocationPicker")) {
      files.push({
        path: "src/components/LocationPicker.tsx",
        content: this.generateLocationPickerComponent(),
        type: "tsx",
      });
    }

    // Notification Components
    if (context.components.includes("NotificationBanner")) {
      files.push({
        path: "src/components/NotificationBanner.tsx",
        content: this.generateNotificationBannerComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("NotificationList")) {
      files.push({
        path: "src/components/NotificationList.tsx",
        content: this.generateNotificationListComponent(),
        type: "tsx",
      });
    }

    // Social Components
    if (context.components.includes("SocialShare")) {
      files.push({
        path: "src/components/SocialShare.tsx",
        content: this.generateSocialShareComponent(),
        type: "tsx",
      });
    }

    if (context.components.includes("SocialLogin")) {
      files.push({
        path: "src/components/SocialLogin.tsx",
        content: this.generateSocialLoginComponent(),
        type: "tsx",
      });
    }

    // Profile Components
    if (context.components.includes("ProfileForm")) {
      files.push({
        path: "src/components/ProfileForm.tsx",
        content: this.generateProfileFormComponent(),
        type: "tsx",
      });
    }

    return files;
  }

  private generateNavigationComponent(context: any): string {
    const navLinks = context.pages
      .map((page: string) => {
        const href = page === "home" ? "/" : `/${page}`;
        const label = this.capitalize(page);
        return `          <Link to="${href}" className="nav-link">${label}</Link>`;
      })
      .join("\n");

    return `import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <h1>${context.businessName}</h1>
        </Link>
        <div className="nav-links">
${navLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;`;
  }

  private generateLoadingSpinnerComponent(): string {
    return `import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;`;
  }

  private generateErrorFallbackComponent(): string {
    return `import React from 'react';
import './ErrorFallback.css';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  return (
    <div className="error-fallback">
      <h2>Something went wrong!</h2>
      <p>{error?.message || 'An unexpected error occurred.'}</p>
      {resetError && (
        <button onClick={resetError} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;`;
  }

  private generateLiveChatComponent(): string {
    return `import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import './LiveChat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! A member of our team will get back to you shortly.',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="live-chat-container">
      <div className={\`live-chat-widget \${isOpen ? 'open' : ''}\`}>
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <h4>Live Support</h4>
              <button onClick={() => setIsOpen(false)} className="close-chat">×</button>
            </div>
            <div className="chat-messages">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className="typing-indicator">
                  <span>Agent is typing...</span>
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="chat-input"
              />
              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="chat-toggle-button"
        >
          💬
        </button>
      </div>
    </div>
  );
};

export default LiveChat;`;
  }

  private generateChatMessageComponent(): string {
    return `import React from 'react';
import './ChatMessage.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={\`chat-message \${message.sender === 'user' ? 'user' : 'agent'}\`}>
      <div className="message-content">
        <div className="message-bubble">
          <p>{message.text}</p>
        </div>
        <div className="message-time">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;`;
  }

  private generateChatWidgetComponent(): string {
    return `import React, { useState } from 'react';
import LiveChat from './LiveChat';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="chat-widget-container">
      <div className="chat-widget-header">
        <h3>Need Help?</h3>
        <p>Chat with our support team</p>
        <button
          onClick={() => setIsVisible(false)}
          className="widget-close"
        >
          ×
        </button>
      </div>
      <LiveChat />
    </div>
  );
};

export default ChatWidget;`;
  }

  private generateSearchBoxComponent(): string {
    return `import React, { useState } from 'react';
import './SearchBox.css';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBox;`;
  }

  private generateSearchResultsComponent(): string {
    return `import React from 'react';
import './SearchResults.css';

interface SearchResult {
  id: number;
  title: string;
  description: string;
  url: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query, isLoading }) => {
  if (isLoading) {
    return (
      <div className="search-results">
        <div className="search-loading">Searching...</div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="search-results">
        <div className="search-placeholder">Enter a search term to get started</div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="search-summary">
        {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
      </div>

      {results.length === 0 ? (
        <div className="no-results">
          <h3>No results found</h3>
          <p>Try adjusting your search terms or browse our services directly.</p>
        </div>
      ) : (
        <div className="results-list">
          {results.map(result => (
            <div key={result.id} className="result-item">
              <h3 className="result-title">
                <a href={result.url}>{result.title}</a>
              </h3>
              <p className="result-description">{result.description}</p>
              <a href={result.url} className="result-link">{result.url}</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;`;
  }

  private generatePaymentFormComponent(): string {
    return `import React, { useState } from 'react';
import './PaymentForm.css';

interface PaymentFormProps {
  onPayment: (paymentData: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onPayment }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    amount: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPayment(formData);
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3>Payment Information</h3>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="name">Cardholder Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
        />
      </div>

      <button type="submit" className="payment-button">
        Process Payment
      </button>
    </form>
  );
};

export default PaymentForm;`;
  }

  private generatePaymentStatusComponent(): string {
    return `import React from 'react';
import './PaymentStatus.css';

interface PaymentStatusProps {
  status: 'pending' | 'processing' | 'success' | 'failed';
  data?: any;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status, data }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return {
          icon: '⏳',
          title: 'Ready to Process',
          message: 'Complete the payment form to process your transaction'
        };
      case 'processing':
        return {
          icon: '🔄',
          title: 'Processing Payment',
          message: 'Please wait while we process your payment...'
        };
      case 'success':
        return {
          icon: '✅',
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully'
        };
      case 'failed':
        return {
          icon: '❌',
          title: 'Payment Failed',
          message: 'There was an error processing your payment'
        };
      default:
        return {
          icon: '⏳',
          title: 'Unknown Status',
          message: 'Payment status is unknown'
        };
    }
  };

  const { icon, title, message } = getStatusDisplay();

  return (
    <div className={\`payment-status status-\${status}\`}>
      <div className="status-icon">{icon}</div>
      <h3 className="status-title">{title}</h3>
      <p className="status-message">{message}</p>

      {status === 'success' && data && (
        <div className="payment-details">
          <h4>Transaction Details</h4>
          <div className="detail-item">
            <span>Amount:</span>
            <span>\${data.amount}</span>
          </div>
          <div className="detail-item">
            <span>Card:</span>
            <span>****{data.cardNumber?.slice(-4)}</span>
          </div>
          <div className="detail-item">
            <span>Email:</span>
            <span>{data.email}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;`;
  }

  private generateBookingFormComponent(): string {
    return `import React, { useState } from 'react';
import './BookingForm.css';

interface BookingFormProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSubmit: (bookingData: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, selectedTime, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Booking Details</h3>

      <div className="booking-summary">
        <div className="summary-item">
          <span>Date:</span>
          <span>{selectedDate?.toDateString()}</span>
        </div>
        <div className="summary-item">
          <span>Time:</span>
          <span>{selectedTime}</span>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="service">Service</label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          required
        >
          <option value="">Select a service</option>
          <option value="consultation">Consultation</option>
          <option value="service1">Service 1</option>
          <option value="service2">Service 2</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Additional Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          placeholder="Any special requests or information..."
        />
      </div>

      <button type="submit" className="booking-submit-button">
        Confirm Booking
      </button>
    </form>
  );
};

export default BookingForm;`;
  }

  private generateBookingCalendarComponent(): string {
    return `import React, { useState } from 'react';
import './BookingCalendar.css';

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (date >= today) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  const isDateAvailable = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date >= today && date.getDay() !== 0; // Not past and not Sunday
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={\`empty-\${i}\`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isAvailable = isDateAvailable(day);
      const isSelected = selectedDate &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={\`calendar-day \${isAvailable ? 'available' : 'unavailable'} \${isSelected ? 'selected' : ''}\`}
          onClick={() => isAvailable && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="booking-calendar">
      <div className="calendar-header">
        <button onClick={previousMonth} className="nav-button">←</button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={nextMonth} className="nav-button">→</button>
      </div>

      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {renderCalendarDays()}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color available"></span>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color unavailable"></span>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <span className="legend-color selected"></span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;`;
  }

  private generateAnalyticsChartComponent(): string {
    return `import React from 'react';
import './AnalyticsChart.css';

interface AnalyticsChartProps {
  type: 'visitors' | 'pageViews';
  timeRange: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ type, timeRange }) => {
  // Mock data generation
  const generateMockData = () => {
    const days = timeRange === '1d' ? 24 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => ({
      label: timeRange === '1d' ? \`\${i}:00\` : \`Day \${i + 1}\`,
      value: Math.floor(Math.random() * 100) + 20
    }));
  };

  const data = generateMockData();
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="analytics-chart">
      <h3 className="chart-title">
        {type === 'visitors' ? 'Visitors' : 'Page Views'} - {timeRange}
      </h3>

      <div className="chart-container">
        <div className="chart-y-axis">
          <div className="y-axis-label">{maxValue}</div>
          <div className="y-axis-label">{Math.floor(maxValue * 0.75)}</div>
          <div className="y-axis-label">{Math.floor(maxValue * 0.5)}</div>
          <div className="y-axis-label">{Math.floor(maxValue * 0.25)}</div>
          <div className="y-axis-label">0</div>
        </div>

        <div className="chart-area">
          <div className="chart-bars">
            {data.map((item, index) => (
              <div key={index} className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{
                    height: \`\${(item.value / maxValue) * 100}%\`,
                    backgroundColor: type === 'visitors' ? '#3182ce' : '#38a169'
                  }}
                  title={\`\${item.label}: \${item.value}\`}
                />
                <div className="chart-bar-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;`;
  }

  private generateAnalyticsMetricsComponent(): string {
    return `import React from 'react';
import './AnalyticsMetrics.css';

interface Metrics {
  visitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface AnalyticsMetricsProps {
  metrics: Metrics;
}

const AnalyticsMetrics: React.FC<AnalyticsMetricsProps> = ({ metrics }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return \`\${minutes}m \${remainingSeconds}s\`;
  };

  const metricsData = [
    {
      label: 'Visitors',
      value: metrics.visitors.toLocaleString(),
      icon: '👥',
      color: 'blue'
    },
    {
      label: 'Page Views',
      value: metrics.pageViews.toLocaleString(),
      icon: '👁️',
      color: 'green'
    },
    {
      label: 'Bounce Rate',
      value: \`\${metrics.bounceRate}%\`,
      icon: '📊',
      color: 'orange'
    },
    {
      label: 'Avg Session Duration',
      value: formatDuration(metrics.avgSessionDuration),
      icon: '⏱️',
      color: 'purple'
    }
  ];

  return (
    <div className="analytics-metrics">
      <div className="metrics-grid">
        {metricsData.map((metric, index) => (
          <div key={index} className={\`metric-card metric-\${metric.color}\`}>
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsMetrics;`;
  }

  private generateLocationMapComponent(): string {
    return `import React, { useEffect, useRef } from 'react';
import './LocationMap.css';

interface Location {
  id: number;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

interface LocationMapProps {
  locations: Location[];
  selectedLocation?: Location | null;
  userLocation?: { lat: number; lng: number } | null;
}

const LocationMap: React.FC<LocationMapProps> = ({ locations, selectedLocation, userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for map implementation
    // In a real app, you would integrate with Google Maps, Mapbox, etc.
    console.log('Map would be rendered here with:', { locations, selectedLocation, userLocation });
  }, [locations, selectedLocation, userLocation]);

  return (
    <div className="location-map">
      <div ref={mapRef} className="map-container">
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Map View</p>
          <p className="map-note">
            Interactive map would be displayed here
            <br />
            (Google Maps integration required)
          </p>

          <div className="map-locations">
            {locations.map(location => (
              <div
                key={location.id}
                className={\`map-marker \${selectedLocation?.id === location.id ? 'selected' : ''}\`}
              >
                📍 {location.name}
              </div>
            ))}

            {userLocation && (
              <div className="map-marker user-location">
                📍 Your Location
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationMap;`;
  }

  private generateLocationPickerComponent(): string {
    return `import React, { useState } from 'react';
import './LocationPicker.css';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsPickingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setSelectedLocation(location);
          setIsPickingLocation(false);
          onLocationSelect(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsPickingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleManualLocation = () => {
    const address = prompt('Enter your address:');
    if (address) {
      // In a real app, you would geocode the address
      const mockLocation = { lat: 40.7128, lng: -74.0060 }; // NYC coordinates
      setSelectedLocation(mockLocation);
      onLocationSelect(mockLocation);
    }
  };

  return (
    <div className="location-picker">
      <div className="picker-header">
        <h3>Choose Your Location</h3>
        <p>Help us find services near you</p>
      </div>

      <div className="picker-buttons">
        <button
          onClick={handleGetCurrentLocation}
          disabled={isPickingLocation}
          className="location-button primary"
        >
          {isPickingLocation ? '📍 Getting Location...' : '📍 Use Current Location'}
        </button>

        <button
          onClick={handleManualLocation}
          className="location-button secondary"
        >
          📝 Enter Address Manually
        </button>
      </div>

      {selectedLocation && (
        <div className="selected-location">
          <h4>Selected Location</h4>
          <p>📍 Lat: {selectedLocation.lat.toFixed(4)}, Lng: {selectedLocation.lng.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;`;
  }

  private generateNotificationBannerComponent(): string {
    return `import React, { useState, useEffect } from 'react';
import './NotificationBanner.css';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationBannerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notifications, onClose }) => {
  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.autoClose) {
        const timer = setTimeout(() => {
          onClose(notification.id);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="notification-banner">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={\`notification notification-\${notification.type}\`}
        >
          <div className="notification-content">
            <span className="notification-icon">
              {getNotificationIcon(notification.type)}
            </span>
            <span className="notification-message">
              {notification.message}
            </span>
          </div>
          <button
            onClick={() => onClose(notification.id)}
            className="notification-close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;`;
  }

  private generateNotificationListComponent(): string {
    return `import React from 'react';
import './NotificationList.css';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return \`\${days}d ago\`;
    if (hours > 0) return \`\${hours}h ago\`;
    if (minutes > 0) return \`\${minutes}m ago\`;
    return 'Just now';
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="notification-list">
      <div className="notification-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <div className="notification-actions">
            <span className="unread-count">{unreadCount} unread</span>
            <button onClick={onMarkAllAsRead} className="mark-all-read">
              Mark all as read
            </button>
          </div>
        )}
      </div>

      <div className="notifications-container">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">🔔</div>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={\`notification-item \${!notification.read ? 'unread' : ''}\`}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-timestamp">
                  {formatTimestamp(notification.timestamp)}
                </div>
              </div>
              {!notification.read && (
                <div className="notification-unread-dot"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;`;
  }

  private generateSocialShareComponent(): string {
    return `import React from 'react';
import './SocialShare.css';

interface SocialShareProps {
  url?: string;
  title?: string;
  description?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url = window.location.href,
  title = document.title,
  description = ''
}) => {
  const shareOnFacebook = () => {
    const shareUrl = \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const shareUrl = \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(title)}\`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const shareOnWhatsApp = () => {
    const shareUrl = \`https://wa.me/?text=\${encodeURIComponent(title + ' ' + url)}\`;
    window.open(shareUrl, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="social-share">
      <h3>Share this page</h3>
      <div className="share-buttons">
        <button onClick={shareOnFacebook} className="share-button facebook">
          📘 Facebook
        </button>
        <button onClick={shareOnTwitter} className="share-button twitter">
          🐦 Twitter
        </button>
        <button onClick={shareOnLinkedIn} className="share-button linkedin">
          💼 LinkedIn
        </button>
        <button onClick={shareOnWhatsApp} className="share-button whatsapp">
          💬 WhatsApp
        </button>
        <button onClick={copyToClipboard} className="share-button copy">
          📋 Copy Link
        </button>
      </div>
    </div>
  );
};

export default SocialShare;`;
  }

  private generateSocialLoginComponent(): string {
    return `import React from 'react';
import './SocialLogin.css';

interface SocialLoginProps {
  onSocialLogin: (provider: string) => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ onSocialLogin }) => {
  const handleGoogleLogin = () => {
    onSocialLogin('google');
  };

  const handleFacebookLogin = () => {
    onSocialLogin('facebook');
  };

  const handleTwitterLogin = () => {
    onSocialLogin('twitter');
  };

  const handleGitHubLogin = () => {
    onSocialLogin('github');
  };

  return (
    <div className="social-login">
      <div className="social-login-header">
        <h3>Quick Sign In</h3>
        <p>Use your social account to sign in quickly</p>
      </div>

      <div className="social-login-buttons">
        <button
          onClick={handleGoogleLogin}
          className="social-login-button google"
        >
          <span className="social-icon">🔍</span>
          Continue with Google
        </button>

        <button
          onClick={handleFacebookLogin}
          className="social-login-button facebook"
        >
          <span className="social-icon">📘</span>
          Continue with Facebook
        </button>

        <button
          onClick={handleTwitterLogin}
          className="social-login-button twitter"
        >
          <span className="social-icon">🐦</span>
          Continue with Twitter
        </button>

        <button
          onClick={handleGitHubLogin}
          className="social-login-button github"
        >
          <span className="social-icon">🐙</span>
          Continue with GitHub
        </button>
      </div>

      <div className="social-login-divider">
        <span>or</span>
      </div>

      <div className="social-login-footer">
        <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  );
};

export default SocialLogin;`;
  }

  private generateProfileFormComponent(): string {
    return `import React, { useState } from 'react';
import './ProfileForm.css';

interface ProfileFormProps {
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    bio?: string;
    website?: string;
  };
  onSave: (profileData: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData = {}, onSave }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    bio: initialData.bio || '',
    website: initialData.website || '',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('notifications.')) {
        const notificationKey = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [notificationKey]: checkbox.checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      // Success handled by parent component
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Personal Information</h3>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company/Organization</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Notification Preferences</h3>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleChange}
            />
            <span>Email notifications</span>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.sms"
              checked={formData.notifications.sms}
              onChange={handleChange}
            />
            <span>SMS notifications</span>
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="notifications.push"
              checked={formData.notifications.push}
              onChange={handleChange}
            />
            <span>Push notifications</span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="save-button"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;`;
  }

  private generatePages(context: any): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    context.pages.forEach((page: string) => {
      const componentName = this.capitalize(page);
      let content = "";

      switch (page) {
        case "home":
          content = this.generateHomePage(context);
          break;
        case "about":
          content = this.generateAboutPage(context);
          break;
        case "services":
          content = this.generateServicesPage(context);
          break;
        case "contact":
          content = this.generateContactPage(context);
          break;
        case "gallery":
          content = this.generateGalleryPage(context);
          break;
        case "testimonials":
          content = this.generateTestimonialsPage(context);
          break;
        case "login":
          content = this.generateLoginPage(context);
          break;
        case "register":
          content = this.generateRegisterPage(context);
          break;
        case "profile":
          content = this.generateProfilePage(context);
          break;
        case "reviews":
          content = this.generateReviewsPage(context);
          break;
        case "chat":
          content = this.generateChatPage(context);
          break;
        case "search":
          content = this.generateSearchPage(context);
          break;
        case "payments":
          content = this.generatePaymentsPage(context);
          break;
        case "booking":
          content = this.generateBookingPage(context);
          break;
        case "analytics":
          content = this.generateAnalyticsPage(context);
          break;
        case "locations":
          content = this.generateLocationsPage(context);
          break;
        default:
          content = this.generateGenericPage(componentName);
      }

      files.push({
        path: `src/pages/${componentName}.tsx`,
        content,
        type: "tsx",
      });
    });

    return files;
  }

  private generateHomePage(context: any): string {
    const hero = context.aiContent.hero;
    const services = context.aiContent.services;

    return `import React from 'react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">${hero.title}</h1>
          <p className="hero-subtitle">${hero.subtitle}</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="services-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            ${services
              .map(
                (service: any) => `
            <div className="service-card">
              <h3>${service.title}</h3>
              <p>${service.description}</p>
            </div>`,
              )
              .join("")}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;`;
  }

  private generateAboutPage(context: any): string {
    return `import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>About ${context.businessName}</h1>
          <p className="about-subtitle">Learn more about our story and mission</p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h2>Our Story</h2>
            <p>
              ${context.businessName} was founded with a simple mission: to provide exceptional
              services that exceed our clients' expectations. With years of experience in the
              ${context.industry} industry, we've built a reputation for quality, reliability,
              and innovation.
            </p>

            <h2>Our Mission</h2>
            <p>
              We are committed to delivering outstanding results while maintaining the highest
              standards of professionalism and customer service. Our team of experts works
              tirelessly to ensure your success.
            </p>

            <h2>Why Choose Us</h2>
            <ul>
              <li>Experienced professionals</li>
              <li>Proven track record</li>
              <li>Customer-focused approach</li>
              <li>Innovative solutions</li>
              <li>Competitive pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;`;
  }

  private generateServicesPage(context: any): string {
    const services = context.aiContent.services;

    return `import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  return (
    <div className="services-page">
      <div className="container">
        <div className="services-header">
          <h1>Our Services</h1>
          <p className="services-subtitle">Comprehensive solutions tailored to your needs</p>
        </div>

        <div className="services-grid">
          ${services
            .map(
              (service: any, index: number) => `
          <div className="service-card" key={${index}}>
            <div className="service-icon">
              <span className="icon">🔧</span>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <button className="btn btn-outline">Learn More</button>
          </div>`,
            )
            .join("")}
        </div>
      </div>
    </div>
  );
};

export default Services;`;
  }

  private generateContactPage(context: any): string {
    return `import React, { useState } from 'react';
import './Contact.css';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="container">
          <div className="success-message">
            <h2>Thank you for your message!</h2>
            <p>We'll get back to you soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p className="contact-subtitle">Get in touch with our team</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Phone:</strong> ${context.businessData.contactPhone || "(555) 123-4567"}
              </div>
              <div className="contact-item">
                <strong>Email:</strong> ${context.businessData.contactEmail || "info@example.com"}
              </div>
              <div className="contact-item">
                <strong>Address:</strong> ${context.businessData.location || "Your City, State"}
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;`;
  }

  private generateGalleryPage(_context: any): string {
    return `import React, { useState } from 'react';
import './Gallery.css';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
}

const sampleImages: GalleryItem[] = [
  { id: 1, src: '/images/gallery/image1.jpg', alt: 'Gallery Image 1', title: 'Project 1', category: 'work' },
  { id: 2, src: '/images/gallery/image2.jpg', alt: 'Gallery Image 2', title: 'Project 2', category: 'work' },
  { id: 3, src: '/images/gallery/image3.jpg', alt: 'Gallery Image 3', title: 'Team Photo', category: 'team' },
  { id: 4, src: '/images/gallery/image4.jpg', alt: 'Gallery Image 4', title: 'Office Space', category: 'office' },
  { id: 5, src: '/images/gallery/image5.jpg', alt: 'Gallery Image 5', title: 'Event 1', category: 'events' },
  { id: 6, src: '/images/gallery/image6.jpg', alt: 'Gallery Image 6', title: 'Event 2', category: 'events' },
];

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'work', 'team', 'office', 'events'];
  const filteredImages = filter === 'all' ? sampleImages : sampleImages.filter(img => img.category === filter);

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="gallery-header">
          <h1>Gallery</h1>
          <p className="gallery-subtitle">Explore our work and achievements</p>
        </div>

        <div className="gallery-filters">
          {categories.map(category => (
            <button
              key={category}
              className={\`filter-btn \${filter === category ? 'active' : ''}\`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {filteredImages.map(image => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.src} alt={image.alt} />
              <div className="gallery-overlay">
                <h3>{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
            <div className="modal-content">
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <h3>{selectedImage.title}</h3>
              <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;`;
  }

  private generateTestimonialsPage(context: any): string {
    const testimonials = context.aiContent.testimonials;

    return `import React from 'react';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const testimonials = ${JSON.stringify(testimonials, null, 2)};

  return (
    <div className="testimonials-page">
      <div className="container">
        <div className="testimonials-header">
          <h1>What Our Clients Say</h1>
          <p className="testimonials-subtitle">Real feedback from satisfied customers</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;`;
  }

  private generateLoginPage(_context: any): string {
    return `import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    alert('Login successful!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-form-container">
          <h1>Sign In</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <a href="/register">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;`;
  }

  private generateRegisterPage(_context: any): string {
    return `import React, { useState } from 'react';
import './Register.css';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate registration
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    alert('Registration successful!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-form-container">
          <h1>Create Account</h1>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="register-footer">
            Already have an account? <a href="/login">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;`;
  }

  private generateProfilePage(_context: any): string {
    return `import React, { useState } from 'react';
import './Profile.css';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    bio: 'Software developer with a passion for creating amazing user experiences.'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate profile update
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button
            className="btn btn-outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span>{profile.name.charAt(0)}</span>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={profile.bio}
                onChange={handleChange}
                disabled={!isEditing}
              ></textarea>
            </div>

            {isEditing && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;`;
  }

  private generateReviewsPage(_context: any): string {
    return `import React, { useState } from 'react';
import './Reviews.css';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const Reviews: React.FC = () => {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      name: "John Smith",
      rating: 5,
      comment: "Excellent service! Highly recommend to anyone looking for quality work.",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Professional, reliable, and delivered exactly what was promised.",
      date: "2024-01-10"
    },
    {
      id: 3,
      name: "Mike Davis",
      rating: 4,
      comment: "Great experience overall. Would definitely use their services again.",
      date: "2024-01-05"
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission
    alert('Thank you for your review!');
    setNewReview({ name: '', rating: 5, comment: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  return (
    <div className="reviews-page">
      <div className="container">
        <div className="reviews-header">
          <h1>Customer Reviews</h1>
          <p className="reviews-subtitle">See what our customers have to say</p>
        </div>

        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <h3>{review.name}</h3>
                <div className="review-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={\`star \${i < review.rating ? 'filled' : ''}\`}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
              <p className="review-comment">{review.comment}</p>
              <p className="review-date">{new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        <div className="add-review-section">
          <h2>Leave a Review</h2>
          <form className="review-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                name="rating"
                value={newReview.rating}
                onChange={handleChange}
                required
              >
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                name="comment"
                rows={4}
                value={newReview.comment}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reviews;`;
  }

  private generateChatPage(context: any): string {
    return `import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to ${context.businessName}. How can I help you today?',
      sender: 'agent',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agentResponses = [
        "Thank you for your message! I'll help you with that.",
        "That's a great question. Let me provide you with some information.",
        "I understand your concern. Here's what I can do to help.",
        "I'm here to assist you. Could you provide more details?",
        "Thanks for reaching out! I'll get back to you shortly with a solution."
      ];

      const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-content">
            <div className="agent-avatar">
              <span>🎧</span>
            </div>
            <div className="agent-info">
              <h3>Live Support</h3>
              <p className="agent-status">Online - We're here to help!</p>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={\`message \${message.sender === 'user' ? 'user-message' : 'agent-message'}\`}
            >
              <div className="message-content">
                <div className="message-bubble">
                  <p>{message.text}</p>
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message agent-message">
              <div className="message-content">
                <div className="message-bubble typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="chat-input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="send-button" disabled={!inputMessage.trim()}>
              <span>Send</span>
            </button>
          </div>
        </form>
      </div>

      <div className="chat-info">
        <div className="container">
          <h2>Need Help?</h2>
          <div className="help-options">
            <div className="help-option">
              <div className="help-icon">📞</div>
              <h3>Call Us</h3>
              <p>Speak directly with our support team</p>
              <a href="tel:+1234567890" className="help-link">+1 (234) 567-890</a>
            </div>
            <div className="help-option">
              <div className="help-icon">📧</div>
              <h3>Email Support</h3>
              <p>Send us a detailed message</p>
              <a href="mailto:support@${context.businessName.toLowerCase().replace(/\s+/g, "")}.com" className="help-link">Get in touch</a>
            </div>
            <div className="help-option">
              <div className="help-icon">❓</div>
              <h3>FAQ</h3>
              <p>Find answers to common questions</p>
              <a href="/faq" className="help-link">View FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;`;
  }

  private generateSearchPage(context: any): string {
    return `import React, { useState } from 'react';
import SearchBox from '../components/SearchBox';
import SearchResults from '../components/SearchResults';
import './Search.css';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);

    // Simulate search API call
    setTimeout(() => {
      const mockResults = [
        { id: 1, title: 'Service 1', description: 'Description for service 1', url: '/services/1' },
        { id: 2, title: 'Service 2', description: 'Description for service 2', url: '/services/2' },
        { id: 3, title: 'About Us', description: 'Learn more about ${context.businessName}', url: '/about' },
      ].filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

      setResults(mockResults);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-header">
          <h1>Search ${context.businessName}</h1>
          <p>Find what you're looking for</p>
        </div>

        <SearchBox onSearch={handleSearch} />

        <SearchResults
          results={results}
          query={searchQuery}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Search;`;
  }

  private generatePaymentsPage(context: any): string {
    return `import React, { useState } from 'react';
import PaymentForm from '../components/PaymentForm';
import PaymentStatus from '../components/PaymentStatus';
import './Payments.css';

const Payments: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentData, setPaymentData] = useState(null);

  const handlePayment = async (paymentInfo: any) => {
    setPaymentStatus('processing');

    // Simulate payment processing
    setTimeout(() => {
      setPaymentData(paymentInfo);
      setPaymentStatus('success');
    }, 2000);
  };

  return (
    <div className="payments-page">
      <div className="container">
        <div className="payments-header">
          <h1>Secure Payments</h1>
          <p>Process your payments safely with ${context.businessName}</p>
        </div>

        <div className="payments-content">
          <PaymentForm onPayment={handlePayment} />
          <PaymentStatus status={paymentStatus} data={paymentData} />
        </div>

        <div className="payment-security">
          <h2>Your Security is Our Priority</h2>
          <div className="security-features">
            <div className="security-feature">
              <div className="security-icon">🔒</div>
              <h3>SSL Encryption</h3>
              <p>All transactions are encrypted with 256-bit SSL</p>
            </div>
            <div className="security-feature">
              <div className="security-icon">🛡️</div>
              <h3>PCI Compliant</h3>
              <p>We meet the highest security standards</p>
            </div>
            <div className="security-feature">
              <div className="security-icon">💳</div>
              <h3>Multiple Payment Methods</h3>
              <p>Accept cards, digital wallets, and bank transfers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;`;
  }

  private generateBookingPage(context: any): string {
    return `import React, { useState } from 'react';
import BookingForm from '../components/BookingForm';
import BookingCalendar from '../components/BookingCalendar';
import './Booking.css';

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setBookingStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setBookingStep(3);
  };

  const handleBookingSubmit = async (bookingData: any) => {
    // Simulate booking submission
    console.log('Booking submitted:', { ...bookingData, date: selectedDate, time: selectedTime });
    setBookingStep(4);
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="booking-header">
          <h1>Book an Appointment</h1>
          <p>Schedule your appointment with ${context.businessName}</p>
        </div>

        <div className="booking-progress">
          <div className="progress-steps">
            <div className={\`step \${bookingStep >= 1 ? 'active' : ''}\`}>1. Select Date</div>
            <div className={\`step \${bookingStep >= 2 ? 'active' : ''}\`}>2. Choose Time</div>
            <div className={\`step \${bookingStep >= 3 ? 'active' : ''}\`}>3. Your Details</div>
            <div className={\`step \${bookingStep >= 4 ? 'active' : ''}\`}>4. Confirmation</div>
          </div>
        </div>

        <div className="booking-content">
          {bookingStep === 1 && (
            <BookingCalendar onDateSelect={handleDateSelect} />
          )}

          {bookingStep === 2 && (
            <div className="time-selection">
              <h2>Available Times for {selectedDate?.toDateString()}</h2>
              <div className="time-slots">
                {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                  <button
                    key={time}
                    className="time-slot"
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bookingStep === 3 && (
            <BookingForm
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSubmit={handleBookingSubmit}
            />
          )}

          {bookingStep === 4 && (
            <div className="booking-confirmation">
              <h2>Booking Confirmed!</h2>
              <p>Your appointment has been scheduled for {selectedDate?.toDateString()} at {selectedTime}</p>
              <p>We'll send you a confirmation email shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;`;
  }

  private generateAnalyticsPage(context: any): string {
    return `import React, { useState, useEffect } from 'react';
import AnalyticsChart from '../components/AnalyticsChart';
import AnalyticsMetrics from '../components/AnalyticsMetrics';
import './Analytics.css';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState({
    visitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0
  });

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = () => {
      // Mock data - in real implementation, fetch from analytics API
      setMetrics({
        visitors: Math.floor(Math.random() * 1000) + 500,
        pageViews: Math.floor(Math.random() * 5000) + 2000,
        bounceRate: Math.floor(Math.random() * 30) + 20,
        avgSessionDuration: Math.floor(Math.random() * 300) + 120
      });
    };

    loadAnalytics();
  }, [timeRange]);

  return (
    <div className="analytics-page">
      <div className="container">
        <div className="analytics-header">
          <h1>${context.businessName} Analytics</h1>
          <p>Track your business performance and user engagement</p>

          <div className="time-range-selector">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        <AnalyticsMetrics metrics={metrics} />

        <div className="analytics-charts">
          <AnalyticsChart type="visitors" timeRange={timeRange} />
          <AnalyticsChart type="pageViews" timeRange={timeRange} />
        </div>

        <div className="analytics-insights">
          <h2>Key Insights</h2>
          <div className="insights-grid">
            <div className="insight">
              <h3>Top Performing Pages</h3>
              <ul>
                <li>Home Page - 45% of traffic</li>
                <li>Services - 28% of traffic</li>
                <li>About - 15% of traffic</li>
                <li>Contact - 12% of traffic</li>
              </ul>
            </div>
            <div className="insight">
              <h3>User Behavior</h3>
              <p>Most users visit during business hours (9 AM - 5 PM)</p>
              <p>Mobile users account for 65% of traffic</p>
              <p>Average session duration is {Math.floor(metrics.avgSessionDuration / 60)} minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;`;
  }

  private generateLocationsPage(context: any): string {
    return `import React, { useState } from 'react';
import LocationMap from '../components/LocationMap';
import LocationPicker from '../components/LocationPicker';
import './Locations.css';

const Locations: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const businessLocations = [
    {
      id: 1,
      name: 'Main Office',
      address: '123 Business St, City, State 12345',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: 'Branch Office',
      address: '456 Commerce Ave, City, State 12346',
      phone: '+1 (555) 987-6543',
      hours: 'Mon-Fri: 8AM-5PM',
      coordinates: { lat: 40.7589, lng: -73.9851 }
    }
  ];

  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="locations-page">
      <div className="container">
        <div className="locations-header">
          <h1>Our Locations</h1>
          <p>Find ${context.businessName} near you</p>

          <button onClick={getUserLocation} className="location-button">
            📍 Use My Location
          </button>
        </div>

        <div className="locations-content">
          <div className="locations-list">
            <h2>All Locations</h2>
            {businessLocations.map(location => (
              <div
                key={location.id}
                className={\`location-item \${selectedLocation?.id === location.id ? 'selected' : ''}\`}
                onClick={() => handleLocationSelect(location)}
              >
                <h3>{location.name}</h3>
                <p className="address">{location.address}</p>
                <p className="phone">📞 {location.phone}</p>
                <p className="hours">🕒 {location.hours}</p>
                <button className="directions-button">
                  Get Directions
                </button>
              </div>
            ))}
          </div>

          <div className="locations-map">
            <LocationMap
              locations={businessLocations}
              selectedLocation={selectedLocation}
              userLocation={userLocation}
            />
          </div>
        </div>

        <div className="location-services">
          <h2>Services Available</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>In-Person Consultations</h3>
              <p>Schedule face-to-face meetings at any of our locations</p>
            </div>
            <div className="service-item">
              <h3>Local Pickup</h3>
              <p>Pick up your orders from our convenient locations</p>
            </div>
            <div className="service-item">
              <h3>On-Site Services</h3>
              <p>We can come to you! Available within 25 miles of our locations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;`;
  }

  private generateGenericPage(componentName: string): string {
    return `import React from 'react';
import './${componentName}.css';

const ${componentName}: React.FC = () => {
  return (
    <div className="${componentName.toLowerCase()}-page">
      <div className="container">
        <div className="page-header">
          <h1>${componentName}</h1>
          <p className="page-subtitle">Welcome to our ${componentName.toLowerCase()} page</p>
        </div>

        <div className="page-content">
          <p>This is the ${componentName.toLowerCase()} page content.</p>
        </div>
      </div>
    </div>
  );
};

export default ${componentName};`;
  }

  private generateStyles(context: any): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // App.css
    files.push({
      path: "src/App.css",
      content: `/* Professional App Component Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Success Colors */
  --success-50: #ecfdf5;
  --success-500: #10b981;
  --success-600: #059669;

  /* Error Colors */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;

  /* Warning Colors */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;

  /* Container Widths */
  --container-sm: 640px;
  --container-md: 1200px;
  --container-lg: 1440px;
  --container-content: 600px;
  --container-hero: 900px;

  /* Blur Effects */
  --blur-sm: 10px;
  --blur-md: 20px;

  /* Z-Index */
  --z-dropdown: 100;
  --z-sticky: 1000;
  --z-overlay: 2000;

  /* Breakpoints */
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--gray-900);
  background-color: var(--gray-50);
  font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
}

main {
  flex: 1;
}

.container {
  max-width: var(--container-md);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.btn:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-100);
}

.container-sm {
  max-width: var(--container-sm);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.container-lg {
  max-width: var(--container-lg);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* Professional Button System */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  font-family: inherit;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  min-height: 2.5rem;
  line-height: 1;
}



.btn-primary {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-600);
  color: var(--primary-600);
}

.btn-outline:hover {
  background: var(--primary-600);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1rem;
  min-height: 3rem;
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.75rem;
  min-height: 2rem;
}

/* Professional Typography */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-5xl { font-size: 3rem; line-height: 1; }
.text-6xl { font-size: 3.75rem; line-height: 1; }

.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }

.text-gray-400 { color: var(--gray-400); }
.text-gray-500 { color: var(--gray-500); }
.text-gray-600 { color: var(--gray-600); }
.text-gray-700 { color: var(--gray-700); }
.text-gray-800 { color: var(--gray-800); }
.text-gray-900 { color: var(--gray-900); }

.text-primary-600 { color: var(--primary-600); }
.text-primary-700 { color: var(--primary-700); }

/* Professional Cards */
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.card-body {
  padding: var(--spacing-lg);
}

.card-footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

/* Professional Status Messages */
.not-found {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin: var(--spacing-2xl) auto;
  max-width: var(--container-content);
}

.not-found h1 {
  font-size: 4rem;
  color: var(--gray-400);
  margin-bottom: var(--spacing-lg);
  font-weight: 800;
}

.not-found p {
  color: var(--gray-600);
  font-size: 1.125rem;
  margin-bottom: var(--spacing-lg);
}

/* Professional Loading States */
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  color: var(--gray-500);
  font-weight: 500;
}

/* Professional Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(var(--spacing-sm)); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(calc(-1 * var(--spacing-lg))); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fadeIn { animation: fadeIn 0.3s ease-out; }
.animate-slideIn { animation: slideIn 0.3s ease-out; }

/* Professional Spacing */
.space-y-1 > * + * { margin-top: var(--spacing-xs); }
.space-y-2 > * + * { margin-top: var(--spacing-sm); }
.space-y-4 > * + * { margin-top: var(--spacing-md); }
.space-y-6 > * + * { margin-top: var(--spacing-lg); }
.space-y-8 > * + * { margin-top: var(--spacing-xl); }

/* Professional Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-md);
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .text-4xl { font-size: 1.875rem; line-height: 2.25rem; }
  .text-5xl { font-size: 2.25rem; line-height: 2.5rem; }
  .text-6xl { font-size: 2.5rem; line-height: 2.75rem; }
}`,
      type: "css",
    });

    // Navigation.css
    files.push({
      path: "src/components/Navigation.css",
      content: `.navigation {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  transition: all 0.3s ease;
}

.nav-container {
  max-width: var(--container-md);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.navigation:focus-within {
  box-shadow: inset 0 0 0 2px var(--primary-600);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-brand-icon {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-link {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-600);
  background: var(--primary-50);
  transform: translateY(-1px);
}

.nav-link:focus {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.nav-link:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.nav-link.active {
  color: var(--primary-600);
  background: var(--primary-50);
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--primary-600);
  border-radius: 50%;
}

.nav-mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--gray-700);
  font-size: 1.25rem;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.nav-mobile-toggle:hover {
  background: var(--gray-100);
}

.nav-mobile-toggle:focus {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.nav-mobile-toggle:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.nav-mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--gray-200);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md);
  animation: slideDown 0.3s ease;
}

.nav-mobile-menu.open {
  display: block;
}

.nav-mobile-menu .nav-link {
  display: block;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--gray-100);
}

.nav-mobile-menu .nav-link:last-child {
  border-bottom: none;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 var(--spacing-md);
  }

  .nav-links {
    display: none;
  }

  .nav-mobile-toggle {
    display: block;
  }

  .nav-brand h1 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .nav-brand h1 {
    font-size: 1.125rem;
  }

  .nav-brand-icon {
    width: 1.75rem;
    height: 1.75rem;
  }
}`,
      type: "css",
    });

    // Generate CSS files only for pages that are actually being generated
    const pageToSelectorMap: Record<string, string> = {
      home: "home-page",
      about: "about-page",
      services: "services-page",
      contact: "contact-page",
      gallery: "gallery-page",
      testimonials: "testimonials-page",
      login: "login-page",
      register: "register-page",
      profile: "profile-page",
      reviews: "reviews-page",
      chat: "chat-page",
      booking: "booking-page",
      search: "search-page",
      payments: "payments-page",
      analytics: "analytics-page",
      locations: "locations-page",
    };

    // Only generate CSS for pages that are actually being created
    context.pages.forEach((pageName: string) => {
      const selector = pageToSelectorMap[pageName];
      if (selector) {
        const componentName = this.capitalize(pageName);
        files.push({
          path: `src/pages/${componentName}.css`,
          content: this.generatePageStyles(selector),
          type: "css",
        });
      }
    });

    // Component styles
    files.push({
      path: "src/components/LoadingSpinner.css",
      content: `.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
      type: "css",
    });

    files.push({
      path: "src/components/ErrorFallback.css",
      content: `.error-fallback {
  text-align: center;
  padding: 2rem;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  background-color: #fef5e7;
  color: #c53030;
  margin: 2rem;
}

.error-fallback h2 {
  margin-bottom: 1rem;
  color: #c53030;
}

.error-fallback button {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}`,
      type: "css",
    });

    // Generate CSS files for components that are actually being created
    context.components.forEach((componentName: string) => {
      const componentCss = this.generateComponentStyles(componentName);
      if (componentCss) {
        files.push({
          path: `src/components/${componentName}.css`,
          content: componentCss,
          type: "css",
        });
      }
    });

    return files;
  }

  private generatePageStyles(selector: string): string {
    if (selector === "home-page") {
      return `.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 50%, var(--primary-900) 100%);
  color: white;
  padding: 8rem 0 6rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') bottom center / cover no-repeat;
  pointer-events: none;
}

.hero-content {
  max-width: var(--container-hero);
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(var(--blur-sm));
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-xl);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: var(--spacing-xl);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.375rem;
  margin-bottom: var(--spacing-2xl);
  opacity: 0.9;
  line-height: 1.6;
  font-weight: 400;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--spacing-2xl);
}

.hero-cta {
  background: white;
  color: var(--primary-600);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-xl);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: var(--gray-50);
}

.hero-cta-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-xl);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(var(--blur-sm));
}

.hero-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2xl);
  margin-top: var(--spacing-2xl);
}

.hero-stat {
  text-align: center;
}

.hero-stat-number {
  font-size: 2rem;
  font-weight: 700;
  display: block;
  margin-bottom: var(--spacing-xs);
}

.hero-stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.features-section {
  padding: var(--spacing-3xl) 0;
  background: white;
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--gray-900);
  letter-spacing: -0.02em;
}

.features-section .subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: var(--gray-600);
  margin-bottom: var(--spacing-3xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);
}

.feature-card {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-200);
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: 1.5rem;
  color: white;
  box-shadow: var(--shadow-sm);
}

.feature-card h3 {
  color: var(--gray-900);
  margin-bottom: var(--spacing-md);
  font-size: 1.25rem;
  font-weight: 600;
}

.feature-card p {
  color: var(--gray-600);
  line-height: 1.6;
  font-size: 0.9rem;
}

.services-section {
  padding: var(--spacing-3xl) 0;
  background: var(--gray-50);
}

.services-section h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--gray-900);
  letter-spacing: -0.02em;
}

.services-section .subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: var(--gray-600);
  margin-bottom: var(--spacing-3xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.service-card {
  background: white;
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.service-card:hover::before {
  transform: scaleX(1);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-200);
}

.service-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  font-size: 1.75rem;
  color: white;
  box-shadow: var(--shadow-sm);
}

.service-card h3 {
  color: var(--gray-900);
  margin-bottom: var(--spacing-md);
  font-size: 1.375rem;
  font-weight: 600;
}

.service-card p {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.service-features {
  list-style: none;
  padding: 0;
  margin-bottom: var(--spacing-lg);
}

.service-features li {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  color: var(--gray-600);
  font-size: 0.9rem;
}

.service-features li::before {
  content: '✓';
  color: var(--success-500);
  font-weight: 600;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0 3rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .hero-cta,
  .hero-cta-secondary {
    width: 100%;
    max-width: 280px;
  }

  .hero-stats {
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .features-grid,
  .services-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .features-section h2,
  .services-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .feature-card,
  .service-card {
    padding: var(--spacing-lg);
  }

  .container {
    padding: 0 var(--spacing-md);
  }
}`;
    }

    if (selector === "booking-page") {
      return `.booking-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.booking-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.booking-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.booking-form-section {
  padding: 100px 0;
  background: #f8f9fa;
}

.booking-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.services-panel {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.service-item {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.service-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.booking-form-panel {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

@media (max-width: 768px) {
  .booking-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .booking-hero h1 {
    font-size: 2rem;
  }
}`;
    }

    if (selector === "chat-page") {
      return `.chat-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  height: 80vh;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.agent-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.agent-info h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.agent-status {
  margin: 0;
  color: #48bb78;
  font-size: 0.9rem;
  font-weight: 500;
}

.chat-messages {
  flex: 1;
  background: white;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  margin-bottom: 1rem;
}

.message.user-message {
  justify-content: flex-end;
}

.message.agent-message {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 1rem 1.25rem;
  border-radius: 20px;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-message .message-bubble {
  background: #3182ce;
  color: white;
  border-bottom-right-radius: 8px;
}

.agent-message .message-bubble {
  background: #f7fafc;
  color: #2d3748;
  border-bottom-left-radius: 8px;
}

.message-bubble p {
  margin: 0;
  line-height: 1.5;
}

.message-time {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.5rem;
  text-align: center;
}

.user-message .message-time {
  text-align: right;
}

.agent-message .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 20px;
  border-bottom-left-radius: 8px;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: #cbd5e0;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.chat-input-form {
  background: white;
  padding: 1.5rem;
  border-radius: 0 0 12px 12px;
  border-top: 1px solid #e2e8f0;
}

.chat-input-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.chat-input:focus {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.chat-input:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.send-button {
  padding: 1rem 2rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.send-button:hover {
  background: #2c5aa0;
  transform: translateY(-2px);
}

.send-button:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
  transform: none;
}

.send-button:focus {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.send-button:focus-visible {
  outline: 2px solid var(--primary-600);
  outline-offset: 2px;
}

.chat-info {
  padding: 4rem 0;
  background: white;
  margin-top: 2rem;
}

.chat-info h2 {
  text-align: center;
  color: #2d3748;
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.help-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.help-option {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s ease;
}

.help-option:hover {
  transform: translateY(-5px);
}

.help-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.help-option h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.help-option p {
  color: #718096;
  margin-bottom: 1.5rem;
}

.help-link {
  color: #3182ce;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid #3182ce;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.help-link:hover {
  background: #3182ce;
  color: white;
}

@media (max-width: 768px) {
  .chat-container {
    height: 90vh;
    padding: 1rem;
  }

  .message-content {
    max-width: 85%;
  }

  .help-options {
    grid-template-columns: 1fr;
  }

  .chat-input-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .send-button {
    width: 100%;
  }
}`;
    }

    if (selector === "profile-page") {
      return `.profile-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.profile-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin: 0;
}

.profile-content {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 3rem;
  align-items: start;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.profile-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-form .form-group {
  margin-bottom: 1.5rem;
}

.profile-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
}

.profile-form input,
.profile-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.profile-form input:focus,
.profile-form textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.profile-form input:disabled,
.profile-form textarea:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .profile-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .avatar-circle {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
}`;
    }

    if (selector === "gallery-page") {
      return `.gallery-page {
  min-height: 100vh;
}

.gallery-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.gallery-item {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}`;
    }

    if (selector === "reviews-page") {
      return `.reviews-page {
  min-height: 100vh;
}

.reviews-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.review-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
}

.star {
  color: #ffd700;
  font-size: 1.2rem;
}`;
    }

    if (selector === "testimonials-page") {
      return `.testimonials-page {
  min-height: 100vh;
}

.testimonials-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.testimonial-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}`;
    }

    if (selector === "login-page") {
      return `.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}`;
    }

    if (selector === "register-page") {
      return `.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}`;
    }

    if (selector === "about-page") {
      return `.about-page {
  min-height: 100vh;
}

.about-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.story-section {
  padding: 100px 0;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #667eea;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.team-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}`;
    }

    if (selector === "services-page") {
      return `.services-page {
  min-height: 100vh;
}

.services-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}`;
    }

    if (selector === "contact-page") {
      return `.contact-page {
  min-height: 100vh;
}

.contact-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  padding: 2rem 0;
}

.contact-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.contact-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}`;
    }

    return `.${selector} {
  min-height: 100vh;
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #718096;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.grid {
  display: grid;
  gap: 2rem;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .${selector} {
    padding: 1rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}`;
  }

  private generateConfigFiles(_context: any): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // tsconfig.json
    files.push({
      path: "tsconfig.json",
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
      type: "json",
    });

    // tsconfig.node.json
    files.push({
      path: "tsconfig.node.json",
      content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`,
      type: "json",
    });

    // vite.config.ts
    files.push({
      path: "vite.config.ts",
      content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})`,
      type: "ts",
    });

    return files;
  }

  private generatePublicFiles(context: any): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // index.html
    files.push({
      path: "index.html",
      content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${context.description}" />
    <title>${context.businessName}</title>

    <!-- PWA Meta Tags -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#3182ce" />
    <link rel="apple-touch-icon" href="/icon-192x192.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="${context.businessName}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>

    <!-- Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }
    </script>
  </body>
</html>`,
      type: "html",
    });

    // manifest.json
    files.push({
      path: "public/manifest.json",
      content: `{
  "name": "${context.businessName}",
  "short_name": "${context.businessName}",
  "description": "${context.description}",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3182ce",
  "background_color": "#ffffff"
}`,
      type: "json",
    });

    // Service Worker
    files.push({
      path: "public/sw.js",
      content: `// Service Worker for ${context.businessName}
const CACHE_NAME = '${context.projectName}-v1';

// Pre-cache core app shell files
const CORE_CACHE_FILES = [
  '/',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/favicon.ico'
];

// Install event - cache core files
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core files');
        return cache.addAll(CORE_CACHE_FILES);
      })
      .then(() => {
        console.log('Service Worker installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream
            const responseToCache = response.clone();

            // Cache successful responses
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});`,
      type: "js",
    });

    // Icon files - Simple SVG-based icons as data URLs
    // 192x192 icon
    files.push({
      path: "public/icon-192x192.png",
      content: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#3182ce"/>
  <text x="96" y="120" font-family="Arial, sans-serif" font-size="96" font-weight="bold" text-anchor="middle" fill="white">${context.businessName.charAt(0).toUpperCase()}</text>
</svg>`)}`,
      type: "image",
    });

    // 512x512 icon
    files.push({
      path: "public/icon-512x512.png",
      content: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#3182ce"/>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="256" font-weight="bold" text-anchor="middle" fill="white">${context.businessName.charAt(0).toUpperCase()}</text>
</svg>`)}`,
      type: "image",
    });

    // Favicon
    files.push({
      path: "public/favicon.ico",
      content: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#3182ce"/>
  <text x="16" y="22" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">${context.businessName.charAt(0).toUpperCase()}</text>
</svg>`)}`,
      type: "image",
    });

    // Vite.svg placeholder
    files.push({
      path: "public/vite.svg",
      content: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257">
  <defs>
    <linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%">
      <stop offset="0%" stop-color="#41D1FF"></stop>
      <stop offset="100%" stop-color="#BD34FE"></stop>
    </linearGradient>
    <linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
      <stop offset="0%" stop-color="#FFEA83"></stop>
      <stop offset="8.333%" stop-color="#FFDD35"></stop>
      <stop offset="100%" stop-color="#FFA800"></stop>
    </linearGradient>
  </defs>
  <path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path>
  <path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path>
</svg>`,
      type: "svg",
    });

    // README.md
    files.push({
      path: "public/vite.svg",
      content: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257">
  <defs>
    <linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%">
      <stop offset="0%" stop-color="#41D1FF"></stop>
      <stop offset="100%" stop-color="#BD34FE"></stop>
    </linearGradient>
    <linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
      <stop offset="0%" stop-color="#FFEA83"></stop>
      <stop offset="8.333%" stop-color="#FFDD35"></stop>
      <stop offset="100%" stop-color="#FFA800"></stop>
    </linearGradient>
  </defs>
  <path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path>
  <path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path>
</svg>`,
      type: "svg",
    });

    // README.md
    files.push({
      path: "README.md",
      content: `# ${context.businessName}

${context.description}

## Features

${context.selectedFeatures.map((feature: string) => `- ${feature.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}`).join("\n")}

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Tech Stack

- React
- TypeScript
- Vite
- CSS3
- PWA (Progressive Web App)

## Generated with PWA Template Generator

This project was generated using the PWA Template Generator with AI-powered features.
`,
      type: "md",
    });

    return files;
  }

  private generateComponentStyles(componentName: string): string | null {
    switch (componentName) {
      case "BookingCalendar":
        return `.booking-calendar {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-nav-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.calendar-nav-button:hover {
  background: var(--gray-100);
}

.calendar-month-year {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--gray-900);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day-header {
  text-align: center;
  font-weight: 600;
  color: var(--gray-600);
  padding: 0.5rem;
  font-size: 0.875rem;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  position: relative;
}

.calendar-day:hover {
  background: var(--primary-50);
  color: var(--primary-600);
}

.calendar-day.selected {
  background: var(--primary-600);
  color: white;
}

.calendar-day.other-month {
  color: var(--gray-400);
}

.calendar-day.today {
  background: var(--primary-100);
  color: var(--primary-700);
  font-weight: 600;
}

@media (max-width: 480px) {
  .booking-calendar {
    padding: 1rem;
    margin: 1rem;
  }

  .calendar-day {
    font-size: 0.75rem;
  }
}`;

      case "BookingForm":
        return `.booking-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.booking-form h3 {
  margin-bottom: 1.5rem;
  color: var(--gray-900);
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--gray-700);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.booking-summary {
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.booking-summary h4 {
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.booking-summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--gray-600);
}

.booking-summary-item strong {
  color: var(--gray-900);
}

.submit-booking {
  width: 100%;
  background: var(--primary-600);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-booking:hover {
  background: var(--primary-700);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}`;

      case "LiveChat":
        return `.live-chat {
  display: flex;
  flex-direction: column;
  height: 500px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.chat-header {
  background: var(--primary-600);
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.agent-info h4 {
  margin: 0;
  font-size: 1rem;
}

.agent-status {
  font-size: 0.875rem;
  opacity: 0.9;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-input-area {
  border-top: 1px solid var(--gray-200);
  padding: 1rem;
}

.chat-input-form {
  display: flex;
  gap: 0.5rem;
}

.chat-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  resize: none;
  max-height: 100px;
}

.chat-input:focus {
  outline: none;
  border-color: var(--primary-600);
}

.chat-send-button {
  background: var(--primary-600);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-send-button:hover {
  background: var(--primary-700);
}

.chat-send-button:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}`;

      case "ChatMessage":
        return `.chat-message {
  display: flex;
  margin-bottom: 1rem;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.agent {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  position: relative;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
}

.chat-message.user .message-bubble {
  background: var(--primary-600);
  color: white;
  border-bottom-right-radius: 6px;
}

.chat-message.agent .message-bubble {
  background: var(--gray-100);
  color: var(--gray-900);
  border-bottom-left-radius: 6px;
}

.message-time {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 0.25rem;
  text-align: center;
}

.chat-message.user .message-time {
  text-align: right;
}

.chat-message.agent .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-500);
  font-style: italic;
  padding: 0.5rem 1rem;
  background: var(--gray-100);
  border-radius: 18px;
  border-bottom-left-radius: 6px;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  background: var(--gray-400);
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}`;

      case "ChatWidget":
        return `.chat-widget-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.chat-widget {
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.chat-widget.open {
  transform: translateY(0);
}

.chat-toggle {
  width: 60px;
  height: 60px;
  background: var(--primary-600);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chat-toggle:hover {
  background: var(--primary-700);
  transform: scale(1.05);
}

.chat-toggle.open {
  background: var(--gray-600);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .chat-widget-container {
    bottom: 1rem;
    right: 1rem;
  }

  .chat-widget {
    width: calc(100vw - 2rem);
    height: 400px;
  }

  .chat-toggle {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
}`;

      case "SearchBox":
        return `.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-form {
  display: flex;
  background: white;
  border-radius: 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-form:focus-within {
  border-color: var(--primary-600);
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
}

.search-input::placeholder {
  color: var(--gray-400);
}

.search-button {
  background: var(--primary-600);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-button:hover {
  background: var(--primary-700);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
}

.search-suggestion {
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid var(--gray-100);
  transition: background-color 0.2s ease;
}

.search-suggestion:hover {
  background: var(--gray-50);
}

.search-suggestion:last-child {
  border-bottom: none;
}

.suggestion-text {
  font-size: 0.9rem;
  color: var(--gray-700);
}

.suggestion-category {
  font-size: 0.75rem;
  color: var(--gray-500);
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .search-box {
    margin: 0 1rem;
  }

  .search-input {
    padding: 0.75rem 1rem;
  }

  .search-button {
    padding: 0.75rem 1rem;
  }
}`;

      case "SearchResults":
        return `.search-results {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.results-header {
  margin-bottom: 2rem;
}

.results-count {
  color: var(--gray-600);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.results-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-300);
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.filter-button:hover {
  border-color: var(--primary-600);
  color: var(--primary-600);
}

.filter-button.active {
  background: var(--primary-600);
  color: white;
  border-color: var(--primary-600);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.result-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.result-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-600);
  text-decoration: none;
  margin-bottom: 0.5rem;
  display: block;
}

.result-title:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

.result-description {
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.result-metad {
display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--gray-500);
}

.result-category {
  background: var(--gray-100);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--gray-700);
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--gray-500);
}

.no-results h3 {
  margin-bottom: 1rem;
  color: var(--gray-700);
}

@media (max-width: 640px) {
  .results-filters {
    justify-content: center;
  }

  .result-item {
    padding: 1rem;
  }

  .result-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}`;

      case "PaymentForm":
        return `.payment-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.payment-form h3 {
  margin-bottom: 2rem;
  color: var(--gray-900);
  text-align: center;
}

.payment-summary {
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--gray-600);
}

.payment-total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--gray-900);
  border-top: 1px solid var(--gray-300);
  padding-top: 0.5rem;
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--gray-700);
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-600);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

.card-input {
  position: relative;
}

.card-icons {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.25rem;
}

.card-icon {
  width: 24px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
}

.security-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
}

.payment-button {
  width: 100%;
  background: var(--primary-600);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.payment-button:hover {
  background: var(--primary-700);
}

.payment-button:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@media (max-width: 640px) {
  .payment-form {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}`;

      case "PaymentStatus":
        return `.payment-status {
  text-align: center;
  padding: 3rem 2rem;
  max-width: 500px;
  margin: 0 auto;
}

.status-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
}

.status-icon.success {
  background: var(--success-500);
}

.status-icon.error {
  background: var(--error-500);
}

.status-icon.pending {
  background: var(--warning-500);
}

.status-icon.processing {
  background: var(--primary-600);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.status-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.status-message {
  color: var(--gray-600);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.payment-details {
  background: var(--gray-50);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: left;
}

.payment-details h4 {
  margin-bottom: 1rem;
  color: var(--gray-900);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--gray-600);
}

.detail-row strong {
  color: var(--gray-900);
}

.status-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button.primary {
  background: var(--primary-600);
  color: white;
}

.action-button.primary:hover {
  background: var(--primary-700);
}

.action-button.secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.action-button.secondary:hover {
  background: var(--gray-50);
}

@media (max-width: 640px) {
  .payment-status {
    padding: 2rem 1rem;
  }

  .status-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}`;

      case "AnalyticsChart":
        return `.analytics-chart {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
}

.chart-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-300);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.filter-button:hover {
  border-color: var(--primary-600);
  color: var(--primary-600);
}

.filter-button.active {
  background: var(--primary-600);
  color: white;
  border-color: var(--primary-600);
}

.chart-container {
  height: 300px;
  position: relative;
  display: flex;
  align-items: end;
  gap: 0.5rem;
  padding: 1rem 0;
}

.chart-bar {
  background: var(--primary-600);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.chart-bar:hover {
  background: var(--primary-700);
}

.chart-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.chart-bar:hover .chart-tooltip {
  opacity: 1;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

@media (max-width: 640px) {
  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .chart-filters {
    justify-content: center;
  }

  .chart-container {
    height: 200px;
  }
}`;
      case "AnalyticsMetrics":
        return `.analytics-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-600);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.metric-title {
  font-size: 0.875rem;
  color: var(--gray-600);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-100);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 1.25rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.metric-change.positive {
  color: var(--success-600);
}

.metric-change.negative {
  color: var(--error-600);
}

.metric-change.neutral {
  color: var(--gray-500);
}

.change-arrow {
  font-size: 0.75rem;
}

.metric-period {
  color: var(--gray-500);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

@media (max-width: 640px) {
  .analytics-metrics {
    grid-template-columns: 1fr;
  }

  .metric-value {
    font-size: 1.5rem;
  }
}`;

      case "LocationMap":
        return `.location-map {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
}

.map-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
}

.map-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.map-subtitle {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.map-container {
  height: 400px;
  position: relative;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  text-align: center;
  color: var(--gray-500);
}

.map-placeholder-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--gray-400);
}

.location-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.location-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  background: var(--primary-600);
  border: 3px solid white;
  border-radius: 50%;
  cursor: pointer;
  pointer-events: all;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.location-marker:hover {
  transform: scale(1.2);
  z-index: 10;
}

.marker-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  margin-bottom: 0.5rem;
}

.location-marker:hover .marker-tooltip {
  opacity: 1;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.map-control-button {
  width: 40px;
  height: 40px;
  background: white;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.map-control-button:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.locations-list {
  padding: 1.5rem;
  max-height: 200px;
  overflow-y: auto;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.location-item:hover {
  background: var(--gray-50);
}

.location-item.active {
  background: var(--primary-50);
  border-left: 4px solid var(--primary-600);
}

.location-info h4 {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
}

.location-address {
  font-size: 0.875rem;
  color: var(--gray-600);
}

@media (max-width: 640px) {
  .map-container {
    height: 300px;
  }

  .locations-list {
    max-height: 150px;
  }
}`;

      case "LocationPicker":
        return `.location-picker {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.picker-header {
  padding: 1.5rem;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.picker-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.picker-instructions {
  color: var(--gray-600);
  font-size: 0.875rem;
}

.picker-map {
  height: 300px;
  position: relative;
  background: var(--gray-100);
  cursor: crosshair;
}

.picker-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  color: var(--gray-500);
}

.picker-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.picker-crosshair::before,
.picker-crosshair::after {
  content: '';
  position: absolute;
  background: var(--primary-600);
}

.picker-crosshair::before {
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  transform: translateY(-50%);
}

.picker-crosshair::after {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
}

.selected-marker {
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--primary-600);
  border: 3px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: markerDrop 0.3s ease-out;
}

@keyframes markerDrop {
  0% {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

.picker-footer {
  padding: 1.5rem;
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
}

.coordinates-display {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  margin-bottom: 1rem;
}

.coordinates-title {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.coordinates-values {
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--gray-600);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.coordinate-item {
  display: flex;
  justify-content: space-between;
}

.picker-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.picker-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.picker-button.primary {
  background: var(--primary-600);
  color: white;
}

.picker-button.primary:hover {
  background: var(--primary-700);
}

.picker-button.primary:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.picker-button.secondary {
  background: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.picker-button.secondary:hover {
  background: var(--gray-50);
}

@media (max-width: 640px) {
  .picker-actions {
    flex-direction: column;
  }

  .picker-button {
    width: 100%;
  }

  .coordinates-values {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}`;

      case "NotificationBanner":
        return `.notification-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.notification-banner.info {
  background: var(--primary-600);
}

.notification-banner.success {
  background: var(--success-600);
}

.notification-banner.warning {
  background: var(--warning-600);
}

.notification-banner.error {
  background: var(--error-600);
}

.notification-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  text-align: center;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-action {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
}

.notification-action:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.notification-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  transition: width 0.1s linear;
}

@media (max-width: 640px) {
  .notification-banner {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .notification-message {
    font-size: 0.875rem;
  }

  .notification-action {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
}`;

      case "NotificationList":
        return `.notification-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--gray-200);
  max-width: 400px;
  max-height: 500px;
  overflow: hidden;
  position: relative;
}

.notifications-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.notifications-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.notifications-subtitle {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.notifications-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.notifications-action {
  font-size: 0.75rem;
  color: var(--primary-600);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.notifications-action:hover {
  color: var(--primary-700);
}

.notifications-body {
  max-height: 350px;
  overflow-y: auto;
}

.notification-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray-100);
  transition: background-color 0.2s ease;
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  background: var(--gray-50);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.unread {
  background: var(--primary-50);
  border-left: 4px solid var(--primary-600);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 8px;
  height: 8px;
  background: var(--primary-600);
  border-radius: 50%;
}

.notification-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.notification-type-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: white;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.notification-type-icon.info {
  background: var(--primary-600);
}

.notification-type-icon.success {
  background: var(--success-600);
}

.notification-type-icon.warning {
  background: var(--warning-600);
}

.notification-type-icon.error {
  background: var(--error-600);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.notification-message {
  color: var(--gray-600);
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.empty-notifications {
  padding: 3rem 1.5rem;
  text-align: center;
  color: var(--gray-500);
}

.empty-notifications-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--gray-400);
}

.empty-notifications h3 {
  margin-bottom: 0.5rem;
  color: var(--gray-700);
}

.notifications-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
  text-align: center;
}

.view-all-link {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
}

.view-all-link:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .notification-list {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .notifications-header {
    padding: 1rem;
  }

  .notification-item {
    padding: 0.75rem 1rem;
  }
}`;

      case "Gallery":
        return `.gallery {
  padding: 2rem 0;
}

.gallery-header {
  text-align: center;
  margin-bottom: 3rem;
}

.gallery-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 1rem;
}

.gallery-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-300);
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.filter-button:hover {
  border-color: var(--primary-600);
  color: var(--primary-600);
}

.filter-button.active {
  background: var(--primary-600);
  color: white;
  border-color: var(--primary-600);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
  aspect-ratio: 4/3;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-image {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 1.5rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-overlay {
  transform: translateY(0);
}

.gallery-overlay h3 {
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.gallery-overlay p {
  font-size: 0.875rem;
  opacity: 0.9;
}

.gallery-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.gallery-modal-content {
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
}

.gallery-modal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gallery-modal-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  .gallery-filters {
    justify-content: center;
  }
}`;

      case "SocialShare":
        return `.social-share {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
}

.social-share-title {
  font-weight: 600;
  color: var(--gray-900);
  margin-right: 0.5rem;
}

.social-share-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-share-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: white;
  font-size: 1rem;
}

.social-share-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.social-share-button.facebook {
  background: #1877f2;
}

.social-share-button.facebook:hover {
  background: #166fe5;
}

.social-share-button.twitter {
  background: #1da1f2;
}

.social-share-button.twitter:hover {
  background: #0d8bd9;
}

.social-share-button.linkedin {
  background: #0077b5;
}

.social-share-button.linkedin:hover {
  background: #005e93;
}

.social-share-button.whatsapp {
  background: #25d366;
}

.social-share-button.whatsapp:hover {
  background: #128c7e;
}

.social-share-button.email {
  background: var(--gray-600);
}

.social-share-button.email:hover {
  background: var(--gray-700);
}

.social-share-button.copy {
  background: var(--primary-600);
}

.social-share-button.copy:hover {
  background: var(--primary-700);
}

.share-count {
  font-size: 0.875rem;
  color: var(--gray-500);
  margin-left: auto;
}

.copy-feedback {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gray-900);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.copy-feedback.show {
  opacity: 1;
}

@media (max-width: 640px) {
  .social-share {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .social-share-buttons {
    justify-content: center;
  }

  .share-count {
    margin: 0;
    text-align: center;
  }
}`;

      default:
        return null;
    }
  }

  private generateGlobalStyles(): string {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: #2d3748;
  background-color: #ffffff;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
}

p {
  margin-bottom: 1rem;
}

a {
  color: #3182ce;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  font-family: inherit;
}

img {
  max-width: 100%;
  height: auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}`;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Validate generated project with enhanced zero-manual-issues system
   */
  async validateGeneratedProject(
    files: GeneratedFile[],
    config: ProjectConfig,
  ): Promise<{
    isValid: boolean;
    errors: any[];
    warnings: any[];
    suggestions: string[];
    fixedFiles: GeneratedFile[];
    autoFixedCount: number;
    preventedIssuesCount: number;
    finalStatus: string;
  }> {
    console.log(
      "🔍 Running enhanced validation with zero-manual-issues target...",
    );

    try {
      const result = await enhancedProjectValidator.validateProject(
        files,
        config,
      );

      console.log(`✅ Enhanced validation complete: ${result.finalStatus}`);
      console.log(`🔧 Auto-fixed: ${result.autoFixedCount} issues`);
      console.log(`🛡️ Prevented: ${result.preventedIssuesCount} issues`);
      console.log(`⚠️ Manual issues: ${result.errors.length}`);

      return {
        isValid: result.isValid,
        errors: result.errors,
        warnings: result.warnings,
        suggestions: result.suggestions || [],
        fixedFiles: result.fixedFiles || files,
        autoFixedCount: result.autoFixedCount,
        preventedIssuesCount: result.preventedIssuesCount,
        finalStatus: result.finalStatus,
      };
    } catch (error) {
      console.error("❌ Enhanced validation failed:", error);

      // Fallback to basic validation
      return {
        isValid: false,
        errors: [
          {
            message:
              "Validation system error: " +
              (error instanceof Error ? error.message : String(error)),
          },
        ],
        warnings: [],
        suggestions: [],
        fixedFiles: files,
        autoFixedCount: 0,
        preventedIssuesCount: 0,
        finalStatus: "ERROR",
      };
    }
  }
}
