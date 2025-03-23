import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateProof } from './utils/zkp';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

interface UserData {
  name: string;
  age: number;
  maritalStatus: string;
  hasCriminalRecord: boolean;
  monthlyIncome: number;
}

interface UserDatabase {
  [key: string]: UserData;
}

const userData: UserDatabase = {
  'user1': {
    name: 'Lam Dinh',
    age: 25,
    maritalStatus: 'Single',
    hasCriminalRecord: false,
    monthlyIncome: 15000000
  }
};

app.post('/api/personal-proof/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { requiredMaritalStatus, requiredMonthlyIncome, requiredCriminalRecord, requiredMinimumAge, requiredMaximumAge } = req.body;
    const user = userData[userId];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const input = {
      age: user.age,
      maritalStatus: user.maritalStatus === 'Single' ? '0' : '1',
      hasCriminalRecord: user.hasCriminalRecord,
      monthlyIncome: user.monthlyIncome,
      requiredMaximumAge,
      requiredMaritalStatus,
      requiredMonthlyIncome,
      requiredCriminalRecord,
      requiredMinimumAge
    };

    const proof = await generateProof(input);

    console.log("Proof generated: ", proof);
    return res.json(proof);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to generate proof' });
  }
});

app.listen(PORT, () => {
  console.log(`Civil Database Server running on port ${PORT}`);
});