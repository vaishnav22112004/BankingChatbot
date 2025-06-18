# Bank Account Opening Chatbot

A modern web application that automates the bank account opening process with facial recognition, PAN card verification, and mobile number validation.

## Features

- Interactive chatbot interface
- Facial recognition for identity verification
- PAN card OCR and manual input
- Mobile number verification with OTP
- Modern Material-UI design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd bank-account-chatbot
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a `.env` file in the root directory:
```
PORT=5000
```

5. Download face-api.js models:
   - Create a `public/models` directory in the client folder
   - Download the required models from [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - Place the model files in the `public/models` directory

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. The chatbot will guide you through the account opening process
2. Follow the steps for:
   - Facial verification
   - PAN card upload/verification
   - Mobile number verification
3. Complete all steps to finish the account opening process

## Technologies Used

- Frontend:
  - React with TypeScript
  - Material-UI
  - face-api.js for facial recognition
  - react-webcam for camera access

- Backend:
  - Node.js with Express
  - Tesseract.js for OCR
  - Multer for file uploads

## Security Notes

- This is a demo application and uses mock services for SMS verification
- In a production environment, implement proper security measures:
  - Use HTTPS
  - Implement proper authentication
  - Secure API endpoints
  - Use environment variables for sensitive data
  - Implement rate limiting
  - Add proper error handling

## License

MIT 