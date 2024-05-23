import { Paper, Typography, useTheme, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Center, Column } from '../../../../Layout';
import logo from '../../../../assets/logo.jpg'

const UserAdmission = ({ formTitle, to, message, FormContent }) => {
    const { palette: { mode } } = useTheme();

    return (
        <Grid sx={{width: '100%', height:'100%',display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor: '#a19595'}}>
        <   img src={logo} alt='logo' height='120px' width='120px' style={{alignSelf: 'center', margin: '10px'}}></img>
        
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
        </Grid>
    );
};

export default UserAdmission;