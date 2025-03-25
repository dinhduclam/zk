import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { useUser } from '../contexts/UserContext';

interface UserData {
  accountBalance: number;
  monthlyIncome: number;
  hasBadDebt: boolean;
  age: number;
  hasCriminalRecord: boolean;
}

interface User {
  id: string;
  name: string;
  age: number;
  hasCriminalRecord: boolean;
}

const UserProfile: React.FC = () => {
  const { selectedUser, setSelectedUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const handleUserChange = (event: SelectChangeEvent<string>) => {
    setSelectedUser(availableUsers.find(user => user.id === event.target.value) || null);
  };

  // Fetch list of available users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetch('http://localhost:3003/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        setAvailableUsers(users);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users list');
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch selected user's data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!selectedUser) {
        setUserData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch data from both servers in parallel
        const [bankData, civilData] = await Promise.all([
          fetch(`http://localhost:3002/api/user/${selectedUser.id}`).then(res => res.json()),
          fetch(`http://localhost:3003/api/user/${selectedUser.id}`).then(res => res.json())
        ]);

        // Combine the data
        const combinedData: UserData = {
          accountBalance: bankData.accountBalance,
          hasBadDebt: bankData.hasBadDebt,
          monthlyIncome: civilData.monthlyIncome,
          age: civilData.age,
          hasCriminalRecord: civilData.hasCriminalRecord
        };

        setUserData(combinedData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [selectedUser]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Box p={3}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4">
          User Profile
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser?.id || ''}
            label="Select User"
            onChange={handleUserChange}
            disabled={loadingUsers}
          >
            {availableUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} (Age: {user.age})
              </MenuItem>
            ))}
          </Select>
          {loadingUsers && (
            <CircularProgress size={20} sx={{ position: 'absolute', right: 10, top: 10 }} />
          )}
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : !userData ? (
        <Alert severity="info">Please select a user to view their profile</Alert>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Financial Information
          </Typography>
          <Typography gutterBottom>
            Account Balance: {formatCurrency(userData.accountBalance)}
          </Typography>
          <Typography gutterBottom>
            Bad Debt Status: {userData.hasBadDebt ? 'Yes' : 'No'}
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Personal Information
          </Typography>
          <Typography gutterBottom>
            Monthly Income: {formatCurrency(userData.monthlyIncome)}
          </Typography>
          <Typography gutterBottom>
            Age: {userData.age} years
          </Typography>
          <Typography gutterBottom>
            Criminal Record: {userData.hasCriminalRecord ? 'Yes' : 'No'}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default UserProfile; 