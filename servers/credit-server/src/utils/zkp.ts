const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');

export interface ProofInput {
  accountBalance: number;
  monthlyIncome: number;
  hasBadDebt: number;
  requiredBalance: number;
  requiredIncome: number;
}

export interface Proof {
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
  };
  publicSignals: string[];
}

export async function verifyBankProof(proof: Proof): Promise<boolean> {
  try {
    // Load verification key
    const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../bank-server/circuits/verification_key.json'), 'utf8'));
    
    const [verifiedBalance, verifiedHasBadDebt] = proof.publicSignals;

    if (Number(verifiedBalance) != 1 || Number(verifiedHasBadDebt) !== 1) {
      return false;
    }

    // Verify the proof
    return await snarkjs.groth16.verify(vKey, proof.publicSignals, proof.proof);
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
}

export async function verifyCivilProof(proof: Proof): Promise<boolean> {
  try {
    // Load verification key
    const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../civil-server/circuits/verification_key.json'), 'utf8'));

    const [verifiedAge, verifiedMaritalStatus, verifiedIncome, verifiedCriminalRecord] = proof.publicSignals;

    if (Number(verifiedAge) != 1 || Number(verifiedMaritalStatus) != 1 || Number(verifiedIncome) != 1 || Number(verifiedCriminalRecord) != 1) {
      return false;
    }

    // Verify the proof
    return await snarkjs.groth16.verify(vKey, proof.publicSignals, proof.proof);
  } catch (error) {
    console.error('Error verifying proof:', error);
    return false;
  }
}
