const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Function to preprocess image for better OCR
async function preprocessImage(imagePath) {
  const processedPath = imagePath.replace(/\.[^/.]+$/, '_processed.jpg');
  
  try {
    await sharp(imagePath)
      .resize(2000, 2000, { // Resize to a reasonable size
        fit: 'inside',
        withoutEnlargement: true
      })
      .grayscale() // Convert to grayscale
      .normalize() // Normalize contrast
      .sharpen() // Sharpen the image
      .threshold(128) // Convert to binary image
      .toFile(processedPath);
    
    return processedPath;
  } catch (error) {
    console.error('Error preprocessing image:', error);
    return imagePath; // Return original if preprocessing fails
  }
}

// Mock SMS verification
const mockSMSVerification = {
  sendOTP: (phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Mock SMS sent to ${phoneNumber} with OTP: ${otp}`);
    return otp;
  },
  verifyOTP: (phoneNumber, otp) => {
    return true;
  }
};

// Routes
app.post('/api/verify-phone', (req, res) => {
  const { phoneNumber } = req.body;
  const otp = mockSMSVerification.sendOTP(phoneNumber);
  res.json({ success: true, message: 'OTP sent successfully' });
});

app.post('/api/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  const isValid = mockSMSVerification.verifyOTP(phoneNumber, otp);
  res.json({ success: isValid, message: isValid ? 'OTP verified successfully' : 'Invalid OTP' });
});

app.post('/api/process-pan', upload.single('panImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Processing PAN card image:', req.file.path);

    // Preprocess the image
    const processedImagePath = await preprocessImage(req.file.path);
    console.log('Preprocessed image saved at:', processedImagePath);

    // Configure Tesseract with optimized settings for PAN card
    const result = await Tesseract.recognize(
      processedImagePath,
      'eng',
      {
        logger: m => console.log(m),
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        tessedit_pageseg_mode: '6',
        tessjs_create_pdf: '0',
        tessjs_create_hocr: '0',
        tessjs_create_tsv: '0',
        tessjs_create_box: '0',
        tessjs_create_unlv: '0',
        tessjs_create_osd: '0',
        tessedit_ocr_engine_mode: '1', // Use LSTM only
        preserve_interword_spaces: '1',
        textord_heavy_nr: '1',
        textord_min_linesize: '2.5',
        textord_max_linesize: '3.5',
        textord_parallel_baselines: '1',
        textord_parallel_lines: '1',
        textord_parallel_merge: '1',
        textord_parallel_merge_x: '1',
        textord_parallel_merge_y: '1',
        textord_parallel_merge_skew: '1',
        textord_parallel_merge_skew2: '1',
        textord_parallel_merge_skew3: '1',
        textord_parallel_merge_skew4: '1',
        textord_parallel_merge_skew5: '1',
        textord_parallel_merge_skew6: '1',
        textord_parallel_merge_skew7: '1',
        textord_parallel_merge_skew8: '1',
        textord_parallel_merge_skew9: '1',
        textord_parallel_merge_skew10: '1',
        textord_parallel_merge_skew11: '1',
        textord_parallel_merge_skew12: '1',
        textord_parallel_merge_skew13: '1',
        textord_parallel_merge_skew14: '1',
        textord_parallel_merge_skew15: '1',
        textord_parallel_merge_skew16: '1',
        textord_parallel_merge_skew17: '1',
        textord_parallel_merge_skew18: '1',
        textord_parallel_merge_skew19: '1',
        textord_parallel_merge_skew20: '1',
        textord_parallel_merge_skew21: '1',
        textord_parallel_merge_skew22: '1',
        textord_parallel_merge_skew23: '1',
        textord_parallel_merge_skew24: '1',
        textord_parallel_merge_skew25: '1',
        textord_parallel_merge_skew26: '1',
        textord_parallel_merge_skew27: '1',
        textord_parallel_merge_skew28: '1',
        textord_parallel_merge_skew29: '1',
        textord_parallel_merge_skew30: '1',
        textord_parallel_merge_skew31: '1',
        textord_parallel_merge_skew32: '1',
        textord_parallel_merge_skew33: '1',
        textord_parallel_merge_skew34: '1',
        textord_parallel_merge_skew35: '1',
        textord_parallel_merge_skew36: '1',
        textord_parallel_merge_skew37: '1',
        textord_parallel_merge_skew38: '1',
        textord_parallel_merge_skew39: '1',
        textord_parallel_merge_skew40: '1',
        textord_parallel_merge_skew41: '1',
        textord_parallel_merge_skew42: '1',
        textord_parallel_merge_skew43: '1',
        textord_parallel_merge_skew44: '1',
        textord_parallel_merge_skew45: '1',
        textord_parallel_merge_skew46: '1',
        textord_parallel_merge_skew47: '1',
        textord_parallel_merge_skew48: '1',
        textord_parallel_merge_skew49: '1',
        textord_parallel_merge_skew50: '1',
        textord_parallel_merge_skew51: '1',
        textord_parallel_merge_skew52: '1',
        textord_parallel_merge_skew53: '1',
        textord_parallel_merge_skew54: '1',
        textord_parallel_merge_skew55: '1',
        textord_parallel_merge_skew56: '1',
        textord_parallel_merge_skew57: '1',
        textord_parallel_merge_skew58: '1',
        textord_parallel_merge_skew59: '1',
        textord_parallel_merge_skew60: '1',
        textord_parallel_merge_skew61: '1',
        textord_parallel_merge_skew62: '1',
        textord_parallel_merge_skew63: '1',
        textord_parallel_merge_skew64: '1',
        textord_parallel_merge_skew65: '1',
        textord_parallel_merge_skew66: '1',
        textord_parallel_merge_skew67: '1',
        textord_parallel_merge_skew68: '1',
        textord_parallel_merge_skew69: '1',
        textord_parallel_merge_skew70: '1',
        textord_parallel_merge_skew71: '1',
        textord_parallel_merge_skew72: '1',
        textord_parallel_merge_skew73: '1',
        textord_parallel_merge_skew74: '1',
        textord_parallel_merge_skew75: '1',
        textord_parallel_merge_skew76: '1',
        textord_parallel_merge_skew77: '1',
        textord_parallel_merge_skew78: '1',
        textord_parallel_merge_skew79: '1',
        textord_parallel_merge_skew80: '1',
        textord_parallel_merge_skew81: '1',
        textord_parallel_merge_skew82: '1',
        textord_parallel_merge_skew83: '1',
        textord_parallel_merge_skew84: '1',
        textord_parallel_merge_skew85: '1',
        textord_parallel_merge_skew86: '1',
        textord_parallel_merge_skew87: '1',
        textord_parallel_merge_skew88: '1',
        textord_parallel_merge_skew89: '1',
        textord_parallel_merge_skew90: '1',
        textord_parallel_merge_skew91: '1',
        textord_parallel_merge_skew92: '1',
        textord_parallel_merge_skew93: '1',
        textord_parallel_merge_skew94: '1',
        textord_parallel_merge_skew95: '1',
        textord_parallel_merge_skew96: '1',
        textord_parallel_merge_skew97: '1',
        textord_parallel_merge_skew98: '1',
        textord_parallel_merge_skew99: '1',
        textord_parallel_merge_skew100: '1',
      }
    );

    console.log('Raw OCR Result:', result.data.text);

    // Extract PAN number using the standard format
    const text = result.data.text;
    let panNumber = null;

    // Function to clean and normalize text
    const cleanText = (str) => {
      const cleaned = str
        .replace(/[^A-Z0-9]/gi, '') // Remove non-alphanumeric characters
        .toUpperCase(); // Convert to uppercase
      console.log('Cleaned text:', cleaned);
      return cleaned;
    };

    // Function to validate PAN format
    const isValidPAN = (str) => {
      const cleaned = cleanText(str);
      // More specific pattern matching for PAN numbers
      const isValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleaned);
      console.log('Validating PAN:', cleaned, 'isValid:', isValid);
      return isValid;
    };

    // Function to check if text is likely a PAN number
    const isLikelyPAN = (str) => {
      // Check if the text matches common PAN number characteristics
      const cleaned = cleanText(str);
      return cleaned.length === 10 && // Must be exactly 10 characters
             /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleaned) && // Must match PAN format
             !/^(INCOMETAX|PERMANENT|ACCOUNT|NUMBER|PAN)$/i.test(cleaned); // Must not be common PAN-related words
    };

    // Split text into lines and look for PAN number
    const lines = text.split('\n');
    console.log('Processing lines:', lines);

    // First, try to find a line that contains a valid PAN number
    for (const line of lines) {
      console.log('Processing line:', line);
      // Look for sequences that match the PAN format
      const matches = line.match(/[A-Z0-9]{10}/g) || [];
      console.log('Found matches in line:', matches);
      
      for (const match of matches) {
        console.log('Checking match:', match);
        if (isLikelyPAN(match)) {
          panNumber = cleanText(match);
          console.log('Found valid PAN number:', panNumber);
          break;
        }
      }
      
      if (panNumber) break;
    }

    // If no PAN number found in complete sequences, try to find it in parts
    if (!panNumber) {
      console.log('No PAN found in complete sequences, trying parts...');
      for (const line of lines) {
        console.log('Processing line for parts:', line);
        // Look for sequences that might be split or have special characters
        const words = line.split(/\s+/);
        console.log('Split words:', words);
        for (const word of words) {
          const cleaned = cleanText(word);
          console.log('Checking word:', word, 'cleaned:', cleaned);
          if (isLikelyPAN(cleaned)) {
            panNumber = cleaned;
            console.log('Found valid PAN number in parts:', panNumber);
            break;
          }
        }
        if (panNumber) break;
      }
    }

    // If still no PAN number found, try to find it in the entire text
    if (!panNumber) {
      console.log('Trying to find PAN in entire text...');
      const cleanedText = cleanText(text);
      const allMatches = cleanedText.match(/[A-Z0-9]{10}/g) || [];
      console.log('All matches in text:', allMatches);
      
      for (const match of allMatches) {
        if (isLikelyPAN(match)) {
          panNumber = match;
          console.log('Found valid PAN number in entire text:', panNumber);
          break;
        }
      }
    }

    // If still no PAN number found, try to find it in the entire text with more flexible matching
    if (!panNumber) {
      console.log('Trying flexible matching...');
      const cleanedText = cleanText(text);
      // Look for any 10-character sequence that might be a PAN number
      const allMatches = cleanedText.match(/[A-Z0-9]{10}/g) || [];
      console.log('All matches in text:', allMatches);
      
      for (const match of allMatches) {
        // Try to fix common OCR errors
        const fixed = match
          .replace(/5/g, 'S')
          .replace(/S/g, '5')
          .replace(/0/g, 'O')
          .replace(/O/g, '0');
        
        console.log('Trying fixed match:', fixed);
        if (isLikelyPAN(fixed)) {
          panNumber = fixed;
          console.log('Found valid PAN number after fixing:', panNumber);
          break;
        }
      }
    }

    // Clean up processed image
    try {
      await fs.unlink(processedImagePath);
    } catch (error) {
      console.error('Error deleting processed image:', error);
    }

    // Log the extraction process
    console.log('Final Extracted PAN Number:', panNumber);
    console.log('Full OCR Text:', text);

    res.json({
      success: true,
      panNumber: panNumber,
      fullText: text
    });
  } catch (error) {
    console.error('Error processing PAN card:', error);
    res.status(500).json({ 
      error: 'Error processing PAN card',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 