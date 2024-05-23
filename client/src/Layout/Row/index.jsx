import { Box } from '@mui/material';

export const Row = ({ children, sx, ...props }) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        ...sx
    }}
        {...props}>
        {children}
    </Box>
);