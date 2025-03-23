"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const zkp_1 = require("./utils/zkp");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const userDatabase = {
    user1: {
        monthlyIncome: 8000,
        hasCriminalRecord: false,
        age: 25,
        maritalStatus: 1
    }
};
app.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const userData = userDatabase[userId];
    if (!userData) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json(userData);
});
const loanPackages = [
    {
        id: '1',
        name: 'Basic Loan',
        amount: 50000000,
        interestRate: 0.08,
        term: 12,
        requirements: {
            minIncome: 5000000,
            minBalance: 20000000,
            noBadDebt: false,
            minAge: 18,
            maxAge: 60,
            maritalStatuses: 0,
            criminalRecord: 0
        }
    },
    {
        id: '2',
        name: 'Premium Loan',
        amount: 200000000,
        interestRate: 0.06,
        term: 24,
        requirements: {
            minIncome: 10000000,
            minBalance: 50000000,
            noBadDebt: false,
            minAge: 30,
            maxAge: 60,
            maritalStatuses: 0,
            criminalRecord: 0
        }
    }
];
app.get('/api/loan-packages', (_req, res) => {
    return res.json(loanPackages);
});
app.post('/api/apply-loan', async (req, res) => {
    try {
        const { userId, loanPackageId } = req.body;
        console.log('Loan application received:', { userId, loanPackageId });
        const userData = userDatabase[userId];
        if (!userData) {
            console.log('User not found:', userId);
            return res.status(404).json({ error: 'User not found' });
        }
        const loanPackage = loanPackages.find(pkg => pkg.id === loanPackageId);
        if (!loanPackage) {
            console.log('Loan package not found:', loanPackageId);
            return res.status(404).json({ error: 'Loan package not found' });
        }
        console.log('Fetching financial proof from bank server...');
        const financialProof = await fetch(`http://localhost:3002/api/financial-proof/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requiredBalance: loanPackage.requirements.minBalance
            })
        });
        const financialProofData = await financialProof.json();
        console.log("financialProofData:", financialProofData);
        const isFinancialProofValid = await (0, zkp_1.verifyBankProof)(financialProofData);
        if (!isFinancialProofValid) {
            console.log('Financial proof verification failed');
            return res.status(400).json({ error: 'Financial proof verification failed' });
        }
        console.log('Fetching civil proof from civil server...');
        const civilProof = await fetch(`http://localhost:3003/api/personal-proof/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requiredMinimumAge: loanPackage.requirements.minAge,
                requiredMaximumAge: loanPackage.requirements.maxAge,
                requiredMaritalStatus: loanPackage.requirements.maritalStatuses,
                requiredMonthlyIncome: loanPackage.requirements.minIncome,
                requiredCriminalRecord: loanPackage.requirements.criminalRecord
            })
        });
        const civilProofData = await civilProof.json();
        console.log("civilProofData: ", civilProofData);
        const isCivilProofValid = await (0, zkp_1.verifyCivilProof)(civilProofData);
        if (!isCivilProofValid) {
            console.log('Civil proof verification failed');
            return res.status(400).json({ error: 'Civil proof verification failed' });
        }
        console.log('Loan application approved');
        return res.json({
            success: true,
            message: 'Loan application approved',
            loanDetails: {
                amount: loanPackage.amount,
                interestRate: loanPackage.interestRate,
                term: loanPackage.term
            }
        });
    }
    catch (error) {
        console.error('Error processing loan application:', error);
        return res.status(500).json({ error: 'Failed to process loan application' });
    }
});
app.listen(PORT, () => {
    console.log(`Credit Institution Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map