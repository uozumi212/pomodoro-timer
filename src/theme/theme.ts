import { extendTheme } from '@chakra-ui/react';

// デフォルトテーマ
export const lightTheme = extendTheme({
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#ff6347',
  },
});

// ダークテーマ
export const darkTheme = extendTheme({
  colors: {
    background: '#1a202c',
    text: '#ffffff',
    primary: '#48bb78',
  },
});

// レトロテーマ
export const retroTheme = extendTheme({
  colors: {
    background: '#fdf6e3',
    text: '#657b83',
    primary: '#b58900',
  },
});

// 赤色のグラデーションテーマ
export const sunsetOradientTheme = extendTheme({
  colors: {
    background: 'linear-gradient(to right, #ff9966, #ff5e62)',
    text: '#ffffff',
    primary: '#ff5e62',
  },
});

// 青色のグラデーションテーマ
export const oceanGradientTheme = extendTheme({
  colors: {
      background: 'linear-gradient(to right, #2980B9, #6DD5FA)',
      text: '#ffffff',
      primary: '#2980B9',
  },
});

// 黄色のグラデーションテーマ
export const yellowGradientTheme = extendTheme({
  colors: {
    background: 'linear-gradient(to right, #F9D423, #FFCC00)',
    text: '#ffffff',
    primary: '#F9D423',
  },
});

// 緑色のグラデーションテーマ
export const greenGradientTheme = extendTheme({
  colors: {
    background: 'linear-gradient(to right, #A8D5BA, #71B280)',
    text: '#ffffff',
    primary: '#71B280',
  },
});

// 紫色のグラデーションテーマ
export const purpleGradientTheme = extendTheme({
  colors: {
    background: 'linear-gradient(to right, #654EA3, #EAAFC8)',
    text: '#ffffff',
    primary: '#654EA3',
  },
});

// 緑色のグラデーションテーマ
export const skyBlueGradientTheme = extendTheme({
  colors: {
    background: 'linear-gradient(to right, #87CEEB, #B0E0E6)',
    text: '#ffffff',
    primary: '#71B280',
  },
});
