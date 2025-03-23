"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBankProof = verifyBankProof;
exports.verifyCivilProof = verifyCivilProof;
const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');
async function verifyBankProof(proof) {
    try {
        const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../bank-server/circuits/verification_key.json'), 'utf8'));
        const [verifiedBalance, verifiedHasBadDebt] = proof.publicSignals;
        if (Number(verifiedBalance) != 1 || Number(verifiedHasBadDebt) !== 1) {
            return false;
        }
        return await snarkjs.groth16.verify(vKey, proof.publicSignals, proof.proof);
    }
    catch (error) {
        console.error('Error verifying proof:', error);
        return false;
    }
}
async function verifyCivilProof(proof) {
    try {
        const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../civil-server/circuits/verification_key.json'), 'utf8'));
        const [verifiedAge, verifiedMaritalStatus, verifiedIncome, verifiedCriminalRecord] = proof.publicSignals;
        if (Number(verifiedAge) != 1 || Number(verifiedMaritalStatus) != 1 || Number(verifiedIncome) != 1 || Number(verifiedCriminalRecord) != 1) {
            return false;
        }
        return await snarkjs.groth16.verify(vKey, proof.publicSignals, proof.proof);
    }
    catch (error) {
        console.error('Error verifying proof:', error);
        return false;
    }
}
//# sourceMappingURL=zkp.js.map