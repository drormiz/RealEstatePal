import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import { inputContainer } from '../styles';

const InputContainer = ({
  question,
  handleInputChange,
  handleSubmit,
  loading
}) => (
  <Box sx={inputContainer}>
    <TextField
      label='Ask a question'
      variant='outlined'
      fullWidth
      value={question}
      onChange={handleInputChange}
      sx={{
        mr: 2,
        borderRadius: '20px',
        backgroundColor: '#F7F7F7',
        '& .MuiOutlinedInput-root': {
          borderRadius: '20px'
        },
        '& .MuiInputLabel-root': {
          color: '#B0B0B0',
          fontFamily: 'Cereal, sans-serif'
        }
      }}
    />
    <Button
      variant='contained'
      color='primary'
      onClick={handleSubmit}
      disabled={loading}
      sx={{
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        minWidth: 'unset',
        backgroundColor: '#2193b0',
        '&:hover': {
          backgroundColor: '#176785'
        },
        boxShadow: '0px 4px 12px rgba(33, 147, 176, 0.4)'
      }}>
      {loading ? <CircularProgress size={24} /> : <SendIcon />}
    </Button>
  </Box>
);

export default InputContainer;
