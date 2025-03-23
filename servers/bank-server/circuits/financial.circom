include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template FinancialVerification() {
    // Private inputs
    signal input accountBalance;
    signal input hasBadDebt;
    
    // Public inputs
    signal input requiredBalance;
    
    // Outputs
    signal output meetsBalanceRequirement;
    signal output validBadDebt;
    
    // Verify balance requirement
    component balanceCheck = GreaterThan(252);
    balanceCheck.in[0] <== accountBalance;
    balanceCheck.in[1] <== requiredBalance;
    meetsBalanceRequirement <== balanceCheck.out;
    
    // Verify bad debt status
    validBadDebt <== 1 - hasBadDebt;
}

component main { public [requiredBalance] } = FinancialVerification();
