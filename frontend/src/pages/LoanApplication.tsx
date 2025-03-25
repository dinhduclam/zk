import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

interface LoanPackage {
  _id: string;
  name: string;
  amount: number;
  interestRate: number;
  term: number;
  requirements: {
    minIncome: number;
    minBalance: number;
    noBadDebt: boolean;
    minAge: number;
    maxAge: number;
    maritalStatuses: number;
    criminalRecord: number;
  };
}

const LoanApplication: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState<LoanPackage | null>(null);

  React.useEffect(() => {
    const packageId = searchParams.get('package');
    if (packageId) {
      // Fetch loan package details
      const fetchPackage = async () => {
        try {
          const response = await fetch(`http://localhost:3001/api/loan-packages`);
          const packages = await response.json();
          const selected = packages.find((pkg: LoanPackage) => pkg._id === packageId);
          if (selected) {
            setSelectedPackage(selected);
          }
        } catch (error) {
          console.error('Error fetching loan package:', error);
          setError('Failed to load loan package details');
        }
      };

      fetchPackage();
    }
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!selectedPackage) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3001/api/apply-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanPackageId: selectedPackage._id,
          userId: 'user1', // In a real app, this would come from authentication
        }),
      });

      const data = await response.json();

      if (data.success === true) {
        setSuccess(true);
      } else {
        setError(data.message || 'Loan application was rejected');
      }
    } catch (error) {
      console.error('Error submitting loan application:', error);
      setError('Failed to submit loan application');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (!selectedPackage) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">No loan package selected</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Return to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Loan Application
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selected Loan Package
        </Typography>
        <Typography gutterBottom>
          Amount: {formatCurrency(selectedPackage.amount)}
        </Typography>
        <Typography gutterBottom>
          Term: {selectedPackage.term} months
        </Typography>
        <Typography gutterBottom>
          Interest Rate: {(selectedPackage.interestRate * 100).toFixed(2)}%
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Congratulations! Your loan application has been approved.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Application'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default LoanApplication; 