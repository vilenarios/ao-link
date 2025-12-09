import { hashString } from "./data-utils"

// Colors for dynamic tag coloring that work in both light and dark modes
// These are medium-saturation colors that provide good contrast with both
// dark text (dark mode) and white text (light mode)
export function getColorFromText(text: string) {
  const colors: Record<string, string> = {
    red: "#a85858", // medium rose
    blue: "#5878a8", // medium blue
    green: "#58a870", // medium green
    lime: "#70a858", // medium lime
    yellow: "#a89858", // medium yellow/gold
    purple: "#8858a8", // medium purple
    indigo: "#5858a8", // medium indigo
    cyan: "#489098", // medium cyan
    pink: "#a85888", // medium pink
    orange: "#a87858", // medium orange
  }

  const colorKeys = Object.keys(colors)
  const hash = hashString(text)
  const colorIndex = Math.abs(hash) % colorKeys.length
  return colors[colorKeys[colorIndex]]
}
