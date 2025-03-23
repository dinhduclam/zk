include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template CivilVerification() {
    // Private inputs
    signal input age;
    signal input maritalStatus;
    signal input hasCriminalRecord;
    signal input monthlyIncome;
    
    // Public inputs
    signal input requiredMaximumAge;
    signal input requiredMinimumAge;
    signal input requiredMaritalStatus;
    signal input requiredMonthlyIncome;
    signal input requiredCriminalRecord;
    
    // Outputs
    signal output meetsAgeRequirement;
    signal output meetsMaritalStatusRequirement;
    signal output meetsMonthlyIncomeRequirement;
    signal output meetsCriminalRecordRequirement;
    
    // Verify balance requirement
    component ageCheck = GreaterThan(252);
    ageCheck.in[0] <== age;
    ageCheck.in[1] <== requiredMinimumAge;
    meetsAgeRequirement <== ageCheck.out;
    
    // Verify marital status
    component maritalStatusCheck = IsEqual();
    maritalStatusCheck.in[0] <== maritalStatus;
    maritalStatusCheck.in[1] <== requiredMaritalStatus;
    meetsMaritalStatusRequirement <== maritalStatusCheck.out;

    // Verify monthly income
    component monthlyIncomeCheck = GreaterThan(252);
    monthlyIncomeCheck.in[0] <== monthlyIncome;
    monthlyIncomeCheck.in[1] <== requiredMonthlyIncome;
    meetsMonthlyIncomeRequirement <== monthlyIncomeCheck.out;

    // Verify criminal record
    component criminalRecordCheck = IsEqual();
    criminalRecordCheck.in[0] <== hasCriminalRecord;
    criminalRecordCheck.in[1] <== requiredCriminalRecord;
    meetsCriminalRecordRequirement <== criminalRecordCheck.out;
}

component main { public [requiredMaximumAge, requiredMaritalStatus, requiredMonthlyIncome, requiredCriminalRecord, requiredMinimumAge] } = CivilVerification();
