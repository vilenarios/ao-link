export const truncateId = (text: string) => {
  if (!text || text.length <= 16) return text
  return text.slice(0, 8) + "..." + text.slice(-8)
}

export function hashString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

export const TYPE_ICON_MAP: Record<string, any> = {
  Message: "/message.svg",
  Module: "/article.svg",
}

// Colors that work in both light and dark modes
// Medium-saturation colors provide good contrast with both dark and white text
export const TYPE_COLOR_MAP: Record<string, string> = {
  Module: "#8858a8", // medium purple
  Assignment: "#a85858", // medium rose
  Checkpoint: "#489098", // medium teal
  Process: "#5878a8", // medium blue
  Message: "#58a870", // medium green
  Owner: "#a87858", // medium coral/orange
  Block: "#a89858", // medium gold
  Entity: "#707078", // medium grey
  Token: "#a89040", // medium gold
  ArNS: "#489898", // medium cyan
  User: "#a87858", // medium coral (same as Owner)
}

export const TYPE_PATH_MAP: Record<string, string> = {
  Module: "module",
  Assignment: "message",
  Checkpoint: "message",
  Process: "entity",
  Message: "message",
  Owner: "entity",
  Block: "block",
  Entity: "entity",
  Token: "token",
  ArNS: "arns",
  User: "entity",
}
