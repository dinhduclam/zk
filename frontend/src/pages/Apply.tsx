import React from 'react';
import { Container, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { LoanApplicationForm } from '../components/LoanApplicationForm';

export const Apply: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get('package');

  const handleSubmit = async (formData: any) => {
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
            monthlyIncome: formData.monthlyIncome,
            accountBalance: formData.accountBalance,
            hasBadDebt: formData.hasBadDebt,
            age: formData.age,
            hasCriminalRecord: formData.hasCriminalRecord,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit loan application');
      }

      const data = await response.json();
      console.log('Application submitted:', data);
      // Handle successful submission (e.g., show success message, redirect)
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Apply for Loan
      </Typography>
      <Typography variant="body1" paragraph>
        Please fill out the form below to apply for the loan package.
      </Typography>
      <LoanApplicationForm onSubmit={handleSubmit} />
    </Container>
  );
}; 