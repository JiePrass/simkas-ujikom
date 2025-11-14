import { Platform } from "react-native";

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    // Existing colors
    text: "#11181C",
    subText: "#687076",
    background: "#fefefe",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: "#C9D8FF",
    secondary: "#a1b1da",

    // Additional UI system colors
    border: "#CCCCCC",
    card: "#fafafa",
    placeholder: "#888888",
    inputBackground: "#FFFFFF",
    error: "#E63946",
    success: "#27AE60",
    warning: "#F2C94C",
    disabled: "#E0E0E0",
    buttonTextPrimary: "#2b2b2b",
  },

  dark: {
    // Existing colors
    text: "#ECEDEE",
    subText: "#A1A8AD",
    background: "#1e1e1e",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,

    // Additional UI system colors
    border: "#333333",
    card: "#252525",
    placeholder: "#AAAAAA",
    inputBackground: "#2A2A2A",
    error: "#E57373",
    success: "#6FCF97",
    warning: "#F2C94C",
    disabled: "#555555",
    buttonTextPrimary: "#FFFFFF",
    primary: "#5EABD6",
    secondary: "#345366",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
