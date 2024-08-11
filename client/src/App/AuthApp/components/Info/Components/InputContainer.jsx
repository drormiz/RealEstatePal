import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import { inputContainer } from '../styles';

const InputContainer = ({ question, handleInputChange, handleSubmit, loading }) => (
    <Box sx={inputContainer}>
        <TextField
            label="Ask a question"
            variant="outlined"
            fullWidth
            value={question}
            onChange={handleInputChange}
            sx={{
                mr: 2, borderRadius: '30px',
                '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                },
            }}
        />
        <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ borderRadius: '30px' }}
        >
            {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </Button>
    </Box>
);

export default InputContainer;
