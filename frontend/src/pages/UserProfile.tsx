import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
} from '@mui/material';

interface UserData {
  accountBalance: number;
  monthlyIncome: number;
  hasBadDebt: boolean;
  age: number;
  maritalStatus: string;
  hasCriminalRecord: boolean;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real application, we would fetch this data from the appropriate servers
        // For demonstration, we'll use mock data
        const mockData: UserData = {
          accountBalance: 75000000, // 75 million VND
          monthlyIncome: 20000000, // 20 million VND
          hasBadDebt: false,
          age: 25,
          maritalStatus: 'Single',
          hasCriminalRecord: false,
        };
        setUserData(mockData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>Loading user profile...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography>No user data available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Financial Information
            </Typography>
            <Typography gutterBottom>
              Account Balance: {formatCurrency(userData.accountBalance)}
            </Typography>
            <Typography gutterBottom>
              Monthly Income: {formatCurrency(userData.monthlyIncome)}
            </Typography>
            <Typography gutterBottom>
              Bad Debt History: {userData.hasBadDebt ? 'Yes' : 'No'}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Typography gutterBottom>
              Age: {userData.age} years
            </Typography>
            <Typography gutterBottom>
              Marital Status: {userData.maritalStatus}
            </Typography>
            <Typography gutterBottom>
              Criminal Record: {userData.hasCriminalRecord ? 'Yes' : 'No'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Loan Eligibility Status
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography>
              Account Balance Requirement: {userData.accountBalance >= 50000000 ? '✓' : '✗'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Monthly Income Requirement: {userData.monthlyIncome >= 15000000 ? '✓' : '✗'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Age Requirement: {userData.age >= 18 ? '✓' : '✗'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Bad Debt Check: {!userData.hasBadDebt ? '✓' : '✗'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Marital Status: {['Single', 'Married'].includes(userData.maritalStatus) ? '✓' : '✗'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Criminal Record Check: {!userData.hasCriminalRecord ? '✓' : '✗'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserProfile; 