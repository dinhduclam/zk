import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateProof } from './utils/zkp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

interface UserData {
  accountBalance: number;
  hasBadDebt: boolean;
}

interface UserDatabase {
  [key: string]: UserData;
}

// Mock user data (in a real system, this would be in a secure database)
const userData: UserDatabase = {
  'user1': {
    accountBalance: 75000000, // 75 million VND
    hasBadDebt: false
  }
};

app.post('/api/financial-proof/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { requiredBalance } = req.body;
    const user = userData[userId];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate ZKP proof for financial conditions
    const proof = await generateProof({
      accountBalance: user.accountBalance,
      hasBadDebt: user.hasBadDebt,
      requiredBalance: Number(requiredBalance)
    });

    console.log("Proof generated: ", proof);

    return res.json(proof);
  } catch (error) {
    console.error('Error generating financial proof:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Bank Server running on port ${PORT}`);
});