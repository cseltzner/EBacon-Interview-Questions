import data from "./data.json";
import { Employee, EmployeeTimecard, PayTime, TimePunch } from "./types";

const jobsData = data.jobMeta;
const employeeData = data.employeeData;

const MAX_NORMALTIME_HOURS = 40;
const MAX_OVERTIME_HOURS = 8;
const OVERTIME_RATE_MULTIPLIER = 1.5;
const DOUBLETIME_RATE_MULTIPLIER = 2.0;

/**
 * Returns an employee's timecard given employee and timepunch data.
 * @param employee Employee's information with list of timecards
 * @returns An employee's timecard with wage information
 */
export const calculateEmployeeTimecard = (employee: Employee): EmployeeTimecard => {
    // Total hours/wages
    let normaltimeHours = 0;
    let overtimeHours = 0;
    let doubletimeHours = 0;
    const shiftWages: number[] = [];
    let benefitTotal = 0;

    // Calculate hours and wages for each timepunch
    // Then add to totals
    employee.timePunch.forEach(timePunch => {
        // Hours for this individual timepunch
        let timePunchNormaltimeHours = 0;
        let timePunchOvertimeHours = 0;
        let timePunchDoubletimeHours = 0;

        const currTimepunchHours = calculateTimepunchHours(timePunch);

        // Add total timepunch hours as normaltime hours initially.
        normaltimeHours += currTimepunchHours;
        timePunchNormaltimeHours = currTimepunchHours;

        // Hours exceeding maximum normaltime hours are added as overtime hours.
        if (normaltimeHours > MAX_NORMALTIME_HOURS) {
            timePunchOvertimeHours = (normaltimeHours - MAX_NORMALTIME_HOURS); // Excess normaltime hours added as overtime hours for this timepunch
            timePunchNormaltimeHours -= timePunchOvertimeHours; // Excess normaltime hours removed from this timepunch

            overtimeHours += timePunchOvertimeHours; // Total overtime hours for employee increased
            normaltimeHours = MAX_NORMALTIME_HOURS; // Total normaltime hours cannot exceed MAX_NORMALTIME_HOURS
        }
        // Hours exceeding maximum overtime hours are added as doubletime hours.
        if (overtimeHours > MAX_OVERTIME_HOURS) {
            timePunchDoubletimeHours = (overtimeHours - MAX_OVERTIME_HOURS); // Excess overtime hours added as doubletime hours for this timepunch
            timePunchOvertimeHours -= timePunchDoubletimeHours; // Excess overtime hours removed from this timepunch

            doubletimeHours += timePunchDoubletimeHours; // Total doubletime hours for employee increased
            overtimeHours = MAX_OVERTIME_HOURS; // Total overtime hours cannot exceed MAX_OVERTIME_HOURS
        }

        // Calculate wage for this timepunch
        const timePunchWage = calculateTimepunchWage(timePunch, {
            normaltimeHours: timePunchNormaltimeHours,
            overtimeHours: timePunchOvertimeHours,
            doubletimeHours: timePunchDoubletimeHours
        });
        shiftWages.push(timePunchWage);

        // Calculate benefit for this timepunch
        const timePunchBenefits = calculateTimepunchBenefit(timePunch, {
            normaltimeHours: timePunchNormaltimeHours,
            overtimeHours: timePunchOvertimeHours,
            doubletimeHours: timePunchDoubletimeHours
        });
        benefitTotal += timePunchBenefits;
    })

    // Sum each timepunch's wage to get total wage
    const wageTotal = shiftWages.reduce((acc, curVal) => acc + curVal);

    return {
        [employee.employee]: {
            employee: employee.employee,
            regular: normaltimeHours.toFixed(4).toString(),
            overtime: overtimeHours.toFixed(4).toString(),
            doubletime: doubletimeHours.toFixed(4).toString(),
            wageTotal: wageTotal.toFixed(4).toString(),
            benefitTotal: benefitTotal.toFixed(4).toString()
        }
    }
}

/**
 * Calculate the benefit wage for a specific shift given the job's data and overtime data
 * @param timepunch job data required to find the benefit rate
 * @param payTime normaltime and overtime data needed to calculate total benefit
 * @returns the total benefit wage of the given timepunch.
 */
const calculateTimepunchBenefit = (timePunch: TimePunch, payTime: PayTime) => {
    // Get the benefit rate based on the job's primary key (the job's name)
    const jobBenefitsRate = jobsData.find(job => job.job === timePunch.job)?.benefitsRate;
    if (!jobBenefitsRate) throw new Error(`Could not find the job "${timePunch.job}" in the list of jobs available.`);

    return (payTime.normaltimeHours * jobBenefitsRate) + (payTime.overtimeHours * jobBenefitsRate) + (payTime.doubletimeHours * jobBenefitsRate);
}

/**
 * Calculate the wage for a specific shift given the job's data and overtime data
 * @param timepunch job data required to find the wage rate
 * @param payTime normaltime and overtime data needed to calculate total wage
 * @returns the total wage of the given timepunch.
 */
const calculateTimepunchWage = (timepunch: TimePunch, payTime: PayTime) => {
    // Get the wage rate based on the job's primary key (the job's name)
    const jobRate = jobsData.find(job => job.job === timepunch.job)?.rate;
    if (!jobRate) throw new Error(`Could not find the job "${timepunch.job}" in the list of jobs available.`)

    return (payTime.normaltimeHours * jobRate) + (payTime.overtimeHours * jobRate * OVERTIME_RATE_MULTIPLIER) + (payTime.doubletimeHours * jobRate * DOUBLETIME_RATE_MULTIPLIER);
}


/**
 * Returns the hours worked for a specific timepunch.
 * @param timepunch Timepunch object containing start and end dates of the shift
 * @returns Unrounded number that represents hours worked for this timepunch
*/
export const calculateTimepunchHours = (timepunch: TimePunch) => {
    const startDate = new Date(timepunch.start);
    const endDate = new Date(timepunch.end);
    const millisBetween = Math.abs(startDate.getTime() - endDate.getTime());
    const hoursBetween = millisBetween / (60 * 60 * 1000);
    return hoursBetween;
}


/******************************
 * MAIN FUNCTION FOR EXERCISE *
 ******************************/

/**
 * Returns a list of employee timecards with wage information given a list of employees.
 * @param employeesData List of employees and their timepunches
 * @returns Array of employee timecards with wage information
 */
export const calculateEmployeeTimecards = (employeesData: Employee[]) => {
    const employeeTimecards = employeesData.map(emp => calculateEmployeeTimecard(emp));
    return employeeTimecards;
}

console.log(calculateEmployeeTimecards(employeeData));