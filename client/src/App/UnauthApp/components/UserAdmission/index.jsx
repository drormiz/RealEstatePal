import { Paper, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { Center, Column } from '../../../../Layout';

const UserAdmission = ({ formTitle, to, message, FormContent }) => {
    const { palette: { mode } } = useTheme();

    return (
        <Paper elevation={5} sx={{ width: 400, padding: 2 }}>
            <Column sx={{ gap: 2, alignItems: 'center' }}>
                <Typography fontSize={30}>{formTitle}</Typography>
                <FormContent />
                <Center>
                    <Link to={to} style={{ color: mode === 'light' ? 'black' : 'white' }}>
                        <Typography sx={{ fontSize: 14 }}>
                            {message}
                        </Typography>
                    </Link>
                </Center>
            </Column>
        </Paper>
    );
};

export default UserAdmission;