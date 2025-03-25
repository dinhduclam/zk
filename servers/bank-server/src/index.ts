import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './utils/db';
import { BankUser } from './models/BankUser';
import { generateProof } from './utils/zkp';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Get user financial data
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await BankUser.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Generate financial proof
app.post('/api/financial-proof/:userId', async (req, res) => {
  try {
    const { requiredBalance, requiredNoBadDebt } = req.body;
    const user = await BankUser.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate proof that user meets balance requirement
    const proof = await generateProof({
      accountBalance: user.accountBalance,
      hasBadDebt: user.hasBadDebt,
      requiredBalance: Number(requiredBalance),
      requiredNoBadDebt: requiredNoBadDebt
    });

    console.log("Proof generated: ", proof);

    return res.json(proof);
  } catch (error) {
    console.error('Error generating financial proof:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Bank server running on port ${port}`);
});