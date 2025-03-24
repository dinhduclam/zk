import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { verifyBankProof, verifyCivilProof, Proof } from './utils/zkp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface UserData {
  monthlyIncome: number;
  hasCriminalRecord: boolean;
  age: number;
}

interface UserDatabase {
  [key: string]: UserData;
}

// Mock database
const userDatabase: UserDatabase = {
  user1: {
    monthlyIncome: 8000,
    hasCriminalRecord: false,
    age: 25
  }
};


// Get user data endpoint
app.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userData = userDatabase[userId];
  
  if (!userData) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  return res.json(userData);
});

// Loan package interface
interface LoanPackage {
  id: string;
  name: string;
  amount: number;
  interestRate: number;
  term: number;
  requirements: {
    minIncome: number;
    minBalance: number;
    requireNoBadDebt: boolean;
    minAge: number;
    maxAge: number;
    requireCriminalRecord: boolean;
    requiredMaritalStatus: boolean;
  };
}

// Mock loan packages
const loanPackages: LoanPackage[] = [
  {
    id: '1',
    name: 'Basic Loan',
    amount: 50000000,
    interestRate: 0.08,
    term: 12,
    requirements: {
      minIncome: 5000000,
      minBalance: 20000000,
      requireNoBadDebt: false,
      minAge: 18,
      maxAge: 60,
      requireCriminalRecord: true,
      requiredMaritalStatus: false
    }
  },
  {
    id: '2',
    name: 'Premium Loan',
    amount: 200000000,
    interestRate: 0.06,
    term: 24,
    requirements: {
      minIncome: 10000000,
      minBalance: 50000000,
      requireNoBadDebt: false,
      minAge: 30,
      maxAge: 60,
      requireCriminalRecord: false,
      requiredMaritalStatus: true
    }
  }
];

// Get loan packages endpoint
app.get('/api/loan-packages', (_req, res) => {
  return res.json(loanPackages);
});

// Apply for loan endpoint
app.post('/api/apply-loan', async (req, res) => {
  try {
    const { userId, loanPackageId } = req.body;
    console.log('Loan application received:', { userId, loanPackageId });
    
    const userData = userDatabase[userId];
    if (!userData) {
      console.log('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    
    const loanPackage = loanPackages.find(pkg => pkg.id === loanPackageId);
    if (!loanPackage) {
      console.log('Loan package not found:', loanPackageId);
      return res.status(404).json({ error: 'Loan package not found' });
    }

    console.log('---------------------------------------');
    console.log('Fetching financial proof from bank server...');
    // Get financial proof from bank server
    const financialProof = await fetch(`http://localhost:3002/api/financial-proof/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requiredBalance: loanPackage.requirements.minBalance,
        requiredNoBadDebt: loanPackage.requirements.requireNoBadDebt
      })
    });
    const financialProofData = await financialProof.json() as Proof;
    console.log("financialProofData:", financialProofData);

    const isFinancialProofValid = await verifyBankProof(financialProofData);

    if (!isFinancialProofValid) {
      console.log('Financial proof verification failed');
      return res.status(400).json({ error: 'Financial proof verification failed' });
    }

    console.log('---------------------------------------');
    console.log('Fetching civil proof from civil server...');
    // Get civil proof from civil server
    const civilProof = await fetch(`http://localhost:3003/api/personal-proof/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requiredMinimumAge: loanPackage.requirements.minAge,
        requiredMaximumAge: loanPackage.requirements.maxAge,
        requiredMonthlyIncome: loanPackage.requirements.minIncome,
        requiredCriminalRecord: loanPackage.requirements.requireCriminalRecord
      })
    });

    const civilProofData = await civilProof.json() as Proof;
    console.log("civilProofData: ", civilProofData);
    
    const isCivilProofValid = await verifyCivilProof(civilProofData);
    if (!isCivilProofValid) {
      console.log('Civil proof verification failed');
      return res.status(400).json({ error: 'Civil proof verification failed' });
    }
    
    console.log('---------------------------------------');
    console.log('Loan application approved');
    // If all verifications pass, process the loan application
    return res.json({
      success: true,
      message: 'Loan application approved',
      loanDetails: {
        amount: loanPackage.amount,
        interestRate: loanPackage.interestRate,
        term: loanPackage.term
      }
    });
  } catch (error) {
    console.error('Error processing loan application:', error);
    return res.status(500).json({ error: 'Failed to process loan application' });
  }
});

app.listen(PORT, () => {
  console.log(`Credit Institution Server running on port ${PORT}`);
}); 