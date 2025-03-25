import mongoose from 'mongoose';

const civilUserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true
  },
  hasCriminalRecord: {
    type: Boolean,
    required: true,
    default: false
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
});

export const CivilUser = mongoose.model('CivilUser', civilUserSchema); 