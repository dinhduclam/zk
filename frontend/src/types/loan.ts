export interface LoanPackage {
  id: string;
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
} 