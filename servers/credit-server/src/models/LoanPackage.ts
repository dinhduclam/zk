import mongoose, { Schema, Document } from 'mongoose';

export interface ILoanPackage extends Document {
  name: string;
  amount: number;
  interestRate: number;
  term: number;
  requirements: {
    minIncome: number;
    minBalance: number;
    requireNoBadDebt: boolean;
    minAge: number;
    maxAge: number;
    requireCriminalRecord: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LoanPackageSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  term: { type: Number, required: true },
  requirements: {
    minIncome: { type: Number, required: true },
    minBalance: { type: Number, required: true },
    requireNoBadDebt: { type: Boolean, required: true },
    minAge: { type: Number, required: true },
    maxAge: { type: Number, required: true },
    requireCriminalRecord: { type: Boolean, required: true }
  }
}, {
  timestamps: true
});

export const LoanPackage = mongoose.model<ILoanPackage>('LoanPackage', LoanPackageSchema); 