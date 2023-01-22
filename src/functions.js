/*
    Function that calculates the debt accrued on student loans until graduation date. Takes in the initial loan amount, the interest rate on it and how many
    months the interest will be applied. This is assuming interest is compounded monthly.
*/
export function debtGrowth(initialSum, debtInterestRate, months) {
    return initialSum*(Math.pow(1+debtInterestRate, months));
}

/*
    Function that calculates the year the debt will be paid off assuming a set repayment value. Takes in the intial debt amount, the interest rate on the debt,
    and how much money is used to repay the debt monthly (make sure this is monthly and not annual). This is assuming interest is compounded monthly.
*/
export function yearDebtFree(debtAmount, debtInterest, debtRepayment) {
    if (debtAmount*debtInterest > debtRepayment) {
        return false;
    }
    else {
        return Math.ceil((-Math.log(1 - (debtAmount*debtInterest/debtRepayment))/Math.log(1 + debtInterest))/12);
    }
}

/*
    Function that calculates how much money is generated by compound interest over the years. Uses the number of years the interest will be compounded over,
    the interest rate used, the amount of money invested at the start, how much is added in yearly and a boolean which determines if interest should be 
    compounded annually or monthly.
*/
export function compoundInterest(years, interestRate, startCapital, contributeCapital, annually) {
    const discountRate = interestRate/(1+interestRate)
    return (startCapital + (contributeCapital/discountRate) * Math.pow(1 + interestRate, years)) - contributeCapital/discountRate;
}

/*
    Function that calculates how much money can be used yearly in retirement using the ammount provided. Uses a set starting capital, the interest rate on
    investments, the goal for reamining money and the years the money is expected to last.
*/
export function yearlyLivingBudget(startingCapital, interestRate, amountRemaining, yearsRetired) {
    // Starting guess is half the starting capital
    let stipend = startingCapital/2;
    // Increment will be cut in half each cycle
    let increment = stipend/2;
    // Initialized to -1 so that it cant complete on the first check
    let reamining = -1;
    // Keep incrementing until the difference between remaining and the target goal is minimal (within 0.5)
    while (Math.abs(remaining - amountRemaining) > 0.5) {
        // Each loop reinitialize to the starting capital
        let remainingCapital = startingCapital;
        // Run the simulation of interest over the years that you are retired for
        for (let i = 0; i < yearsRetired; i++) {
            remainingCapital = (remainingCapital - stipend)*(1 + interestRate);
        }
        // Adjust stripend accordingly, if remaining is too much, stipend is incremented, if remaining is negative, stipend is decremented
        if (remainingCapital > amountRemaining) {
            stipend = stipend + increment;
        }
        else {
            stipend = stipend - increment;
        }
        // Adjust increment to be smaller to fine tune
        increment = increment/2;
        // Change remaing, if this is close enough to the target goal, this will end the loop
        reamining = remainingCaptial;
    }
    return stipend;
}

/*
    Calculates the amount of money given at retirement, given a set of initial variables.
*/
export function reCalculate(age, retirementAge, expectancyAge, currentSavings, debt, debtInterest, gradDate, income, retirementAge, endSavings) {

    /*
    Find life expendency/expected age of retirement
    Then calculate using current savings + debt how much current capital
    If debt how long to pay off with salary
    once debt free start calculating compound interest calculation with monthly savings added
    */

    const retirementYears = expectancyAge - retirementAge;
    const currentDate = new Date();
    let months = (gradDate.getFullYear() - currentDate.getFullYear()) * 12;
    months -= currentDate.getMonth() + 1;
    months += gradDate.getMonth();
    const monthsUntilGrad = 0 ? 0 : months;

    // Calcualting the debt by the end of education
    const futureDebt = debtGrowth(debt, debtInterest, monthsUntilGrad);

    // Assuming a debt repayment of 10% of income
    const savings = 0.1*income;
    const debtRepayment = 0.1*(income/12); // This is calculated to be taken out monthly

    // Will get the year that the user will be debt free assuming a constant repayment.
    let debtFree = yearDebtFree(futureDebt, debtInterest, debtRepayment);
    if (!debtFree) {
        debtFree = retirementAge - age;
    }
    // Will get the amount of money accrued by the end of paying off the debt.
    const sumAfterDebt = compoundInterest(debtFree, interestRate, currentSavings, savings, true);
    // Gets the final lump sum at the projected retirement age, using the new savings rate now that debt is paid off.
    const yearsToRetirement = retirementAge - debtFree - age;
    const sumAtRetirement = compoundInterest(yearsToRetirement, interestRate, sumAfterDebt, savings+(12*debtRepayment), true);
    const yearlyStipend = yearlyLivingBudget(sumAtRetirement, interestRate, endSavings, expectancyAge-retirementAge)

    /*var result = {
        totalMoney: sumAtRetirement
    }*/

    return yearlyStipend;
}

//export default {compoundInterest}
