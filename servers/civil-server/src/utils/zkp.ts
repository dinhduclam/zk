const snarkjs = require('snarkjs');
const path = require('path');
const fs = require('fs');

interface Proof {
  proof: any;
  publicSignals: string[];
}

interface PersonalData {
  age: number;
  maritalStatus: string;
  hasCriminalRecord: boolean;
  monthlyIncome: number;
  requiredMinimumAge: number;
  requiredMaximumAge: number;
  requiredMaritalStatus: string;
  requiredMonthlyIncome: number;
  requiredCriminalRecord: boolean;
}

const CIRCUIT_PATH = path.join(__dirname, '/../../circuits/civil_js/civil.wasm');
const PROVING_KEY_PATH = path.join(__dirname, '/../../circuits/civil.zkey');
const WITNESS_PATH = path.join(__dirname, '/../../circuits/civil.wtns');

export async function generateProof(data: PersonalData): Promise<Proof> {
  // do like bank-server
  try {
    const input = {
      age: data.age,
      maritalStatus: data.maritalStatus,
      hasCriminalRecord: data.hasCriminalRecord,
      monthlyIncome: data.monthlyIncome,
      requiredMinimumAge: data.requiredMinimumAge,
      requiredMaximumAge: data.requiredMaximumAge,
      requiredMaritalStatus: data.requiredMaritalStatus,
      requiredMonthlyIncome: data.requiredMonthlyIncome,
      requiredCriminalRecord: data.requiredCriminalRecord
    };

    await snarkjs.wtns.calculate(input, CIRCUIT_PATH, WITNESS_PATH);

    const { proof, publicSignals } = await snarkjs.groth16.prove(PROVING_KEY_PATH, WITNESS_PATH);

    return { proof, publicSignals };
  } catch (error) {
    console.error('Error generating civil proof:', error);
    throw error;
  }
}

export async function verifyProof(proof: Proof): Promise<boolean> {
  // do like bank-server
  try {
    const vKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../civil-server/circuits/verification_key.json'), 'utf8'));
    return await snarkjs.groth16.verify(vKey, proof.publicSignals, proof.proof);
  } catch (error) {
    console.error('Error verifying civil proof:', error);
    return false;
  }
}
