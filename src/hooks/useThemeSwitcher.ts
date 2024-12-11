import { useEffect } from "react";
import { lightTheme, darkTheme, retroTheme, sunsetOradientTheme, oceanGradientTheme, yellowGradientTheme, greenGradientTheme, purpleGradientTheme, skyBlueGradientTheme } from '../theme/theme';
import { ThemeOverride } from "@chakra-ui/react";


const useThemeSwitcher = (currentTheme: string, setTheme: (thme: ThemeOverride) => void) => {
  // テーマ変更のための処理
  useEffect(() => {
    switch (currentTheme) {
      case 'light':
        setTheme(lightTheme);
        break;
      case 'dark':
        setTheme(darkTheme);
        break;
      case 'retro':
        setTheme(retroTheme);
        break;
      case 'sunset':
        setTheme(sunsetOradientTheme);
        break;
      case 'ocean':
        setTheme(oceanGradientTheme);
        break;
      case 'yellow':
        setTheme(yellowGradientTheme);
        break;
      case 'green':
        setTheme(greenGradientTheme);
        break;
      case 'purple':
        setTheme(purpleGradientTheme);
        break;
      case 'skyBlue':
        setTheme(skyBlueGradientTheme);
        break;
    }
  }, [currentTheme, setTheme]);
};

export default useThemeSwitcher;
