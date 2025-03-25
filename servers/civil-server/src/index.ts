import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from './utils/db';
import { CivilUser } from './models/CivilUser';
import { generateProof } from './utils/zkp';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Get all users
app.get('/api/users', async (_, res) => {
  try {
    const users = await CivilUser.find().select('userId age hasCriminalRecord');
    const formattedUsers = users.map(user => ({
      id: user.userId,
      name: `User ${user.userId}`,
      age: user.age,
      hasCriminalRecord: user.hasCriminalRecord
    }));
    return res.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user civil data
app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await CivilUser.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Generate civil proof
app.post('/api/civil-proof/:userId', async (req, res) => {
  try {
    const { requiredMonthlyIncome, requiredCriminalRecord, requiredMinimumAge, requiredMaximumAge } = req.body;
    const user = await CivilUser.findOne({ userId: req.params.userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate proof that user meets age and criminal record requirements
    const proof = await generateProof({
      age: user.age,
      hasCriminalRecord: user.hasCriminalRecord,
      monthlyIncome: user.monthlyIncome,
      requiredMaximumAge,
      requiredMonthlyIncome,
      requiredCriminalRecord,
      requiredMinimumAge
    });

    console.log("Proof generated: ", proof);
    return res.json(proof);
  } catch (error) {
    console.error('Error generating civil proof:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Civil server running on port ${port}`);
});