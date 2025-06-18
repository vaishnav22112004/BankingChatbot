import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

interface FaceVerificationProps {
  onComplete: (data: any) => void;
  panImage: string | null;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ onComplete, panImage }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Starting to load face-api models...');
        const MODEL_URL = process.env.PUBLIC_URL + '/models';
        console.log('Model URL:', MODEL_URL);

        // Load models one by one with error handling
        try {
          console.log('Loading tiny face detector...');
          const tinyFaceDetector = await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          console.log('Tiny face detector loaded successfully:', tinyFaceDetector);
        } catch (err: unknown) {
          console.error('Error loading tiny face detector:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          throw new Error(`Failed to load face detector model: ${errorMessage}`);
        }

        try {
          console.log('Loading face landmarks...');
          const faceLandmarks = await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          console.log('Face landmarks loaded successfully:', faceLandmarks);
        } catch (err: unknown) {
          console.error('Error loading face landmarks:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          throw new Error(`Failed to load face landmarks model: ${errorMessage}`);
        }

        try {
          console.log('Loading face recognition...');
          const faceRecognition = await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          console.log('Face recognition loaded successfully:', faceRecognition);
        } catch (err: unknown) {
          console.error('Error loading face recognition:', err);
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          throw new Error(`Failed to load face recognition model: ${errorMessage}`);
        }

        setIsModelLoaded(true);
        setError(null);
        console.log('All models loaded successfully');
      } catch (error: unknown) {
        console.error('Error loading face-api models:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(`Failed to load face recognition models: ${errorMessage}. Please refresh the page.`);
      }
    };

    loadModels();
  }, []);

  const handleUserMedia = () => {
    console.log('Webcam is ready');
    setIsWebcamReady(true);
  };

  const captureImage = async () => {
    if (!webcamRef.current || !isModelLoaded || !panImage) {
      setError('Camera, face recognition models, or PAN image not ready');
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log('Image captured');
      
      if (imageSrc) {
        // Load both images
        const webcamImg = await faceapi.fetchImage(imageSrc);
        const panImg = await faceapi.fetchImage(panImage);
        
        console.log('Processing images with face-api...');
        
        // Detect faces in both images
        const [webcamDetections, panDetections] = await Promise.all([
          faceapi.detectAllFaces(webcamImg, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors(),
          faceapi.detectAllFaces(panImg, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors()
        ]);

        console.log('Face detections:', { webcam: webcamDetections, pan: panDetections });

        if (webcamDetections.length === 0) {
          setError('No face detected in webcam image. Please try again.');
          return;
        }

        if (panDetections.length === 0) {
          setError('No face detected in PAN card image. Please upload a clearer image.');
          return;
        }

        // Compare faces
        const webcamFace = webcamDetections[0];
        const panFace = panDetections[0];
        
        const distance = faceapi.euclideanDistance(webcamFace.descriptor, panFace.descriptor);
        const isMatch = distance < 0.6; // Lower distance means more similar faces

        console.log('Face comparison:', { distance, isMatch });

        if (isMatch) {
          console.log('Face match successful');
          onComplete({ faceVerified: true });
        } else {
          console.log('Face match failed');
          setError('Face verification failed. The face in the webcam does not match the PAN card photo.');
        }
      } else {
        setError('Failed to capture image');
      }
    } catch (error: unknown) {
      console.error('Error during face verification:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Error processing image: ${errorMessage}. Please try again.`);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Face Verification
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ position: 'relative', width: '100%', maxWidth: 640, mx: 'auto' }}>
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: 'user'
          }}
          onUserMedia={handleUserMedia}
          style={{ width: '100%', borderRadius: '8px' }}
        />
        <Button
          variant="contained"
          startIcon={<CameraAltIcon />}
          onClick={captureImage}
          disabled={!isModelLoaded || !isWebcamReady || isCapturing || !panImage}
          sx={{ mt: 2 }}
        >
          {isCapturing ? 'Processing...' : 'Capture Image'}
        </Button>
        {!isModelLoaded && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Loading face recognition models...
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default FaceVerification; 