import { Box } from '@mui/material';

export const Center = ({ children, sx, ...props }) => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...sx
    }}
        {...props}>
        {children}
    </Box>
);