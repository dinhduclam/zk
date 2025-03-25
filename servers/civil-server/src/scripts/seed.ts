import { connectDB, disconnectDB } from '../utils/db';
import { CivilUser } from '../models/CivilUser';

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await CivilUser.deleteMany({});

    // Create initial users
    const users = [
      {
        userId: 'user1',
        age: 25,
        hasCriminalRecord: false,
        monthlyIncome: 2500000
      },
      {
        userId: 'user2',
        age: 35,
        hasCriminalRecord: true,
        monthlyIncome: 3000000
      }
    ];

    await CivilUser.insertMany(users);
    console.log('Civil users seeded successfully');
  } catch (error) {
    console.error('Error seeding civil users:', error);
  } finally {
    await disconnectDB();
  }
};

seedUsers(); 