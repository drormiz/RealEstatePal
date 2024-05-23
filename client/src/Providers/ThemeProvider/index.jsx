import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { getTheme } from './theme';

const ColorModeContext = createContext({ toggleColorMode: () => { } });

const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState('light');
    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
    }), [mode]);

    const theme = useMemo(() => createTheme(getTheme(mode)), [mode]);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ColorModeContext.Provider>
    );
}

export const useColorMode = () => useContext(ColorModeContext);

export default ThemeProvider;