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
    let qualifications: Qualification[] = [];
    employees.forEach(employee => {
        qualifications = qualifications.concat(employee.qualifications ?? []);
      }
    );
    return Array.from(
      new Set(qualifications.map(item => JSON.stringify(item)))
    ).map(item => JSON.parse(item));
  }

  filterQualificationByEmployeeName(employees: Employee[], name: string): Qualification[] {
    let matchingEmployees: Employee[] = [];
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "lastName", name));
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "firstName", name));
    return this.filterQualificationInUsed(matchingEmployees);
  }

}
