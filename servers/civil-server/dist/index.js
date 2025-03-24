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
const PORT = process.env.PORT || 3003;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const userData = {
    'user1': {
        name: 'Lam Dinh',
        age: 25,
        hasCriminalRecord: false,
        monthlyIncome: 15000000
    }
};
app.post('/api/personal-proof/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { requiredMonthlyIncome, requiredCriminalRecord, requiredMinimumAge, requiredMaximumAge } = req.body;
        const user = userData[userId];
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const input = {
            age: user.age,
            hasCriminalRecord: user.hasCriminalRecord,
            monthlyIncome: user.monthlyIncome,
            requiredMaximumAge,
            requiredMonthlyIncome,
            requiredCriminalRecord,
            requiredMinimumAge
        };
        const proof = await (0, zkp_1.generateProof)(input);
        console.log("Proof generated: ", proof);
        return res.json(proof);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to generate proof' });
    }
});
app.listen(PORT, () => {
    console.log(`Civil Database Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map