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

const ChatBox = ({ statuses, handleSendMessage, isOwner }) => {
  const [messages, setMessages] = useState(statuses);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Update local messages state when statuses prop changes
    setMessages(statuses);
  }, [statuses]);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box sx={{ width: '100%', maxWidth: 500, mx: 'auto', mt: 3 }}>
      {messages.length ? (
        <Paper elevation={3} sx={{ maxHeight: 140, overflowY: 'auto', p: 2 }}>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index} sx={{ mb: 1 }}>
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
                  <Typography variant="body1">
                    {message}
                  </Typography>
                </Box>
              </ListItem>
            ))}
            <div ref={chatEndRef} />
          </List>
        </Paper>
      ) : (
        <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          There are no statuses yet
        </Typography>
      )}
      {isOwner && (
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
            onClick={async () => {
              await handleSendMessage(newMessage);
              setNewMessage(''); // Clear the input field after sending
            }}
            sx={{ ml: 2 }}
          >
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;
