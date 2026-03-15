import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { zhCN } from '@mui/material/locale';

// 品牌颜色
const brandColors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#fff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#fff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#fff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#fff',
  },
};

// 浅色主题
const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: brandColors.primary,
      secondary: brandColors.secondary,
      success: brandColors.success,
      warning: brandColors.warning,
      error: brandColors.error,
      background: {
        default: '#f4f6f8',
        paper: '#ffffff',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#5a5a5a',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Microsoft YaHei", "PingFang SC", sans-serif',
      h1: {
        fontWeight: 600,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0,0,0,0.05)',
      '0px 4px 8px rgba(0,0,0,0.08)',
      '0px 6px 12px rgba(0,0,0,0.1)',
      '0px 8px 16px rgba(0,0,0,0.12)',
      '0px 10px 20px rgba(0,0,0,0.14)',
      '0px 12px 24px rgba(0,0,0,0.16)',
      '0px 14px 28px rgba(0,0,0,0.18)',
      '0px 16px 32px rgba(0,0,0,0.2)',
      ...Array(16).fill('0px 4px 8px rgba(0,0,0,0.08)'),
    ] as any,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
            },
          },
          contained: {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: '4px 0px 12px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '4px 8px',
          },
        },
      },
    },
  },
  zhCN
);

// 深色主题
const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: brandColors.primary,
      secondary: brandColors.secondary,
      success: brandColors.success,
      warning: brandColors.warning,
      error: brandColors.error,
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0b0b0',
      },
    },
    typography: lightTheme.typography,
    shape: lightTheme.shape,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 24px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: '4px 8px',
          },
        },
      },
    },
  },
  zhCN
);

// 响应式字体
export const lightThemeResponsive = responsiveFontSizes(lightTheme);
export const darkThemeResponsive = responsiveFontSizes(darkTheme);

export { lightTheme, darkTheme };