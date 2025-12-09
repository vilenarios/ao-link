/**
 * AR.IO Network Portal Design Tokens
 * Color palette matching the ar.io network portal styling
 */

// Grey scale - primary palette for dark mode backgrounds and text
export const grey = {
  100: "#cacad6", // text-high - primary text color (dark mode)
  200: "#a3a3ad", // text-mid - secondary text color
  300: "#7f7f87", // text-low - tertiary/muted text
  400: "#3b3b45", // borders, scrollbar thumb
  500: "#303038", // card borders, dividers
  600: "#262629", // medium backgrounds
  700: "#212124", // button backgrounds, containers
  800: "#1e1e24", // card/paper backgrounds (containerL3)
  900: "#1c1c1f", // darker backgrounds
  1000: "#0e0e0f", // main background (darkest usable)
  1100: "#050505", // near black, shadows
} as const

// Light mode grey scale - inverted for light backgrounds
export const greyLight = {
  100: "#1a1a1f", // text-high - primary text color (light mode)
  200: "#3d3d47", // text-mid - secondary text color
  300: "#5c5c66", // text-low - tertiary/muted text
  400: "#8a8a94", // borders, subtle elements
  500: "#b5b5bf", // card borders, dividers
  600: "#d4d4de", // medium backgrounds
  700: "#e8e8f0", // button backgrounds, containers
  800: "#f0f0f5", // card/paper backgrounds
  900: "#f5f5f8", // lighter backgrounds
  1000: "#fafafa", // main background (lightest usable)
  1100: "#ffffff", // pure white
} as const

// Neutrals - pure black/white
export const neutrals = {
  100: "#ffffff",
  1100: "#000000",
} as const

// Transparent variants of grey-100 (light text color with opacity)
export const transparent100 = {
  64: "rgba(202, 202, 214, 0.64)",
  32: "rgba(202, 202, 214, 0.32)",
  16: "rgba(202, 202, 214, 0.16)",
  12: "rgba(202, 202, 214, 0.12)",
  8: "rgba(202, 202, 214, 0.08)", // stroke-low, subtle borders
  4: "rgba(202, 202, 214, 0.04)",
} as const

// Transparent variants of grey-1100 (dark with opacity)
export const transparent900 = {
  64: "rgba(5, 5, 5, 0.64)",
  32: "rgba(5, 5, 5, 0.32)",
  16: "rgba(5, 5, 5, 0.16)",
  12: "rgba(5, 5, 5, 0.12)",
  8: "rgba(5, 5, 5, 0.08)",
  4: "rgba(5, 5, 5, 0.04)",
} as const

// Red scale - errors, alerts
export const red = {
  100: "#ffebea",
  200: "#fbc4c2",
  300: "#f8b0af",
  400: "#f39c9c",
  500: "#e97377",
  600: "#db4354", // text-red, primary error color
  700: "#a73742",
  800: "#752b30",
  900: "#471e1f",
  1000: "#311717",
  1100: "#1d0f0e",
} as const

// Green scale - success states
export const green = {
  100: "#eaf4f5",
  200: "#c1dee1",
  300: "#add4d8",
  400: "#82bec4",
  500: "#52a9b1",
  600: "#349fa8", // success color
  700: "#2d7980",
  800: "#25555a",
  900: "#1b3437",
  1000: "#162526",
  1100: "#0e1617",
} as const

// Gradient colors - primary accent (peach to purple)
export const gradients = {
  primaryStart: "#F7C3A1", // warm peach
  primaryEnd: "#DF9BE8", // purple/mauve
  redStart: "#FFB4B4", // light red
  redEnd: "#FF6C6C", // coral red
} as const

// Button-specific colors
export const button = {
  primary: {
    base: "#0e0e0f",
    gradientStart: "rgba(102, 102, 102, 0.06)",
    gradientEnd: "rgba(0, 0, 0, 0.06)",
    outerGradientStart: "#EEB3BFA3", // peach with alpha
    outerGradientEnd: "#DF9BE808", // purple with alpha
  },
  secondary: {
    default: "#212124",
    shadow: "0px 0px 0px 1px #050505, 0px 1px 0px 0px rgba(86, 86, 86, 0.25) inset",
  },
} as const

// Semantic color tokens
export const semantic = {
  // Text hierarchy
  textHigh: grey[100],
  textMid: grey[200],
  textLow: grey[300],

  // Backgrounds
  background: grey[1000],
  containerL0: "#09090A", // darkest container
  containerL3: grey[800],

  // Borders
  divider: "#232329",
  strokeLow: transparent100[8],

  // Status colors
  error: red[600],
  success: green[600],
  warning: "#ffb938",
  streakUp: "#3DB7C2", // cyan - positive indicators

  // Links
  link: grey[200],
} as const

// CSS gradient strings
export const cssGradients = {
  primary: `linear-gradient(88deg, ${gradients.primaryStart} 0%, ${gradients.primaryEnd} 100%)`,
  primaryVertical: `linear-gradient(180deg, ${gradients.primaryStart} 0%, ${gradients.primaryEnd} 100%)`,
  red: `linear-gradient(88deg, ${gradients.redStart} 0%, ${gradients.redEnd} 100%)`,
  buttonOuter: `linear-gradient(180deg, ${button.primary.outerGradientStart} 0%, ${button.primary.outerGradientEnd} 100%)`,
  buttonInner: `linear-gradient(180deg, ${button.primary.gradientStart} 0%, ${button.primary.gradientEnd} 100%)`,
} as const

// Transparent variants of dark color (for light mode borders/shadows)
export const transparentDark = {
  64: "rgba(26, 26, 31, 0.64)",
  32: "rgba(26, 26, 31, 0.32)",
  16: "rgba(26, 26, 31, 0.16)",
  12: "rgba(26, 26, 31, 0.12)",
  8: "rgba(26, 26, 31, 0.08)",
  4: "rgba(26, 26, 31, 0.04)",
} as const

// Light mode semantic tokens
export const semanticLight = {
  // Text hierarchy (dark text on light bg)
  textHigh: greyLight[100],
  textMid: greyLight[200],
  textLow: greyLight[300],

  // Backgrounds (light)
  background: greyLight[1000],
  containerL0: greyLight[1100], // lightest container (white)
  containerL3: greyLight[800],

  // Borders
  divider: greyLight[500],
  strokeLow: transparentDark[8],

  // Status colors (slightly adjusted for light bg contrast)
  error: "#c93545", // slightly darker red for contrast
  success: "#2d8a92", // slightly darker green for contrast
  warning: "#d9a020", // slightly darker yellow for contrast
  streakUp: "#2a9da8", // slightly darker cyan for contrast

  // Links
  link: greyLight[200],
} as const

// Light mode button colors
export const buttonLight = {
  primary: {
    base: greyLight[1100],
    gradientStart: "rgba(200, 200, 200, 0.15)",
    gradientEnd: "rgba(255, 255, 255, 0.15)",
    outerGradientStart: "#EEB3BFA3",
    outerGradientEnd: "#DF9BE820",
  },
  secondary: {
    default: greyLight[700],
    shadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.08), 0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
  },
} as const

// Export all tokens as a single object for convenience
export const tokens = {
  grey,
  greyLight,
  neutrals,
  transparent100,
  transparent900,
  transparentDark,
  red,
  green,
  gradients,
  button,
  buttonLight,
  semantic,
  semanticLight,
  cssGradients,
} as const

export default tokens
