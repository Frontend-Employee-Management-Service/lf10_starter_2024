import {Injectable} from '@angular/core';
import {Employee} from "../models/Employee";
import {Qualification} from "../models/Qualification";
import {FilterService} from "./filter.service";

@Injectable({
  providedIn: 'root'
})
export class QualificationFilterService extends FilterService {

  constructor() {
    super();
  }

  filterQualificationInUsed(employees: Employee[]): Qualification[] {
    let inUsedQualifications: Qualification[] = [];
    employees.forEach(employee => {
        const keys = Object.keys(employee);
        const key = keys[keys.length - 1] as keyof Employee;
        let qualification = employee[key];
        if (Array.isArray(qualification)) {
          inUsedQualifications = inUsedQualifications.concat(qualification as Qualification[]);
        }
      }
    );
    let uniqueQualifications = new Set(inUsedQualifications);
    return [...uniqueQualifications];
  }

  filterQualificationByEmployeeName(employees: Employee[], name: string): Qualification[] {
    let matchingEmployees: Employee[] = [];
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "lastName", name));
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "firstName", name));
    return this.filterQualificationInUsed(matchingEmployees);
  }
}
