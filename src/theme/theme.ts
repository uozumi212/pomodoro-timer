import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// デフォルトテーマ
export const lightTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#ffffff",
        color: "#000000",
      },
    },
  },
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#ff6347",
  },
});

// ダークテーマ
export const darkTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#1a202c",
        color: "#ffffff",
      },
    },
  },
  colors: {
    background: "#1a202c",
    text: "#ffffff",
    primary: "#48bb78",
  },
});

// レトロテーマ
export const retroTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundColor: "#fdf6e3",
        color: "#657b83",
      },
    },
  },
  colors: {
    background: "#fdf6e3",
    text: "#657b83",
    primary: "#b58900",
  },
});

// 赤色のグラデーションテーマ
export const sunsetOradientTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundImage: "linear-gradient(to right, #ff9966, #ff5e62)",
        color: "#ffffff",
      },
    },
  },
  colors: {
    background: "linear-gradient(to right, #ff9966, #ff5e62)",
    text: "#ffffff",
    primary: "#ff5e62",
  },
});

// 青色のグラデーションテーマ
export const oceanGradientTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundImage: "linear-gradient(to right, #2980B9, #6DD5FA)",
        color: "#ffffff",
      },
    },
  },
  colors: {
    background: "linear-gradient(to right, #2980B9, #6DD5FA)",
    text: "#ffffff",
    primary: "#2980B9",
  },
});

// 黄色のグラデーションテーマ
export const yellowGradientTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundImage: "linear-gradient(to right, #F9D423, #FFCC00)",
        color: "#ffffff",
      },
    },
  },
  colors: {
    background: "linear-gradient(to right, #F9D423, #FFCC00)",
    text: "#ffffff",
    primary: "#F9D423",
  },
});

// 緑色のグラデーションテーマ
export const greenGradientTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundImage: "linear-gradient(to right, #A8D5BA, #71B280)",
        color: "#ffffff",
      },
    },
  },
  colors: {
    background: "linear-gradient(to right, #A8D5BA, #71B280)",
    text: "#ffffff",
    primary: "#71B280",
  },
});

// 紫色のグラデーションテーマ
export const purpleGradientTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundImage: "linear-gradient(to right, #654EA3, #EAAFC8)",
        color: "#ffffff",
      },
    },
  },
  colors: {
    background: "linear-gradient(to right, #654EA3, #EAAFC8)",
    text: "#ffffff",
    primary: "#654EA3",
  },
});

// スカイブルーのグラデーションテーマ
export const skyBlueGradientTheme = extendTheme({
  config,
  styles: {
    global: {
      "html, body": {
        backgroundImage: "linear-gradient(to right, #87CEEB, #B0E0E6)",
        color: "#ffffff",
      },
    },
  },
  colors: {
    background: "linear-gradient(to right, #87CEEB, #B0E0E6)",
    text: "#ffffff",
    primary: "#87CEEB",
  },
});
