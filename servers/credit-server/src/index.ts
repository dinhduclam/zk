import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './utils/db';
import { LoanPackage } from './models/LoanPackage';
import { verifyBankProof, verifyCivilProof, Proof } from './utils/zkp';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Get all loan packagess
app.get('/api/loan-packages', async (_, res) => {
  try {
    const loanPackages = await LoanPackage.find();
    res.json(loanPackages);
  } catch (error) {
    console.error('Error fetching loan packages:', error);
    res.status(500).json({ error: 'Failed to fetch loan packages' });
  }
});

// Apply for a loan
app.post('/api/apply-loan', async (req, res) => {
  try {
    const { userId, loanPackageId } = req.body;

    // Get the loan package
    const loanPackage = await LoanPackage.findById(loanPackageId);
    if (!loanPackage) {
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
    const civilProof = await fetch(`http://localhost:3003/api/civil-proof/${userId}`, {
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

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Credit server running on port ${port}`);
}); 