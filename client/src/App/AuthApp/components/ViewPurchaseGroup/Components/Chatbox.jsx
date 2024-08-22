import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
} from '@mui/material';

const ChatBox = ({ statuses }) => {
  const [messages, setMessages] = useState(statuses);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mt: 3 }}>
      <Paper elevation={3} sx={{ maxHeight: 140, overflowY: 'auto', p: 2 }}>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} sx={{ justifyContent: 'flex-start' }}>
              <Box
                sx={{
                  bgcolor: '#dcf8c6', // WhatsApp-like green bubble
                  color: '#000',
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '75%',
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1">{message}</Typography>
              </Box>
            </ListItem>
          ))}
          <div ref={chatEndRef} />
        </List>
      </Paper>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          variant="outlined"
          fullWidth
          placeholder="Type your message..."
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ ml: 2 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;