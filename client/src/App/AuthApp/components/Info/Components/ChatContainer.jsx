import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

import { chatContainer, messageContainer } from '../styles';

const ChatContainer = ({ chatHistory }) => {
    const chatEndRef = useRef(null);
    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    return (
        <Box sx={chatContainer}>
            {chatHistory.map((message, index) => (
                <Box key={index} sx={messageContainer(message.isUser)}>
                    <Typography variant={'body1'}>{message.text}</Typography>
                </Box>
            ))}
            <div ref={chatEndRef} />
        </Box>
    );
};

export default ChatContainer;
