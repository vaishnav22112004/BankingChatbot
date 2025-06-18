import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatbotProps {
  step: number;
  userData: {
    panVerified: boolean;
    faceVerified: boolean;
    phoneVerified: boolean;
    panNumber: string;
    phoneNumber: string;
  };
}

const Chatbot: React.FC<ChatbotProps> = ({ step, userData }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastStep, setLastStep] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const hasWelcomed = useRef(false);

  useEffect(() => {
    if (!hasWelcomed.current && messages.length === 0) {
      addBotMessage("Hello! I'm your bank account opening assistant. Let's get started with the verification process.");
      addBotMessage("Please verify your PAN card by uploading a photo or entering the number manually.");
      hasWelcomed.current = true;
  }
}, []);

  useEffect(() => {
    // Only send message if step has changed
    if (step !== lastStep) {
      setLastStep(step);
      
      switch (step) {
        
        case 2:
          addBotMessage("Now, let's verify your identity by matching your face with the PAN card photo.");
          break;
        case 3:
          addBotMessage("Finally, please enter your phone number to receive an OTP for verification.");
          break;
        case 4:
          addBotMessage(`All verifications complete! Your account will be activated within 24 hours. PAN: ${userData.panNumber}, Phone: ${userData.phoneNumber}`);
          break;
      }
    }
  }, [step, userData]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { text, sender: 'bot', timestamp: new Date() }]);
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, sender: 'user', timestamp: new Date() }]);
      setInput('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Please follow the steps shown on the screen to complete your account opening.");
      }, 1000);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2, height: '400px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Bank Account Opening Assistant
      </Typography>
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 1,
                maxWidth: '70%',
                backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#f5f5f5',
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {message.timestamp.toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <CircularProgress size={20} />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
          disabled={!input.trim()}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chatbot; 