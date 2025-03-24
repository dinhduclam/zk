include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template CivilVerification() {
    // Private inputs
    signal input age;
    signal input hasCriminalRecord;
    signal input monthlyIncome;
    
    // Public inputs
    signal input requiredMaximumAge;
    signal input requiredMinimumAge;
    signal input requiredMonthlyIncome;
    signal input requiredCriminalRecord;
    
    // Outputs
    signal output meetsAgeRequirement;
    signal output meetsMonthlyIncomeRequirement;
    signal output meetsCriminalRecordRequirement;
    
    // Verify age requirement (min <= age <= max)
    component minAgeCheck = GreaterThan(252);
    component maxAgeCheck = GreaterThan(252);
    
    minAgeCheck.in[0] <== age;
    minAgeCheck.in[1] <== requiredMinimumAge;
    
    maxAgeCheck.in[0] <== requiredMaximumAge;
    maxAgeCheck.in[1] <== age;
    
    meetsAgeRequirement <== minAgeCheck.out * maxAgeCheck.out;

    // Verify monthly income
    component monthlyIncomeCheck = GreaterThan(252);
    monthlyIncomeCheck.in[0] <== monthlyIncome;
    monthlyIncomeCheck.in[1] <== requiredMonthlyIncome;
    meetsMonthlyIncomeRequirement <== monthlyIncomeCheck.out;

    // Verify criminal record
    meetsCriminalRecordRequirement <== (1 - hasCriminalRecord) * requiredCriminalRecord + (1 - requiredCriminalRecord);
}

component main { public [requiredMaximumAge, requiredMinimumAge, requiredMonthlyIncome, requiredCriminalRecord] } = CivilVerification();
