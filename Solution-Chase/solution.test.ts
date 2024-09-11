import { describe, test, expect } from "@jest/globals";
import data from "./data.json";
import { calculateEmployeeTimecard, calculateEmployeeTimecards, calculateTimepunchHours } from "./solution";

/**************************************
 * calculateEmployeeTimecards() tests *
 **************************************/
describe("calculateEmployeeTimecards", () => {
  test("given list of employees, returns correctly", () => {
    const inputData = data.employeeData;
    const expectedOutput = [
      {
        Mike: {
          employee: "Mike",
          regular: "39.2856",
          overtime: "0.0000",
          doubletime: "0.0000",
          wageTotal: "1056.4017",
          benefitTotal: "36.8320",
        },
      },
      {
        Steve: {
          employee: "Steve",
          regular: "40.0000",
          overtime: "8.0000",
          doubletime: "1.1658",
          wageTotal: "1653.5979",
          benefitTotal: "49.9036",
        },
      },
      {
        Alex: {
          employee: "Alex",
          regular: "40.0000",
          overtime: "3.6428",
          doubletime: "0.0000",
          wageTotal: "795.3979",
          benefitTotal: "44.5985",
        },
      },
    ];

    const actualOutput = calculateEmployeeTimecards(inputData);

    expect(actualOutput).toEqual(expectedOutput);
  });
});

/*************************************
 * calculateEmployeeTimecard() tests *
 *************************************/

describe("calculateEmployeeTimecard", () => {
  test("employee without overtime or doubletime returns correct timecard", () => {
    const inputEmployee = data.employeeData[0]; // Mike, no overtime
    const expectedOutput = {
      Mike: {
        employee: "Mike",
        regular: "39.2856",
        overtime: "0.0000",
        doubletime: "0.0000",
        wageTotal: "1056.4017",
        benefitTotal: "36.8320",
      },
    };

    const actualOutput = calculateEmployeeTimecard(inputEmployee);

    expect(actualOutput).toEqual(expectedOutput);
  });

  test("employee with overtime returns correct timecard", () => {
    const inputEmployee = data.employeeData[2]; // Alex, overtime employee
    const expectedOutput = {
      Alex: {
        employee: "Alex",
        regular: "40.0000",
        overtime: "3.6428",
        doubletime: "0.0000",
        wageTotal: "795.3979",
        benefitTotal: "44.5985",
      },
    };

    const actualOutput = calculateEmployeeTimecard(inputEmployee);

    expect(actualOutput).toEqual(expectedOutput);
  });

  test("employee with overtime and doubletime returns correct timecard", () => {
    const inputEmployee = data.employeeData[1]; // Steve, overtime and doubletime
    const expectedOutput = {
      Steve: {
        employee: "Steve",
        regular: "40.0000",
        overtime: "8.0000",
        doubletime: "1.1658",
        wageTotal: "1653.5979",
        benefitTotal: "49.9036",
      },
    };

    const actualOutput = calculateEmployeeTimecard(inputEmployee);

    expect(actualOutput).toEqual(expectedOutput);
  });
});

/***********************************
 * calculateTimepunchHours() tests *
 ***********************************/
describe("calculateTimepunchHours", () => {
    const startInput = "2022-02-19 07:03:41";
    const endInput = "2022-02-19 10:00:45";
    const expectedOutput = 2.9511; // hours

    const actualOutput = calculateTimepunchHours({
        job: "anything",
        start: startInput,
        end: endInput
    });

    expect(actualOutput).toBeCloseTo(expectedOutput);
})