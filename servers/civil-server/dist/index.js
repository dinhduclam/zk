"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./utils/db");
const CivilUser_1 = require("./models/CivilUser");
const zkp_1 = require("./utils/zkp");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3003;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.connectDB)();
app.get('/api/users', async (_, res) => {
    try {
        const users = await CivilUser_1.CivilUser.find().select('userId age hasCriminalRecord');
        const formattedUsers = users.map(user => ({
            id: user.userId,
            name: `User ${user.userId}`,
            age: user.age,
            hasCriminalRecord: user.hasCriminalRecord
        }));
        return res.json(formattedUsers);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
});
app.get('/api/user/:userId', async (req, res) => {
    try {
        const user = await CivilUser_1.CivilUser.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(user);
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        return res.status(500).json({ error: 'Failed to fetch user data' });
    }
});
app.post('/api/civil-proof/:userId', async (req, res) => {
    try {
        const { requiredMonthlyIncome, requiredCriminalRecord, requiredMinimumAge, requiredMaximumAge } = req.body;
        const user = await CivilUser_1.CivilUser.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const proof = await (0, zkp_1.generateProof)({
            age: user.age,
            hasCriminalRecord: user.hasCriminalRecord,
            monthlyIncome: user.monthlyIncome,
            requiredMaximumAge,
            requiredMonthlyIncome,
            requiredCriminalRecord,
            requiredMinimumAge
        });
        console.log("Proof generated: ", proof);
        return res.json(proof);
    }
    catch (error) {
        console.error('Error generating civil proof:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
process.on('SIGINT', async () => {
    await (0, db_1.disconnectDB)();
    process.exit(0);
});
app.listen(port, () => {
    console.log(`Civil server running on port ${port}`);
});
//# sourceMappingURL=index.js.map