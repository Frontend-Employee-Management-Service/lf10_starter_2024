import {Injectable} from '@angular/core';
import {FilterService} from "./filter.service";
import {Employee} from "../models/Employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeeFilterService extends FilterService {

  constructor() {
    super();
  }

  filterEmployeesByNames(employees: Employee[], name: string): Employee[] {
    let matchingEmployees: Employee[] = [];
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "lastName", name));
    matchingEmployees = matchingEmployees.concat(
      this.filterColumn(employees, "firstName", name)
        .filter(entry => !matchingEmployees.some(preExistingEntry => preExistingEntry.id === entry.id))
    );
    return matchingEmployees;
  }

  filterEmployeesByQualification(employees: Employee[], qualificationKeyword: string): Employee[]{
    let matchingEmployees: Employee[] = [];
    matchingEmployees = employees.filter(employee => {
      const qualifications = employee.qualifications ?? [];
      return qualifications.some(qualification => qualification.skill!.toLowerCase().includes(qualificationKeyword.toLowerCase()));
    });
    return matchingEmployees;
  }

  filterEmployeesByQualificationId(employees: Employee[], qualificationId: number): Employee[]{
    let matchingEmployees: Employee[] = [];
    matchingEmployees = employees.filter(employee => {
      const qualifications = employee.qualifications ?? [];
      return qualifications.some(qualification => qualification.id == qualificationId);
    });
    return matchingEmployees;
  }

  filterAllEmployeeFields(employees: Employee[], keyword: string): Employee[] {
    let matchingEmployees: Employee[] = this.filterAll(employees, keyword);
    matchingEmployees = matchingEmployees.concat(
      this.filterEmployeesByQualification(employees, keyword)
        .filter(entry => !matchingEmployees.some(preExistingEntry => preExistingEntry.id === entry.id))
    );
    return matchingEmployees;
  }

}
