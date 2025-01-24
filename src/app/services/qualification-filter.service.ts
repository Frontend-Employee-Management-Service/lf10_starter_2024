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

  filterQualificationsInUsed(employees: Employee[]): Qualification[] {
    let uniqueQualifications: Qualification[] = [];
    const ids: number[] = [];
    employees.forEach(employee => {
        let qualifications: Qualification[] = employee.qualifications ?? [];
        qualifications.forEach(qualification => {
          const id = qualification.id ?? -1;
          if (id > 0 && !ids.includes(id)) {
            ids.push(id);
            uniqueQualifications.push(qualification);
          }
        })
      }
    );
    return uniqueQualifications;
  }

  filterQualificationsByEmployeeName(employees: Employee[], name: string): Qualification[] {
    let matchingEmployees: Employee[] = [];
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "lastName", name));
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "firstName", name));
    return this.filterQualificationsInUsed(matchingEmployees);
  }

}
