import mongoose from 'mongoose';

const bankUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  accountBalance: {
    type: Number,
    required: true
  },
  hasBadDebt: {
    type: Boolean,
    required: true,
    default: false
  }
});

export const BankUser = mongoose.model('BankUser', bankUserSchema); 