pragma circom 2.1.4;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template FinancialVerification() {
    // Private inputs
    signal input accountBalance;
    signal input hasBadDebt;
    
    // Public inputs
    signal input requiredBalance;
    signal input requiredNoBadDebt;
    
    // Outputs
    signal output meetsBalanceRequirement;
    signal output validBadDebt;
    
    // Components
    component balanceCheck = GreaterThan(252);
    
    // Verify balance requirement
    balanceCheck.in[0] <== accountBalance;
    balanceCheck.in[1] <== requiredBalance;
    meetsBalanceRequirement <== balanceCheck.out;
    
    // Verify bad debt status using multiplication
    // If requiredNoBadDebt is 1, hasBadDebt must be 0
    // If requiredNoBadDebt is 0, hasBadDebt can be either 0 or 1
    validBadDebt <== (1 - hasBadDebt) * requiredNoBadDebt + (1 - requiredNoBadDebt);
}

component main { public [requiredBalance, requiredNoBadDebt] } = FinancialVerification();
