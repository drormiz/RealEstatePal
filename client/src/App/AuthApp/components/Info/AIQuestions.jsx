import { useState } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';

import ChipsContainer from './Components/ChipsContainer';
import ChatContainer from './Components/ChatContainer';
import InputContainer from './Components/InputContainer';
import { chatBox } from './styles';
import { env } from '../../../../env';
import { realEstateTerms } from './realEstateKeywords';
import validateUserMessage from './utils/validateMessage';

const apiKey = env.geminiKey;

const AIQuestions = () => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedChip, setSelectedChip] = useState(null);

    const handleChipClick = ({ term, response }) => {
        setSelectedChip(term);
        setChatHistory([...chatHistory, { text: term, isUser: true }, { text: response, isUser: false }]);
    };

    const handleInputChange = (event) => {
        setQuestion(event.target.value);
    };

    const handleSubmit = async () => {
        if (!question.trim()) return;

        const validation = validateUserMessage(question);
        if (!validation.isValid) {
            setChatHistory([...chatHistory, { text: validation.message, isUser: false }]);

            return;
        }

        const userMessage = { text: question, isUser: true };
        setChatHistory([...chatHistory, userMessage]);

        setLoading(true);
        setQuestion('');

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Answer or explain about the following question or term or terms in short: ${question}`,
                                },
                            ],
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            const generatedAnswer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no answer was generated.';
            const answer = generatedAnswer.replaceAll('*', '\n');
            setChatHistory([...chatHistory, userMessage, { text: answer, isUser: false }]);
        } catch (error) {
            console.error('Error fetching the answer:', error);
            setChatHistory([...chatHistory, userMessage, { text: 'Sorry, something went wrong.', isUser: false }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={chatBox}>
            <ChipsContainer terms={realEstateTerms} selectedChip={selectedChip} handleChipClick={handleChipClick} />
            <ChatContainer chatHistory={chatHistory} />
            <InputContainer
                question={question}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                loading={loading}
            />
        </Box>
    );
};

export default AIQuestions;
