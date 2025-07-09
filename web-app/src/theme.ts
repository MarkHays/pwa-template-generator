import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Color palette
const colors = {
  primary: {
    50: '#e6f3ff',
    100: '#b3d9ff',
    200: '#80bfff',
    300: '#4da6ff',
    400: '#1a8cff',
    500: '#0070f3',
    600: '#0059c2',
    700: '#004291',
    800: '#002b61',
    900: '#001530',
  },
  secondary: {
    50: '#f7fafc',
    100: '#edf2f7',
    200: '#e2e8f0',
    300: '#cbd5e0',
    400: '#a0aec0',
    500: '#718096',
    600: '#4a5568',
    700: '#2d3748',
    800: '#1a202c',
    900: '#171923',
  },
  accent: {
    50: '#fef5e7',
    100: '#fde2b8',
    200: '#fcd089',
    300: '#fbbd5a',
    400: '#f9ab2b',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  success: {
    50: '#f0fff4',
    100: '#c6f6d5',
    200: '#9ae6b4',
    300: '#68d391',
    400: '#48bb78',
    500: '#38a169',
    600: '#2f855a',
    700: '#276749',
    800: '#22543d',
    900: '#1c4532',
  },
  error: {
    50: '#fed7d7',
    100: '#feb2b2',
    200: '#fc8181',
    300: '#f56565',
    400: '#e53e3e',
    500: '#c53030',
    600: '#9b2c2c',
    700: '#742a2a',
    800: '#4a1c1c',
    900: '#1a0f0f',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  brand: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientHover: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
  },
};

// Font configuration
const fonts = {
  heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'Fira Code', 'Monaco', 'Consolas', 'Ubuntu Mono', monospace",
};

// Font sizes
const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
};

// Breakpoints
const breakpoints = {
  sm: '480px',
  md: '768px',
  lg: '992px',
  xl: '1280px',
  '2xl': '1536px',
};

// Spacing
const space = {
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Shadows
const shadows = {
  xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  outline: '0 0 0 3px rgba(66, 153, 225, 0.6)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
};

// Border radius
const radii = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  cssVarPrefix: 'pwa-gen',
};

// Component styles
const components = {
  Button: {
    baseStyle: {
      fontWeight: '500',
      borderRadius: 'lg',
      _focus: {
        boxShadow: 'outline',
      },
    },
    variants: {
      solid: {
        bg: 'primary.500',
        color: 'white',
        _hover: {
          bg: 'primary.600',
          transform: 'translateY(-1px)',
          shadow: 'lg',
        },
        _active: {
          bg: 'primary.700',
          transform: 'translateY(0)',
        },
      },
      outline: {
        borderColor: 'primary.500',
        color: 'primary.500',
        _hover: {
          bg: 'primary.50',
          borderColor: 'primary.600',
          transform: 'translateY(-1px)',
        },
      },
      ghost: {
        color: 'primary.500',
        _hover: {
          bg: 'primary.50',
          transform: 'translateY(-1px)',
        },
      },
      gradient: {
        bgGradient: 'linear(to-r, primary.500, purple.500)',
        color: 'white',
        _hover: {
          bgGradient: 'linear(to-r, primary.600, purple.600)',
          transform: 'translateY(-1px)',
          shadow: 'lg',
        },
        _active: {
          bgGradient: 'linear(to-r, primary.700, purple.700)',
          transform: 'translateY(0)',
        },
      },
    },
    sizes: {
      sm: {
        h: '32px',
        minW: '32px',
        fontSize: 'sm',
        px: '12px',
      },
      md: {
        h: '40px',
        minW: '40px',
        fontSize: 'md',
        px: '16px',
      },
      lg: {
        h: '48px',
        minW: '48px',
        fontSize: 'lg',
        px: '24px',
      },
      xl: {
        h: '56px',
        minW: '56px',
        fontSize: 'xl',
        px: '32px',
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        border: '1px solid',
        borderColor: 'gray.200',
        bg: 'white',
        shadow: 'sm',
        _hover: {
          shadow: 'md',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease',
      },
      header: {
        p: 6,
        pb: 0,
      },
      body: {
        p: 6,
      },
      footer: {
        p: 6,
        pt: 0,
      },
    },
    variants: {
      elevated: {
        container: {
          shadow: 'lg',
          _hover: {
            shadow: 'xl',
          },
        },
      },
      outline: {
        container: {
          border: '2px solid',
          borderColor: 'gray.200',
          shadow: 'none',
        },
      },
      filled: {
        container: {
          bg: 'gray.50',
          border: 'none',
        },
      },
      gradient: {
        container: {
          bgGradient: 'linear(to-br, primary.50, purple.50)',
          border: 'none',
        },
      },
    },
  },
  Badge: {
    baseStyle: {
      px: 3,
      py: 1,
      borderRadius: 'full',
      fontWeight: '500',
      fontSize: 'xs',
      textTransform: 'none',
    },
    variants: {
      solid: {
        bg: 'primary.500',
        color: 'white',
      },
      outline: {
        borderColor: 'primary.500',
        color: 'primary.500',
      },
      gradient: {
        bgGradient: 'linear(to-r, primary.500, purple.500)',
        color: 'white',
      },
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'lg',
        _focus: {
          borderColor: 'primary.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
        },
      },
    },
    variants: {
      filled: {
        field: {
          bg: 'gray.50',
          border: '1px solid',
          borderColor: 'gray.200',
          _hover: {
            bg: 'gray.100',
            borderColor: 'gray.300',
          },
          _focus: {
            bg: 'white',
            borderColor: 'primary.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
          },
        },
      },
    },
  },
  Textarea: {
    baseStyle: {
      borderRadius: 'lg',
      _focus: {
        borderColor: 'primary.500',
        boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
      },
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: 'lg',
        _focus: {
          borderColor: 'primary.500',
          boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
        },
      },
    },
  },
  Checkbox: {
    baseStyle: {
      control: {
        borderRadius: 'md',
        _checked: {
          bg: 'primary.500',
          borderColor: 'primary.500',
          _hover: {
            bg: 'primary.600',
            borderColor: 'primary.600',
          },
        },
      },
    },
  },
  Radio: {
    baseStyle: {
      control: {
        _checked: {
          bg: 'primary.500',
          borderColor: 'primary.500',
          _hover: {
            bg: 'primary.600',
            borderColor: 'primary.600',
          },
        },
      },
    },
  },
  Switch: {
    baseStyle: {
      track: {
        _checked: {
          bg: 'primary.500',
        },
      },
    },
  },
  Progress: {
    baseStyle: {
      track: {
        borderRadius: 'full',
        bg: 'gray.200',
      },
      filledTrack: {
        bg: 'primary.500',
        borderRadius: 'full',
        bgGradient: 'linear(to-r, primary.500, purple.500)',
      },
    },
  },
  Tabs: {
    baseStyle: {
      tab: {
        fontWeight: '500',
        _selected: {
          color: 'primary.500',
          borderColor: 'primary.500',
        },
        _hover: {
          color: 'primary.600',
        },
      },
    },
  },
  Alert: {
    baseStyle: {
      container: {
        borderRadius: 'lg',
        border: '1px solid',
      },
    },
    variants: {
      solid: {
        container: {
          bg: 'primary.500',
          color: 'white',
        },
      },
      'left-accent': {
        container: {
          borderLeft: '4px solid',
          borderLeftColor: 'primary.500',
          bg: 'primary.50',
        },
      },
      'top-accent': {
        container: {
          borderTop: '4px solid',
          borderTopColor: 'primary.500',
          bg: 'primary.50',
        },
      },
    },
  },
  Modal: {
    baseStyle: {
      dialog: {
        borderRadius: 'xl',
        shadow: 'xl',
      },
      overlay: {
        bg: 'blackAlpha.600',
        backdropFilter: 'blur(4px)',
      },
    },
  },
  Popover: {
    baseStyle: {
      content: {
        borderRadius: 'lg',
        shadow: 'lg',
        border: '1px solid',
        borderColor: 'gray.200',
      },
    },
  },
  Tooltip: {
    baseStyle: {
      borderRadius: 'lg',
      bg: 'gray.800',
      color: 'white',
      fontSize: 'sm',
      fontWeight: '500',
      px: 3,
      py: 2,
    },
  },
  Divider: {
    baseStyle: {
      borderColor: 'gray.200',
    },
  },
  Code: {
    baseStyle: {
      bg: 'gray.100',
      color: 'gray.800',
      px: 2,
      py: 1,
      borderRadius: 'md',
      fontFamily: 'mono',
      fontSize: 'sm',
    },
  },
  Kbd: {
    baseStyle: {
      bg: 'gray.100',
      border: '1px solid',
      borderColor: 'gray.300',
      borderBottomWidth: '2px',
      borderRadius: 'md',
      px: 2,
      py: 1,
      fontSize: 'sm',
      fontFamily: 'mono',
    },
  },
};

// Global styles
const styles = {
  global: {
    '*': {
      boxSizing: 'border-box',
    },
    html: {
      fontSize: '16px',
      scrollBehavior: 'smooth',
    },
    body: {
      fontFamily: 'body',
      color: 'gray.800',
      bg: 'white',
      lineHeight: 'base',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    'html, body': {
      height: '100%',
    },
    '#root': {
      height: '100%',
    },
    '::placeholder': {
      color: 'gray.400',
    },
    '::selection': {
      bg: 'primary.100',
      color: 'primary.800',
    },
    '::-webkit-scrollbar': {
      width: '8px',
    },
    '::-webkit-scrollbar-track': {
      bg: 'gray.100',
    },
    '::-webkit-scrollbar-thumb': {
      bg: 'gray.300',
      borderRadius: 'full',
    },
    '::-webkit-scrollbar-thumb:hover': {
      bg: 'gray.400',
    },
    // Focus styles for accessibility
    ':focus': {
      outline: 'none',
      boxShadow: 'outline',
    },
    // Smooth transitions
    'a, button, input, textarea, select': {
      transition: 'all 0.2s ease',
    },
    // Remove default button styles
    'button': {
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
    },
    // Link styles
    'a': {
      color: 'primary.500',
      textDecoration: 'none',
      _hover: {
        textDecoration: 'underline',
      },
    },
    // Print styles
    '@media print': {
      '*': {
        boxShadow: 'none !important',
        textShadow: 'none !important',
      },
    },
    // Reduced motion
    '@media (prefers-reduced-motion: reduce)': {
      '*': {
        animationDuration: '0.01ms !important',
        animationIterationCount: '1 !important',
        transitionDuration: '0.01ms !important',
      },
    },
  },
};

// Create and export the theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  fontSizes,
  breakpoints,
  space,
  shadows,
  radii,
  components,
  styles,
});

export default theme;
