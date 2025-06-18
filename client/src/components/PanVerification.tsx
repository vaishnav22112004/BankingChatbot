import React, { useState } from 'react';
import { Box, Button, Paper, Typography, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

interface PanVerificationProps {
  onComplete: (data: any) => void;
}

const PanVerification: React.FC<PanVerificationProps> = ({ onComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [panNumber, setPanNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Create preview URL for the image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('panImage', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/api/process-pan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.panNumber) {
        setPanNumber(response.data.panNumber);
        onComplete({ 
          panVerified: true, 
          panNumber: response.data.panNumber,
          panImage: previewUrl // Pass the preview URL for face matching
        });
      } else {
        alert('Could not extract PAN number. Please try again or enter manually.');
      }
    } catch (error) {
      console.error('Error processing PAN card:', error);
      alert('Error processing PAN card. Please try again.');
    }

    setIsProcessing(false);
  };

  const handleManualSubmit = () => {
    if (panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      onComplete({ 
        panVerified: true, 
        panNumber,
        panImage: previewUrl // Pass the preview URL for face matching
      });
    } else {
      alert('Please enter a valid PAN number');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        PAN Card Verification
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="pan-upload"
            type="file"
            onChange={handleFileSelect}
          />
          <label htmlFor="pan-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={isProcessing}
            >
              Upload PAN Card
            </Button>
          </label>
          {selectedFile && (
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={isProcessing}
              sx={{ ml: 2 }}
            >
              {isProcessing ? 'Processing...' : 'Process Image'}
            </Button>
          )}
        </Box>

        {previewUrl && (
          <Box sx={{ mt: 2 }}>
            <img 
              src={previewUrl} 
              alt="PAN Card Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} 
            />
          </Box>
        )}

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Or enter PAN number manually:
        </Typography>
        <TextField
          label="PAN Number"
          variant="outlined"
          value={panNumber}
          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          inputProps={{ maxLength: 10 }}
        />
        <Button
          variant="contained"
          onClick={handleManualSubmit}
          disabled={!panNumber}
        >
          Submit PAN Number
        </Button>
      </Box>
    </Paper>
  );
};

export default PanVerification; 