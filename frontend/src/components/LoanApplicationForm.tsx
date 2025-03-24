import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

interface LoanApplicationFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ onSubmit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    monthlyIncome: '',
    accountBalance: '',
    noBadDebt: '1',
    age: '',
    hasCriminalRecord: '0',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      monthlyIncome: Number(formData.monthlyIncome),
      accountBalance: Number(formData.accountBalance),
      age: Number(formData.age),
      noBadDebt: formData.noBadDebt === '1',
      hasCriminalRecord: Number(formData.hasCriminalRecord),
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Loan Application Form
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Monthly Income"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Account Balance"
                type="number"
                value={formData.accountBalance}
                onChange={(e) => setFormData({ ...formData, accountBalance: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel>Bad Debt Status</FormLabel>
                <RadioGroup
                  value={formData.noBadDebt}
                  onChange={(e) => setFormData({ ...formData, noBadDebt: e.target.value })}
                >
                  <FormControlLabel value="1" control={<Radio />} label="No Bad Debt" />
                  <FormControlLabel value="0" control={<Radio />} label="Has Bad Debt" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel>Criminal Record</FormLabel>
                <RadioGroup
                  value={formData.hasCriminalRecord}
                  onChange={(e) => setFormData({ ...formData, hasCriminalRecord: e.target.value })}
                >
                  <FormControlLabel value="0" control={<Radio />} label="No Criminal Record" />
                  <FormControlLabel value="1" control={<Radio />} label="Has Criminal Record" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Submit Application
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}; 