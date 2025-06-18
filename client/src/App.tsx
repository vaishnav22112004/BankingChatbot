import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Chatbot from './components/Chatbot';
import FaceVerification from './components/FaceVerification';
import PanVerification from './components/PanVerification';
import PhoneVerification from './components/PhoneVerification';
import ApplicationSummary from './components/ApplicationSummary';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    faceVerified: false,
    panVerified: false,
    phoneVerified: false,
    panNumber: '',
    phoneNumber: '',
    panImage: null as string | null,
  });

  const handleStepComplete = (stepName: string, data: any) => {
    setUserData(prev => ({
      ...prev,
      [stepName]: true,
      ...data
    }));
    setStep(prev => prev + 1);
  };

  const isApplicationComplete = userData.faceVerified && userData.panVerified && userData.phoneVerified;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Chatbot step={step} userData={userData} />
          {step === 1 && (
            <PanVerification onComplete={(data) => handleStepComplete('panVerified', data)} />
          )}
          {step === 2 && (
            <FaceVerification 
              onComplete={(data) => handleStepComplete('faceVerified', data)}
              panImage={userData.panImage}
            />
          )}
          {step === 3 && (
            <PhoneVerification onComplete={(data) => handleStepComplete('phoneVerified', data)} />
          )}
          {isApplicationComplete && (
            <ApplicationSummary userData={userData} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 