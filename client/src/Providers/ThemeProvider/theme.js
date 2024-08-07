const lightTheme = {
  palette: {
    mode: 'light',
    primary: {
      main: '#071952'
    },
    secondary: {
      main: '#0B666A'
    },
    background: {
      // default: '#35A29F',
      // paper: '#CBF1F5'
    }
  }
};

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#03C988'
    },
    secondary: {
      main: '#13005A'
    }
  }
};

export const getTheme = mode => ({
  ...(mode === 'light' ? lightTheme : darkTheme),
  typography: {
    fontFamily: [
      'Assistant',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '4px 8px 4px 0'
        }
      }
    },
    MuiCollapse: {
      styleOverrides: {
        wrapper: { width: '100%' },
        wrapperInner: { width: '100%' }
      }
    }
  }
});
