import { experimental_extendTheme as extendTheme } from "@mui/material/styles"

import { MainFontFF, MonoFontFF } from "./fonts"
import {
  grey,
  greyLight,
  gradients,
  semantic,
  semanticLight,
  cssGradients,
  red,
  green,
} from "@/theme/colors"

// Declare custom palette options for TypeScript
declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["primary"]
    textHigh: string
    textMid: string
    textLow: string
    containerL0: string
    containerL3: string
    strokeLow: string
    streakUp: string
    gradientStart: string
    gradientEnd: string
  }
  interface PaletteOptions {
    accent?: PaletteOptions["primary"]
    textHigh?: string
    textMid?: string
    textLow?: string
    containerL0?: string
    containerL3?: string
    strokeLow?: string
    streakUp?: string
    gradientStart?: string
    gradientEnd?: string
  }
}

export const theme = extendTheme({
  breakpoints: {
    values: {
      xs: 0, // phones (portrait)
      sm: 600, // phones (landscape) / small tablets
      md: 900, // tablets
      lg: 1200, // laptop
      xl: 1536, // large desktop
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        mode: "dark",
        primary: {
          main: gradients.primaryStart,
          light: gradients.primaryEnd,
          dark: grey[1000],
          contrastText: grey[100],
        },
        secondary: {
          main: grey[200],
          light: grey[100],
          dark: grey[300],
        },
        error: {
          main: red[600],
          light: red[400],
          dark: red[800],
        },
        success: {
          main: green[600],
          light: green[400],
          dark: green[800],
        },
        warning: {
          main: semantic.warning,
        },
        info: {
          main: semantic.streakUp,
        },
        background: {
          default: grey[1000],
          paper: grey[800],
        },
        text: {
          primary: grey[100],
          secondary: grey[200],
          disabled: grey[400],
        },
        divider: semantic.divider,
        // Custom palette extensions
        // @ts-ignore - custom palette properties
        accent: {
          main: gradients.primaryStart,
          light: gradients.primaryEnd,
        },
        textHigh: semantic.textHigh,
        textMid: semantic.textMid,
        textLow: semantic.textLow,
        containerL0: semantic.containerL0,
        containerL3: semantic.containerL3,
        strokeLow: semantic.strokeLow,
        streakUp: semantic.streakUp,
        gradientStart: gradients.primaryStart,
        gradientEnd: gradients.primaryEnd,
      },
    },
    // Light mode - complete implementation
    light: {
      palette: {
        mode: "light",
        primary: {
          main: "#c4856d", // darker peach for light mode contrast
          light: "#b874a8", // darker purple for light mode
          dark: greyLight[300],
          contrastText: greyLight[1100],
        },
        secondary: {
          main: greyLight[200],
          light: greyLight[100],
          dark: greyLight[300],
        },
        error: {
          main: semanticLight.error,
          light: red[400],
          dark: red[700],
        },
        success: {
          main: semanticLight.success,
          light: green[400],
          dark: green[700],
        },
        warning: {
          main: semanticLight.warning,
        },
        info: {
          main: semanticLight.streakUp,
        },
        background: {
          default: greyLight[1000],
          paper: greyLight[1100],
        },
        text: {
          primary: greyLight[100],
          secondary: greyLight[200],
          disabled: greyLight[400],
        },
        divider: semanticLight.divider,
        // Custom palette extensions
        // @ts-ignore - custom palette properties
        accent: {
          main: "#c4856d",
          light: "#b874a8",
        },
        textHigh: semanticLight.textHigh,
        textMid: semanticLight.textMid,
        textLow: semanticLight.textLow,
        containerL0: semanticLight.containerL0,
        containerL3: semanticLight.containerL3,
        strokeLow: semanticLight.strokeLow,
        streakUp: semanticLight.streakUp,
        gradientStart: gradients.primaryStart,
        gradientEnd: gradients.primaryEnd,
      },
    },
  },
  typography: {
    fontFamily: MainFontFF,
    h1: {
      fontSize: "2.625rem", // 42px - large dashboard numbers
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h2: {
      fontSize: "1.875rem", // 30px - dashboard titles
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h3: {
      fontSize: "1.5rem", // 24px - modal titles
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem", // 20px - section headings
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem", // 18px - subheadings
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem", // 16px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "0.875rem", // 14px - primary body text
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.75rem", // 12px - secondary/small text
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem", // 12px
      lineHeight: 1.5,
      color: grey[300],
    },
    button: {
      fontSize: "0.875rem", // 14px
      fontWeight: 500,
      textTransform: "none" as const,
      lineHeight: 1.25,
    },
  },
  shape: {
    borderRadius: 6, // rounded-md equivalent
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "var(--mui-palette-background-default)",
          color: "var(--mui-palette-text-primary)",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--mui-palette-divider) var(--mui-palette-background-default)",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "var(--mui-palette-background-default)",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--mui-palette-divider)",
            borderRadius: "4px",
          },
        },
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        disableShrink: true,
      },
    },
    MuiTooltip: {
      defaultProps: {
        placement: "top",
        disableInteractive: true,
        enterDelay: 0,
        leaveDelay: 0,
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: "var(--mui-palette-containerL0)",
          border: "1px solid var(--mui-palette-divider)",
          borderRadius: "6px",
          padding: "12px 24px",
          fontSize: "0.875rem",
          color: "var(--mui-palette-text-secondary)",
          textAlign: "center",
          maxWidth: 400,
          fontFamily: MonoFontFF,
        },
        arrow: {
          color: "var(--mui-palette-containerL0)",
          "&::before": {
            border: "1px solid var(--mui-palette-divider)",
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "6px",
          padding: "5px 11px",
          boxShadow: "none !important",
          "&:active": {
            transform: "scale(0.98)",
          },
        },
        // Primary button - gradient border with gradient text
        contained: {
          position: "relative",
          background: cssGradients.buttonOuter,
          padding: "1px",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "1px",
            borderRadius: "5px",
            background: `var(--mui-palette-background-paper) ${cssGradients.buttonInner}`,
            backgroundBlendMode: "overlay",
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.05)",
          },
          "& .MuiButton-label, & > *": {
            position: "relative",
            zIndex: 1,
          },
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundImage: cssGradients.primary,
          "&:hover": {
            opacity: 0.9,
          },
        },
        containedPrimary: {
          "& .MuiButton-startIcon, & .MuiButton-endIcon": {
            color: gradients.primaryStart,
          },
        },
        // Secondary button - theme-aware background
        outlined: {
          backgroundColor: "var(--mui-palette-containerL3)",
          border: "none",
          boxShadow: "var(--button-secondary-shadow, 0px 0px 0px 1px rgba(0, 0, 0, 0.08))",
          color: "var(--mui-palette-text-secondary)",
          "&:hover": {
            backgroundColor: "var(--mui-palette-containerL3)",
            backgroundBlendMode: "overlay",
            border: "none",
            color: "var(--mui-palette-text-primary)",
          },
        },
        // Text button - minimal styling
        text: {
          color: "var(--mui-palette-text-secondary)",
          padding: "5px 11px",
          "&:hover": {
            backgroundColor: "var(--mui-palette-strokeLow)",
            color: "var(--mui-palette-text-primary)",
          },
        },
        sizeSmall: {
          padding: "4px 8px",
          fontSize: "0.75rem",
        },
        sizeLarge: {
          padding: "8px 16px",
          height: "52px",
          fontSize: "0.875rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-secondary)",
          "&:hover": {
            backgroundColor: "var(--mui-palette-strokeLow)",
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          padding: "12px 8px !important",
          minHeight: "unset !important",
          minWidth: "unset !important",
          color: "var(--mui-palette-text-secondary)",
          fontWeight: 400,
          fontSize: "0.875rem",
          "&.Mui-selected": {
            color: "var(--mui-palette-text-primary)",
            fontWeight: 500,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "unset !important",
          marginTop: "-12px",
          marginLeft: "-8px",
        },
        flexContainer: {
          gap: "16px",
        },
        indicator: {
          height: "2px",
          background: cssGradients.primary,
          borderRadius: "1px",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: "outlined",
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "var(--mui-palette-background-paper)",
          borderColor: "var(--mui-palette-strokeLow)",
          borderRadius: "6px",
        },
        outlined: {
          border: "1px solid var(--mui-palette-strokeLow)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-background-paper)",
          border: "1px solid var(--mui-palette-divider)",
          borderRadius: "6px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--mui-palette-background-default)",
            borderRadius: "6px",
            "& fieldset": {
              borderWidth: "1px",
              borderColor: "var(--mui-palette-divider)",
            },
            "&:hover fieldset": {
              borderColor: "var(--mui-palette-text-disabled)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--mui-palette-primary-main)",
              borderWidth: "1px",
            },
          },
          "& .MuiInputBase-input": {
            color: "var(--mui-palette-text-secondary)",
            padding: "12px 24px",
            fontSize: "0.875rem",
            "&::placeholder": {
              color: "var(--mui-palette-text-disabled)",
              opacity: 1,
            },
            "&:focus": {
              color: "var(--mui-palette-text-primary)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "var(--mui-palette-textLow)",
            fontSize: "0.75rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-background-default)",
          "& fieldset": {
            borderColor: "var(--mui-palette-divider)",
          },
          "&:hover fieldset": {
            borderColor: "var(--mui-palette-text-disabled)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "var(--mui-palette-primary-main)",
          },
        },
        input: {
          color: "var(--mui-palette-text-secondary)",
          "&::placeholder": {
            color: "var(--mui-palette-text-disabled)",
            opacity: 1,
          },
        },
      },
    },
    MuiTableRow: {
      defaultProps: {
        hover: true,
      },
      styleOverrides: {
        root: {
          borderTop: "1px solid var(--mui-palette-divider)",
          "&:hover": {
            backgroundColor: "var(--mui-palette-containerL3) !important",
          },
        },
        head: {
          borderTop: "none",
          "&:hover": {
            backgroundColor: "transparent !important",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          paddingTop: "16px",
          paddingBottom: "16px",
          paddingLeft: "24px",
          paddingRight: "24px",
          borderBottom: "none",
          color: "var(--mui-palette-textLow)",
        },
        head: {
          backgroundColor: "var(--mui-palette-containerL0)",
          color: "var(--mui-palette-textLow)",
          fontWeight: 500,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          position: "sticky",
          top: 0,
          zIndex: 10,
        },
        body: {
          fontFamily: MonoFontFF,
          color: "var(--mui-palette-textLow)",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-containerL0)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          fontWeight: 400,
          fontSize: "0.75rem",
        },
        filled: {
          backgroundColor: "var(--mui-palette-containerL3)",
          color: "var(--mui-palette-text-primary)",
        },
        outlined: {
          borderColor: "var(--mui-palette-divider)",
          color: "var(--mui-palette-text-secondary)",
        },
        // Success chip styling
        colorSuccess: {
          backgroundColor: "rgba(61, 183, 194, 0.1)",
          borderColor: "rgba(61, 183, 194, 0.56)",
          color: "var(--mui-palette-streakUp)",
        },
        // Error chip styling
        colorError: {
          backgroundColor: "rgba(219, 67, 84, 0.1)",
          borderColor: "rgba(219, 67, 84, 0.56)",
          color: "var(--mui-palette-error-main)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "var(--mui-palette-background-paper)",
          border: "1px solid var(--mui-palette-strokeLow)",
          borderRadius: "12px",
          backgroundImage: "none",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-containerL3)",
          borderBottom: "1px solid var(--mui-palette-strokeLow)",
          padding: "12px 32px",
          fontSize: "1rem",
          fontWeight: 500,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "32px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-containerL0)",
          padding: "16px 32px 32px",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: "30px",
          height: "18px",
          padding: 0,
        },
        switchBase: {
          padding: "2px",
          "&.Mui-checked": {
            transform: "translateX(12px)",
            "& + .MuiSwitch-track": {
              backgroundColor: "var(--mui-palette-success-main)",
              opacity: 1,
            },
            "& .MuiSwitch-thumb": {
              backgroundColor: "var(--mui-palette-background-default)",
            },
          },
        },
        thumb: {
          width: "12px",
          height: "12px",
          backgroundColor: "var(--mui-palette-text-primary)",
          boxShadow: "none",
        },
        track: {
          borderRadius: "9px",
          backgroundColor: "var(--mui-palette-containerL3)",
          opacity: 1,
          border: "1px solid var(--mui-palette-strokeLow)",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          borderRadius: "12px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-divider)",
          },
        },
        select: {
          color: "var(--mui-palette-text-secondary)",
          padding: "16px 40px 16px 16px",
        },
        icon: {
          color: "var(--mui-palette-text-secondary)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "var(--mui-palette-containerL0)",
          border: "1px solid var(--mui-palette-divider)",
          borderRadius: "6px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: "var(--mui-palette-text-secondary)",
          padding: "8px 12px",
          "&:hover": {
            backgroundColor: "var(--mui-palette-containerL3)",
          },
          "&.Mui-selected": {
            backgroundColor: "var(--mui-palette-containerL3)",
            "&:hover": {
              backgroundColor: "var(--mui-palette-containerL3)",
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "var(--mui-palette-divider)",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "var(--mui-palette-text-secondary)",
          textDecoration: "none",
          "&:hover": {
            color: "var(--mui-palette-text-primary)",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-containerL3)",
          borderRadius: "4px",
        },
        bar: {
          background: cssGradients.primary,
          borderRadius: "4px",
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--mui-palette-containerL3)",
        },
      },
    },
  },
})
