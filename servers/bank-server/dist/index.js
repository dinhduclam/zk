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
const PORT = process.env.PORT || 3002;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mock user data (in a real system, this would be in a secure database)
const userData = {
    'user1': {
        accountBalance: 75000000, // 75 million VND
        hasBadDebt: false
    }
};
app.post('/api/financial-proof/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { requiredBalance } = req.body;
        const user = userData[userId];
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Generate ZKP proof for financial conditions
        const proof = await (0, zkp_1.generateProof)({
            accountBalance: user.accountBalance,
            hasBadDebt: user.hasBadDebt,
            requiredBalance: Number(requiredBalance)
        });
        console.log("Proof generated: ", proof);
        return res.json(proof);
    }
    catch (error) {
        console.error('Error generating financial proof:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(PORT, () => {
    console.log(`Bank Server running on port ${PORT}`);
});
