"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
const LoanPackage_1 = require("./models/LoanPackage");
const zkp_1 = require("./utils/zkp");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.connectDB)();
app.get('/api/loan-packages', async (_, res) => {
    try {
        const loanPackages = await LoanPackage_1.LoanPackage.find();
        res.json(loanPackages);
    }
    catch (error) {
        console.error('Error fetching loan packages:', error);
        res.status(500).json({ error: 'Failed to fetch loan packages' });
    }
});
app.post('/api/apply-loan', async (req, res) => {
    try {
        const { userId, loanPackageId } = req.body;
        const loanPackage = await LoanPackage_1.LoanPackage.findById(loanPackageId);
        if (!loanPackage) {
            return res.status(404).json({ error: 'Loan package not found' });
        }
        console.log('---------------------------------------');
        console.log('Fetching financial proof from bank server...');
        const financialProof = await fetch(`http://localhost:3002/api/financial-proof/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requiredBalance: loanPackage.requirements.minBalance,
                requiredNoBadDebt: loanPackage.requirements.requireNoBadDebt
            })
        });
        const financialProofData = await financialProof.json();
        console.log("financialProofData:", financialProofData);
        const isFinancialProofValid = await (0, zkp_1.verifyBankProof)(financialProofData);
        if (!isFinancialProofValid) {
            console.log('Financial proof verification failed');
            return res.status(400).json({ error: 'Financial proof verification failed' });
        }
        console.log('---------------------------------------');
        console.log('Fetching civil proof from civil server...');
        const civilProof = await fetch(`http://localhost:3003/api/personal-proof/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requiredMinimumAge: loanPackage.requirements.minAge,
                requiredMaximumAge: loanPackage.requirements.maxAge,
                requiredMonthlyIncome: loanPackage.requirements.minIncome,
                requiredCriminalRecord: loanPackage.requirements.requireCriminalRecord
            })
        });
        const civilProofData = await civilProof.json();
        console.log("civilProofData: ", civilProofData);
        const isCivilProofValid = await (0, zkp_1.verifyCivilProof)(civilProofData);
        if (!isCivilProofValid) {
            console.log('Civil proof verification failed');
            return res.status(400).json({ error: 'Civil proof verification failed' });
        }
        console.log('---------------------------------------');
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
process.on('SIGINT', async () => {
    await (0, db_1.disconnectDB)();
    process.exit(0);
});
app.listen(port, () => {
    console.log(`Credit server running on port ${port}`);
});
//# sourceMappingURL=index.js.map