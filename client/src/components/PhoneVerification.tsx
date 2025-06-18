import React, { useState } from 'react';
import { Box, Button, Paper, Typography, TextField } from '@mui/material';
import axios from 'axios';

interface PhoneVerificationProps {
  onComplete: (data: any) => void;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ onComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber.match(/^[0-9]{10}$/)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/verify-phone', {
        phoneNumber
      });

      if (response.data.success) {
        setOtpSent(true);
        alert('OTP sent successfully!');
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.match(/^[0-9]{6}$/)) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post('http://localhost:5000/api/verify-otp', {
        phoneNumber,
        otp
      });

      if (response.data.success) {
        onComplete({ phoneVerified: true, phoneNumber });
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error verifying OTP. Please try again.');
    }
    setIsVerifying(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Phone Number Verification
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Phone Number"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 10-digit mobile number"
          inputProps={{ maxLength: 10 }}
          disabled={otpSent}
        />
        {!otpSent ? (
          <Button
            variant="contained"
            onClick={handleSendOTP}
            disabled={!phoneNumber || phoneNumber.length !== 10}
          >
            Send OTP
          </Button>
        ) : (
          <>
            <TextField
              label="OTP"
              variant="outlined"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              inputProps={{ maxLength: 6 }}
            />
            <Button
              variant="contained"
              onClick={handleVerifyOTP}
              disabled={!otp || otp.length !== 6 || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default PhoneVerification; 