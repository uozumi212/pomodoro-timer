import { extendTheme } from '@chakra-ui/react';

export const lightTheme = extendTheme({
  colors: {
    background: '#ffffff',
    text: '#000000',
    primary: '#ff6347',
  },
});

export const darkTheme = extendTheme({
  colors: {
    background: '#1a202c',
    text: '#ffffff',
    primary: '#48bb78',
  },
});

export const retroTheme = extendTheme({
  colors: {
    background: '#fdf6e3',
    text: '#657b83',
    primary: '#b58900',
  },
});
