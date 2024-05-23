import { Box } from '@mui/material';

export const Column = ({ children, sx, ...props }) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        ...sx
    }}
        {...props}>
        {children}
    </Box>
);