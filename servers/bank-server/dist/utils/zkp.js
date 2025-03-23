"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProof = generateProof;
exports.verifyProof = verifyProof;
const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');
const CIRCUIT_PATH = path.join(__dirname, '/../../circuits/financial_js/financial.wasm');
const PROVING_KEY_PATH = path.join(__dirname, '/../../circuits/financial.zkey');
const WITNESS_PATH = path.join(__dirname, '/../../circuits/financial.wtns');
async function generateProof(data) {
    try {
        // Prepare input for the circuit
        const input = {
            accountBalance: data.accountBalance,
            hasBadDebt: data.hasBadDebt ? 1 : 0,
            requiredBalance: data.requiredBalance
        };
        // Generate witness
        await snarkjs.wtns.calculate(input, CIRCUIT_PATH, WITNESS_PATH);
        // Generate proof
        const { proof, publicSignals } = await snarkjs.groth16.prove(PROVING_KEY_PATH, WITNESS_PATH);
        return {
            proof,
            publicSignals
        };
    }
    catch (error) {
        console.error('Error generating bank proof:', error);
        throw error;
    }
}
async function verifyProof(proof) {
    try {
        // Load verification key
        const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../../circuits/verification_key.json'), 'utf8'));
        // Verify the proof
        return await snarkjs.groth16.verify(vKey, proof.publicSignals, proof.proof);
    }
    catch (error) {
        console.error('Error verifying bank proof:', error);
        return false;
    }
}
