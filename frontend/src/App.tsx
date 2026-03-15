import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useThemeStore } from './stores';
import { lightThemeResponsive, darkThemeResponsive } from './theme';
import { zhCN } from '@mui/material/locale';

const App: React.FC = () => {
  const { mode } = useThemeStore();

  // 根据模式选择主题
  const theme = React.useMemo(
    () =>
      mode === 'light'
        ? createTheme(lightThemeResponsive, zhCN)
        : createTheme(darkThemeResponsive, zhCN),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;