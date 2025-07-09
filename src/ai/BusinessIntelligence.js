/**
 * AI-Powered Business Intelligence System
 * Provides intelligent recommendations and content generation for PWA projects
 */

import OpenAI from 'openai';
import chalk from 'chalk';
import { createHash } from 'crypto';

export class BusinessIntelligence {
  constructor(options = {}) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || options.apiKey
    });

    this.industryKnowledge = {
      'small-business': {
        keywords: ['local', 'community', 'service', 'family', 'trusted', 'established'],
        painPoints: ['online presence', 'customer acquisition', 'competition', 'reviews'],
        solutions: ['contact forms', 'testimonials', 'local SEO', 'social proof'],
        conversionGoals: ['phone calls', 'form submissions', 'appointments'],
        designTrends: ['clean', 'trustworthy', 'professional', 'accessible']
      },
      'e-commerce': {
        keywords: ['products', 'shopping', 'deals', 'quality', 'fast shipping'],
        painPoints: ['cart abandonment', 'trust', 'product discovery', 'checkout friction'],
        solutions: ['reviews', 'recommendations', 'wishlist', 'social proof'],
        conversionGoals: ['purchases', 'email signups', 'repeat customers'],
        designTrends: ['modern', 'clean', 'product-focused', 'mobile-first']
      },
      'saas': {
        keywords: ['software', 'productivity', 'automation', 'scalable', 'efficient'],
        painPoints: ['user onboarding', 'feature discovery', 'retention', 'pricing'],
        solutions: ['dashboard', 'analytics', 'tutorials', 'free trial'],
        conversionGoals: ['signups', 'trial conversions', 'upgrades'],
        designTrends: ['dashboard', 'data-driven', 'minimal', 'professional']
      },
      'restaurant': {
        keywords: ['food', 'dining', 'fresh', 'delicious', 'atmosphere'],
        painPoints: ['reservations', 'menu updates', 'online ordering', 'reviews'],
        solutions: ['online menu', 'reservations', 'photo gallery', 'reviews'],
        conversionGoals: ['reservations', 'orders', 'visits'],
        designTrends: ['appetizing', 'warm', 'inviting', 'photo-heavy']
      },
      'healthcare': {
        keywords: ['health', 'care', 'professional', 'trusted', 'experienced'],
        painPoints: ['appointments', 'patient information', 'trust', 'accessibility'],
        solutions: ['appointment booking', 'staff profiles', 'services', 'testimonials'],
        conversionGoals: ['appointments', 'consultations', 'patient inquiries'],
        designTrends: ['clean', 'professional', 'trustworthy', 'accessible']
      },
      'portfolio': {
        keywords: ['creative', 'professional', 'experience', 'skills', 'projects'],
        painPoints: ['showcasing work', 'client acquisition', 'credibility'],
        solutions: ['project gallery', 'testimonials', 'about section', 'contact'],
        conversionGoals: ['inquiries', 'project requests', 'networking'],
        designTrends: ['creative', 'unique', 'visual', 'personal']
      }
    };

    this.colorPsychology = {
      'professional': {
        primary: '#2563eb', // Blue - trust, reliability
        secondary: '#64748b', // Gray - professional, neutral
        accent: '#10b981', // Green - growth, success
        psychology: 'Conveys trust, reliability, and professionalism'
      },
      'vibrant': {
        primary: '#dc2626', // Red - energy, urgency
        secondary: '#f59e0b', // Orange - warmth, enthusiasm
        accent: '#7c3aed', // Purple - creativity, luxury
        psychology: 'Creates energy, excitement, and urgency'
      },
      'modern': {
        primary: '#1f2937', // Dark gray - modern, sophisticated
        secondary: '#3b82f6', // Blue - technology, innovation
        accent: '#06b6d4', // Cyan - fresh, modern
        psychology: 'Suggests innovation, technology, and modernity'
      },
      'warm': {
        primary: '#dc2626', // Red - warmth, appetite
        secondary: '#f59e0b', // Orange - warmth, comfort
        accent: '#eab308', // Yellow - happiness, energy
        psychology: 'Creates warmth, comfort, and appetite appeal'
      },
      'medical': {
        primary: '#0ea5e9', // Blue - trust, calm
        secondary: '#10b981', // Green - health, healing
        accent: '#64748b', // Gray - professional, clean
        psychology: 'Conveys health, cleanliness, and professionalism'
      },
      'creative': {
        primary: '#7c3aed', // Purple - creativity, imagination
        secondary: '#ec4899', // Pink - creativity, playfulness
        accent: '#06b6d4', // Cyan - fresh, innovative
        psychology: 'Encourages creativity and artistic expression'
      }
    };

    this.performanceMetrics = {
      'small-business': {
        targetLCP: 2.5,
        targetFID: 100,
        targetCLS: 0.1,
        criticalResources: ['hero-image', 'contact-form', 'business-info']
      },
      'e-commerce': {
        targetLCP: 2.0,
        targetFID: 50,
        targetCLS: 0.05,
        criticalResources: ['product-images', 'cart', 'checkout']
      },
      'saas': {
        targetLCP: 1.5,
        targetFID: 50,
        targetCLS: 0.05,
        criticalResources: ['dashboard', 'auth', 'navigation']
      }
    };

    this.seoTemplates = {
      'small-business': {
        titleTemplate: '{businessName} - {service} in {location}',
        descriptionTemplate: 'Professional {service} services in {location}. Contact {businessName} for quality {service} with excellent customer service.',
        keywords: ['local business', 'service provider', 'professional']
      },
      'e-commerce': {
        titleTemplate: '{businessName} - {category} Online Store',
        descriptionTemplate: 'Shop {category} online at {businessName}. Free shipping, quality products, and excellent customer service.',
        keywords: ['online store', 'e-commerce', 'shopping']
      },
      'restaurant': {
        titleTemplate: '{businessName} - {cuisine} Restaurant in {location}',
        descriptionTemplate: 'Experience authentic {cuisine} at {businessName} in {location}. Fresh ingredients, great atmosphere, and excellent service.',
        keywords: ['restaurant', 'dining', 'food']
      }
    };
  }

  async analyzeBusinessNeeds(businessInfo) {
    console.log(chalk.blue('🤖 Analyzing business needs with AI...'));

    try {
      const analysis = await this.generateBusinessAnalysis(businessInfo);
      const recommendations = await this.generateRecommendations(analysis);
      const content = await this.generateContent(businessInfo, analysis);
      const seoStrategy = await this.generateSEOStrategy(businessInfo, analysis);
      const performanceGoals = this.generatePerformanceGoals(businessInfo.industry);

      return {
        analysis,
        recommendations,
        content,
        seoStrategy,
        performanceGoals,
        insights: await this.generateInsights(businessInfo, analysis)
      };

    } catch (error) {
      console.error(chalk.red('❌ Error in AI analysis:'), error);
      return this.getFallbackAnalysis(businessInfo);
    }
  }

  async generateBusinessAnalysis(businessInfo) {
    const prompt = `
    Analyze this business and provide strategic insights:

    Business Name: ${businessInfo.businessName}
    Industry: ${businessInfo.industry}
    Description: ${businessInfo.description || 'Not provided'}
    Target Audience: ${businessInfo.targetAudience || 'General'}
    Location: ${businessInfo.location || 'Not specified'}

    Provide analysis in JSON format with:
    - businessType: specific category
    - targetAudience: detailed audience analysis
    - competitiveAdvantages: unique selling points
    - keyFeatures: essential website features
    - contentStrategy: content recommendations
    - userJourney: optimal user flow
    - conversionGoals: primary conversion objectives
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert business analyst specializing in web presence optimization."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async generateRecommendations(analysis) {
    const industryData = this.industryKnowledge[analysis.businessType] || this.industryKnowledge['small-business'];

    const recommendations = {
      framework: this.recommendFramework(analysis),
      features: this.recommendFeatures(analysis, industryData),
      components: this.recommendComponents(analysis),
      colorScheme: this.recommendColorScheme(analysis),
      layout: this.recommendLayout(analysis),
      integrations: this.recommendIntegrations(analysis),
      performance: this.recommendPerformanceOptimizations(analysis),
      seo: this.recommendSEOFeatures(analysis)
    };

    return recommendations;
  }

  async generateContent(businessInfo, analysis) {
    const contentPrompt = `
    Generate website content for this business:

    Business: ${businessInfo.businessName}
    Industry: ${businessInfo.industry}
    Analysis: ${JSON.stringify(analysis)}

    Generate:
    - heroTitle: compelling headline
    - heroSubtitle: supporting tagline
    - aboutText: about section content
    - servicesIntro: services section introduction
    - ctaTexts: call-to-action button texts
    - testimonialPlaceholders: sample testimonials
    - metaDescription: SEO meta description
    - keywords: SEO keywords array

    Return as JSON object.
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert copywriter specializing in web content that converts."
        },
        {
          role: "user",
          content: contentPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async generateSEOStrategy(businessInfo, analysis) {
    const seoTemplate = this.seoTemplates[businessInfo.industry] || this.seoTemplates['small-business'];

    const strategy = {
      title: seoTemplate.titleTemplate
        .replace('{businessName}', businessInfo.businessName)
        .replace('{service}', analysis.keyFeatures?.[0] || 'services')
        .replace('{location}', businessInfo.location || 'your area')
        .replace('{category}', businessInfo.industry)
        .replace('{cuisine}', businessInfo.cuisine || 'cuisine'),

      description: seoTemplate.descriptionTemplate
        .replace('{businessName}', businessInfo.businessName)
        .replace('{service}', analysis.keyFeatures?.[0] || 'services')
        .replace('{location}', businessInfo.location || 'your area')
        .replace('{category}', businessInfo.industry)
        .replace('{cuisine}', businessInfo.cuisine || 'cuisine'),

      keywords: [
        ...seoTemplate.keywords,
        businessInfo.businessName.toLowerCase(),
        businessInfo.industry,
        ...(businessInfo.location ? [businessInfo.location.toLowerCase()] : [])
      ],

      structuredData: this.generateStructuredData(businessInfo, analysis),
      openGraph: this.generateOpenGraphData(businessInfo, analysis),
      localSEO: businessInfo.location ? this.generateLocalSEO(businessInfo) : null
    };

    return strategy;
  }

  generatePerformanceGoals(industry) {
    const metrics = this.performanceMetrics[industry] || this.performanceMetrics['small-business'];

    return {
      coreWebVitals: {
        LCP: metrics.targetLCP,
        FID: metrics.targetFID,
        CLS: metrics.targetCLS
      },
      customMetrics: {
        firstContentfulPaint: metrics.targetLCP * 0.6,
        timeToInteractive: metrics.targetLCP * 1.2,
        totalBlockingTime: metrics.targetFID * 2
      },
      criticalResources: metrics.criticalResources,
      budgets: {
        javascript: '200KB',
        css: '50KB',
        images: '500KB',
        fonts: '100KB'
      }
    };
  }

  async generateInsights(businessInfo, analysis) {
    const insights = {
      competitiveAnalysis: await this.generateCompetitiveInsights(businessInfo),
      marketTrends: await this.generateMarketTrends(businessInfo.industry),
      userBehavior: this.generateUserBehaviorInsights(analysis),
      conversionOptimization: this.generateConversionInsights(analysis),
      technicalRecommendations: this.generateTechnicalInsights(businessInfo.industry)
    };

    return insights;
  }

  async generateCompetitiveInsights(businessInfo) {
    // Simulated competitive analysis - in real implementation, this would
    // integrate with web scraping or competitive intelligence APIs
    const insights = {
      commonFeatures: ['contact forms', 'testimonials', 'service listings'],
      differentiators: ['unique value proposition', 'superior user experience'],
      opportunities: ['mobile optimization', 'faster loading', 'better SEO'],
      threats: ['established competitors', 'market saturation'],
      recommendations: [
        'Focus on mobile-first design',
        'Implement superior performance',
        'Create unique value propositions',
        'Optimize for local search'
      ]
    };

    return insights;
  }

  async generateMarketTrends(industry) {
    const trends = {
      'small-business': [
        'Local SEO optimization',
        'Mobile-first design',
        'Online booking systems',
        'Customer review integration',
        'Social media integration'
      ],
      'e-commerce': [
        'Headless commerce',
        'Personalization',
        'Voice commerce',
        'Augmented reality',
        'Sustainable shopping'
      ],
      'saas': [
        'AI integration',
        'No-code solutions',
        'API-first approach',
        'Real-time collaboration',
        'Privacy-first design'
      ],
      'restaurant': [
        'Online ordering',
        'Contactless menus',
        'Table reservations',
        'Loyalty programs',
        'Delivery integration'
      ]
    };

    return trends[industry] || trends['small-business'];
  }

  generateUserBehaviorInsights(analysis) {
    return {
      primaryActions: analysis.conversionGoals || ['contact', 'learn-more'],
      userFlow: analysis.userJourney || ['landing', 'services', 'contact'],
      devicePreferences: ['mobile', 'desktop', 'tablet'],
      contentPreferences: ['visual', 'concise', 'social-proof'],
      interactionPatterns: ['scroll', 'click', 'form-fill', 'search']
    };
  }

  generateConversionInsights(analysis) {
    return {
      primaryCTA: analysis.conversionGoals?.[0] || 'contact',
      secondaryCTA: analysis.conversionGoals?.[1] || 'learn-more',
      trustSignals: ['testimonials', 'certifications', 'reviews'],
      urgencyTactics: ['limited-time', 'social-proof', 'scarcity'],
      formOptimization: ['minimal-fields', 'auto-fill', 'progress-indicators']
    };
  }

  generateTechnicalInsights(industry) {
    return {
      performancePriorities: ['mobile-speed', 'image-optimization', 'code-splitting'],
      securityRequirements: ['HTTPS', 'form-validation', 'data-protection'],
      accessibilityNeeds: ['screen-reader', 'keyboard-navigation', 'color-contrast'],
      seoRequirements: ['meta-tags', 'structured-data', 'sitemap'],
      analyticsSetup: ['goal-tracking', 'event-tracking', 'conversion-funnels']
    };
  }

  recommendFramework(analysis) {
    const complexity = analysis.keyFeatures?.length || 3;
    const interactivity = analysis.userJourney?.length || 3;

    if (complexity > 5 || interactivity > 4) {
      return 'nextjs'; // Complex applications
    } else if (complexity > 3) {
      return 'react'; // Standard applications
    } else {
      return 'astro'; // Simple, content-focused sites
    }
  }

  recommendFeatures(analysis, industryData) {
    const baseFeatures = industryData.solutions || ['contact-form'];
    const additionalFeatures = [];

    if (analysis.conversionGoals?.includes('appointments')) {
      additionalFeatures.push('booking-system');
    }

    if (analysis.conversionGoals?.includes('purchases')) {
      additionalFeatures.push('e-commerce');
    }

    if (analysis.targetAudience?.includes('mobile')) {
      additionalFeatures.push('pwa-features');
    }

    return [...baseFeatures, ...additionalFeatures];
  }

  recommendComponents(analysis) {
    const components = ['Header', 'Footer', 'Hero'];

    if (analysis.keyFeatures?.includes('services')) {
      components.push('Services');
    }

    if (analysis.conversionGoals?.includes('contact')) {
      components.push('Contact');
    }

    if (analysis.competitiveAdvantages?.length > 0) {
      components.push('About');
    }

    return components;
  }

  recommendColorScheme(analysis) {
    const businessType = analysis.businessType || 'small-business';
    const schemeMap = {
      'small-business': 'professional',
      'e-commerce': 'vibrant',
      'saas': 'modern',
      'restaurant': 'warm',
      'healthcare': 'medical',
      'portfolio': 'creative'
    };

    return schemeMap[businessType] || 'professional';
  }

  recommendLayout(analysis) {
    const layoutMap = {
      'small-business': 'standard',
      'e-commerce': 'product-grid',
      'saas': 'dashboard',
      'restaurant': 'visual-heavy',
      'healthcare': 'informational',
      'portfolio': 'showcase'
    };

    return layoutMap[analysis.businessType] || 'standard';
  }

  recommendIntegrations(analysis) {
    const integrations = [];

    if (analysis.conversionGoals?.includes('contact')) {
      integrations.push('contact-form');
    }

    if (analysis.conversionGoals?.includes('analytics')) {
      integrations.push('google-analytics');
    }

    if (analysis.keyFeatures?.includes('social')) {
      integrations.push('social-media');
    }

    return integrations;
  }

  recommendPerformanceOptimizations(analysis) {
    return {
      imageOptimization: true,
      codeSplitting: analysis.keyFeatures?.length > 3,
      caching: true,
      compression: true,
      prefetching: analysis.userJourney?.length > 2,
      lazyLoading: true,
      criticalCSS: true,
      serviceWorker: true
    };
  }

  recommendSEOFeatures(analysis) {
    return {
      metaTags: true,
      structuredData: true,
      sitemap: true,
      robotsTxt: true,
      openGraph: true,
      twitterCards: true,
      localSEO: analysis.businessType === 'small-business',
      breadcrumbs: analysis.keyFeatures?.length > 3
    };
  }

  generateStructuredData(businessInfo, analysis) {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": businessInfo.businessName,
      "description": analysis.businessType
    };

    if (businessInfo.location) {
      baseData["address"] = {
        "@type": "PostalAddress",
        "addressLocality": businessInfo.location
      };
    }

    return baseData;
  }

  generateOpenGraphData(businessInfo, analysis) {
    return {
      title: businessInfo.businessName,
      description: `${businessInfo.businessName} - ${analysis.businessType}`,
      type: 'website',
      locale: 'en_US'
    };
  }

  generateLocalSEO(businessInfo) {
    return {
      businessName: businessInfo.businessName,
      location: businessInfo.location,
      categories: [businessInfo.industry],
      features: ['local-business-schema', 'google-my-business', 'local-citations']
    };
  }

  getFallbackAnalysis(businessInfo) {
    console.log(chalk.yellow('⚠️  Using fallback analysis due to AI service unavailability'));

    const industryData = this.industryKnowledge[businessInfo.industry] || this.industryKnowledge['small-business'];
    const colorScheme = this.colorPsychology[industryData.designTrends?.[0]] || this.colorPsychology['professional'];

    return {
      analysis: {
        businessType: businessInfo.industry,
        targetAudience: 'General audience',
        keyFeatures: industryData.solutions.slice(0, 3),
        conversionGoals: industryData.conversionGoals
      },
      recommendations: {
        framework: 'react',
        features: industryData.solutions,
        components: ['Header', 'Hero', 'Services', 'Contact', 'Footer'],
        colorScheme: colorScheme,
        layout: 'standard'
      },
      content: {
        heroTitle: `Welcome to ${businessInfo.businessName}`,
        heroSubtitle: `Professional ${businessInfo.industry} services`,
        aboutText: `${businessInfo.businessName} provides quality ${businessInfo.industry} services.`,
        metaDescription: `${businessInfo.businessName} - Professional ${businessInfo.industry} services`
      },
      seoStrategy: {
        title: `${businessInfo.businessName} - ${businessInfo.industry}`,
        description: `Professional ${businessInfo.industry} services`,
        keywords: [businessInfo.businessName.toLowerCase(), businessInfo.industry]
      },
      performanceGoals: this.generatePerformanceGoals(businessInfo.industry),
      insights: {
        marketTrends: industryData.solutions,
        recommendations: ['Focus on mobile optimization', 'Implement contact forms', 'Add testimonials']
      }
    };
  }

  generateUniqueId(data) {
    return createHash('md5').update(JSON.stringify(data)).digest('hex').substring(0, 8);
  }
}

export default BusinessIntelligence;
