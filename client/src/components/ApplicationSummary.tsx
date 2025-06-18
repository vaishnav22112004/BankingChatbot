import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface ApplicationSummaryProps {
  userData: {
    faceVerified: boolean;
    panVerified: boolean;
    phoneVerified: boolean;
    panNumber: string;
    phoneNumber: string;
    applicationDate?: string;
  };
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({ userData }) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const VerificationStatus = ({ verified }: { verified: boolean }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {verified ? (
        <>
          <CheckCircleIcon color="success" />
          <Typography color="success.main">Verified</Typography>
        </>
      ) : (
        <>
          <CancelIcon color="error" />
          <Typography color="error.main">Not Verified</Typography>
        </>
      )}
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Bank Account Opening Application
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Application Summary
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Application Date
                  </TableCell>
                  <TableCell>{currentDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Application Status
                  </TableCell>
                  <TableCell>
                    <Typography color="primary.main" sx={{ fontWeight: 'bold' }}>
                      {userData.faceVerified && userData.panVerified && userData.phoneVerified
                        ? 'Complete'
                        : 'In Progress'}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Verification Details
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Identity Verification
                  </TableCell>
                  <TableCell>
                    <VerificationStatus verified={userData.faceVerified} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    PAN Card Verification
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <VerificationStatus verified={userData.panVerified} />
                      {userData.panNumber && (
                        <Typography variant="body2" color="text.secondary">
                          PAN: {userData.panNumber}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>
                    Phone Verification
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <VerificationStatus verified={userData.phoneVerified} />
                      {userData.phoneNumber && (
                        <Typography variant="body2" color="text.secondary">
                          Phone: {userData.phoneNumber}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" paragraph>
              This is a computer-generated document and does not require a signature.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Application Reference: {Math.random().toString(36).substring(2, 15).toUpperCase()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ApplicationSummary; 