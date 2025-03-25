import { connectDB, disconnectDB } from '../utils/db';
import { BankUser } from '../models/BankUser';

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await BankUser.deleteMany({});

    // Create initial users
    const users = [
      {
        userId: 'user1',
        accountBalance: 35000000, // 75 million VND
        hasBadDebt: false
      },
      {
        userId: 'user2',
        accountBalance: 15000000, // 25 million VND
        hasBadDebt: true
      }
    ];

    await BankUser.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await disconnectDB();
  }
};

seedUsers(); 