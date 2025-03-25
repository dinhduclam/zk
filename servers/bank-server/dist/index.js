"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
const BankUser_1 = require("./models/BankUser");
const zkp_1 = require("./utils/zkp");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
(0, db_1.connectDB)();
// Get user financial data
app.get('/api/user/:userId', async (req, res) => {
    try {
        const user = await BankUser_1.BankUser.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});
// Generate financial proof
app.post('/api/financial-proof/:userId', async (req, res) => {
    try {
        const { requiredBalance, requiredNoBadDebt } = req.body;
        const user = await BankUser_1.BankUser.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Generate proof that user meets balance requirement
        const proof = await (0, zkp_1.generateProof)({
            accountBalance: user.accountBalance,
            hasBadDebt: user.hasBadDebt,
            requiredBalance: Number(requiredBalance),
            requiredNoBadDebt: requiredNoBadDebt
        });
        console.log("Proof generated: ", proof);
        return res.json(proof);
    }
    catch (error) {
        console.error('Error generating financial proof:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await (0, db_1.disconnectDB)();
    process.exit(0);
});
app.listen(port, () => {
    console.log(`Bank server running on port ${port}`);
});
