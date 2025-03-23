import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';

interface LoanPackage {
  id: string;
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loanPackages, setLoanPackages] = React.useState<LoanPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = React.useState<LoanPackage | null>(null);

  React.useEffect(() => {
    // Fetch loan packages from the credit institution server
    const fetchLoanPackages = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/loan-packages');
        const data = await response.json();
        setLoanPackages(data);
      } catch (error) {
        console.error('Error fetching loan packages:', error);
      }
    };

    fetchLoanPackages();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleApplyLoan = async (packageId: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/apply-loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user1',
          loanPackageId: packageId,
          requirements: {
            minIncome: selectedPackage?.requirements.minIncome,
            minBalance: selectedPackage?.requirements.minBalance,
            noBadDebt: selectedPackage?.requirements.noBadDebt,
            minAge: selectedPackage?.requirements.minAge,
            maxAge: selectedPackage?.requirements.maxAge,
            maritalStatuses: selectedPackage?.requirements.maritalStatuses,
            criminalRecord: selectedPackage?.requirements.criminalRecord
          }
        }),
      });
    } catch (error) {
      console.error('Error applying for loan:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Loan Packages
      </Typography>
      <Grid container spacing={3}>
        {loanPackages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {pkg.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Loan Amount: {formatCurrency(pkg.amount)}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Term: {pkg.term} months
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Interest Rate: {(pkg.interestRate * 100).toFixed(2)}%
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Requirements:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Minimum Balance: {formatCurrency(pkg.requirements.minBalance)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Minimum Income: {formatCurrency(pkg.requirements.minIncome)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Age Range: {pkg.requirements.minAge} - {pkg.requirements.maxAge} years
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Bad Debt: {pkg.requirements.noBadDebt ? 'Not Allowed' : 'Allowed'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Marital Status: {['Single', 'Married', 'Divorced', 'Widowed'][pkg.requirements.maritalStatuses]}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Criminal Record: {pkg.requirements.criminalRecord === 0 ? 'Not Allowed' : 'Allowed'}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setSelectedPackage(pkg);
                    navigate(`/apply?package=${pkg.id}`);
                  }}
                >
                  Apply Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 