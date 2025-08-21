import { ThemeConfig } from 'antd';
import { AliasToken } from 'antd/es/theme/internal';

// Brand Colors - Semantic color system based on current palette
export const brandColors = {
  // Primary brand color (replacing #7C9885)
  primary: {
    50: '#f0f4f1',
    100: '#d6e4da', 
    200: '#b8d2be',
    300: '#98c0a1',
    400: '#7eb18b',
    500: '#7C9885', // Current primary
    600: '#6a8571',
    700: '#57705d',
    800: '#455b49',
    900: '#344535',
  },
  
  // Secondary/Accent color (replacing #C99383)
  secondary: {
    50: '#faf6f5',
    100: '#f2e6e2',
    200: '#e8d3cb',
    300: '#dcbeb4',
    400: '#d2aa9e',
    500: '#C99383', // Current secondary
    600: '#b8816f',
    700: '#a16f5c',
    800: '#855d48',
    900: '#654536',
  },
  
  // Neutral grays
  neutral: {
    50: '#f9fafb',
    100: '#f4f5f7',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#2d3748', // Current dark text
    900: '#1f2937',
  },
  
  // Status colors
  success: {
    50: '#f0f9f4',
    500: '#22c55e',
    600: '#16a34a',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  
  info: {
    50: '#f0f9ff',
    500: '#3b82f6',
    600: '#2563eb',
  }
} as const;

// Typography system
export const typography = {
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
} as const;

// Spacing system (8px base)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 80,
  '5xl': 96,
} as const;

// Border radius system
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
} as const;

// Shadows system
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// Ant Design theme configuration
export const antdTheme: ThemeConfig = {
  token: {
    // Color tokens
    colorPrimary: brandColors.primary[500],
    colorSuccess: brandColors.success[500],
    colorWarning: brandColors.warning[500], 
    colorError: brandColors.error[500],
    colorInfo: brandColors.info[500],
    
    // Background colors
    colorBgContainer: '#FEFCF3',
    colorBgElevated: '#ffffff',
    colorBgLayout: brandColors.neutral[50],
    colorBgSpotlight: brandColors.primary[50],
    colorBgBase: '#ffffff',
    
    // Text colors
    colorText: brandColors.neutral[800],
    colorTextSecondary: brandColors.neutral[600],
    colorTextTertiary: brandColors.neutral[500],
    colorTextQuaternary: brandColors.neutral[400],
    
    // Border colors
    colorBorder: brandColors.neutral[200],
    colorBorderSecondary: brandColors.neutral[100],
    
    // Typography
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontSizeHeading1: typography.fontSize['4xl'],
    fontSizeHeading2: typography.fontSize['3xl'],
    fontSizeHeading3: typography.fontSize['2xl'],
    fontSizeHeading4: typography.fontSize.xl,
    fontSizeHeading5: typography.fontSize.lg,
    fontWeightStrong: typography.fontWeight.semibold,
    
    // Spacing
    padding: spacing.md,
    paddingXS: spacing.xs,
    paddingSM: spacing.sm,
    paddingLG: spacing.lg,
    paddingXL: spacing.xl,
    
    margin: spacing.md,
    marginXS: spacing.xs,
    marginSM: spacing.sm,
    marginLG: spacing.lg,
    marginXL: spacing.xl,
    
    // Border radius
    borderRadius: borderRadius.md,
    borderRadiusLG: borderRadius.lg,
    borderRadiusXS: borderRadius.sm,
    borderRadiusSM: borderRadius.md,
    
    // Shadows
    boxShadow: shadows.base,
    boxShadowSecondary: shadows.sm,
    boxShadowTertiary: shadows.md,
    
    // Line height
    lineHeight: typography.lineHeight.normal,
    lineHeightHeading: typography.lineHeight.tight,
    
    // Animation - Removed delays for instant responsiveness
    motionDurationFast: '0s',
    motionDurationMid: '0s', 
    motionDurationSlow: '0s',
    motionEaseInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    motionEaseOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    
    // Z-index layers
    zIndexBase: 0,
    zIndexPopupBase: 1000,
  },
  
  components: {
    // Button theming
    Button: {
      borderRadius: borderRadius.lg,
      controlHeight: 44,
      controlHeightSM: 36,
      controlHeightLG: 52,
      paddingInline: spacing.lg,
      fontWeight: typography.fontWeight.semibold,
      primaryShadow: `0 4px 12px ${brandColors.primary[500]}33`,
    },
    
    // Input theming  
    Input: {
      borderRadius: borderRadius.md,
      controlHeight: 44,
      paddingInline: spacing.md,
      activeBorderColor: brandColors.primary[500],
      hoverBorderColor: brandColors.primary[300],
    },
    
    // Select theming
    Select: {
      borderRadius: borderRadius.md,
      controlHeight: 44,
      optionPadding: `${spacing.sm}px ${spacing.md}px`,
    },
    
    // Card theming
    Card: {
      borderRadius: borderRadius.xl,
      paddingLG: spacing['2xl'],
      boxShadow: shadows.sm,
      headerBg: 'transparent',
    },
    
    // Form theming
    Form: {
      labelFontSize: typography.fontSize.sm,
      labelColor: brandColors.neutral[700],
      labelRequiredMarkColor: brandColors.error[500],
      itemMarginBottom: spacing.lg,
    },
    
    // Typography theming
    Typography: {
      titleMarginTop: spacing.lg,
      titleMarginBottom: spacing.md,
    },
    
    // Modal theming
    Modal: {
      borderRadius: borderRadius.xl,
      paddingLG: spacing['2xl'],
    },
    
    // Alert theming  
    Alert: {
      borderRadius: borderRadius.lg,
      paddingContentHorizontal: spacing.lg,
      paddingContentVertical: spacing.md,
    },
    
    // Table theming
    Table: {
      borderRadius: borderRadius.lg,
      headerBg: brandColors.neutral[50],
      headerColor: brandColors.neutral[700],
    },
    
    // Menu theming
    Menu: {
      itemBorderRadius: borderRadius.md,
      subMenuItemBorderRadius: borderRadius.md,
      itemMarginBlock: spacing.xs / 2,
    },

    // Checkbox theming - Remove all delays
    Checkbox: {
      borderRadius: borderRadius.sm,
      size: 18,
      motionDurationFast: '0s',
      motionDurationMid: '0s',
      motionDurationSlow: '0s',
      // Override any transition properties
      transition: 'none',
    },

    // Radio theming - Remove all delays  
    Radio: {
      size: 18,
      dotSize: 8,
      motionDurationFast: '0s',
      motionDurationMid: '0s', 
      motionDurationSlow: '0s',
      // Override any transition properties
      transition: 'none',
    },
  },
  
  // CSS variables for custom styling
  cssVar: true,
};

// Utility functions for consistent color usage
export const getColorValue = (color: keyof typeof brandColors, shade: number = 500) => {
  return brandColors[color][shade as keyof typeof brandColors[typeof color]];
};

// Export semantic color classes for Tailwind usage
export const semanticColors = {
  primary: {
    bg: 'var(--ant-color-primary)',
    bgHover: 'var(--ant-color-primary-hover)',
    text: 'var(--ant-color-primary)',
    border: 'var(--ant-color-primary-border)',
  },
  secondary: {
    bg: getColorValue('secondary', 500),
    bgHover: getColorValue('secondary', 600),
    text: getColorValue('secondary', 500),
    border: getColorValue('secondary', 300),
  },
  success: {
    bg: 'var(--ant-color-success)',
    bgHover: 'var(--ant-color-success-hover)',
    text: 'var(--ant-color-success)', 
    border: 'var(--ant-color-success-border)',
  },
  warning: {
    bg: 'var(--ant-color-warning)',
    bgHover: 'var(--ant-color-warning-hover)',
    text: 'var(--ant-color-warning)',
    border: 'var(--ant-color-warning-border)',
  },
  error: {
    bg: 'var(--ant-color-error)',
    bgHover: 'var(--ant-color-error-hover)', 
    text: 'var(--ant-color-error)',
    border: 'var(--ant-color-error-border)',
  },
  neutral: {
    bg: 'var(--ant-color-bg-container)',
    bgSecondary: 'var(--ant-color-bg-layout)',
    text: 'var(--ant-color-text)',
    textSecondary: 'var(--ant-color-text-secondary)',
    border: 'var(--ant-color-border)',
  }
} as const;

// Form section configuration for vertical grouping
export const formSections = {
  spacing: {
    sectionGap: spacing['2xl'],
    fieldGap: spacing.lg,
    groupGap: spacing.xl,
  },
  
  styling: {
    sectionBorder: `1px solid ${brandColors.neutral[200]}`,
    sectionBorderRadius: borderRadius.xl,
    sectionPadding: spacing['2xl'],
    sectionBackground: brandColors.neutral[50],
    
    headerColor: brandColors.neutral[800],
    headerFontSize: typography.fontSize.xl,
    headerFontWeight: typography.fontWeight.semibold,
    
    descriptionColor: brandColors.neutral[600],
    descriptionFontSize: typography.fontSize.sm,
  }
} as const;

export default antdTheme;