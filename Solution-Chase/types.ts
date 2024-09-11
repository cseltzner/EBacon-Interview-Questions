/**
 * Employee's weekly timecard with hour and wage data
 */
export interface EmployeeTimecard {
  [name: string]: {
      employee: string;
      regular: string;
      overtime: string;
      doubletime: string;
      wageTotal: string;
      benefitTotal: string;
  }
}

/**
 * Data input from JSON file
 */
export interface InputData {
  jobMeta: Job[];
  employeeData: Employee[];
}

/**
 * Job information including name, wage rate, and benefits rate.
 * Note that job title is used as a primary key/ID, since that is what is provided from JSON file.
 */
export interface Job {
  job: string;
  rate: number;
  benefitsRate: number;
}

/**
 * Employee information and list of TimePunches
 */
export interface Employee {
  employee: string;
  timePunch: TimePunch[];
}

/**
 * TimePunch information including start and end times formatted as strings.
 */
export interface TimePunch {
  job: string;
  start: string;
  end: string;
}

/**
 * Information on hours spent in normaltime, overtime, or doubletime.
 */
export interface PayTime {
  normaltimeHours: number;
  overtimeHours: number;
  doubletimeHours: number;
}