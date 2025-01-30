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

  filterQualificationsInUse(employees: Employee[]): Qualification[] {
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

  filterQualificationsNotUsedByEmployees(allQualifications: Qualification[], employees: Employee[]): Qualification[] {
    return allQualifications.filter(qualification => {
      !this.filterQualificationsInUse(employees).some(inUseQualification =>
        inUseQualification.id == qualification.id
      );
    });
  }

  filterQualificationsByEmployeeName(employees: Employee[], name: string): Qualification[] {
    let matchingEmployees: Employee[] = [];
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "lastName", name));
    matchingEmployees = matchingEmployees.concat(this.filterColumn(employees, "firstName", name));
    return this.filterQualificationsInUse(matchingEmployees);
  }

  getIntersectionOfResultSets(result1: Qualification[], result2: Qualification[]) {
    return result1.filter(qualification1 => {
      result2.some(qualification2 => qualification1.id == qualification2.id)
    });
  }

  filterByUsagesCheckboxes(allQualifications: Qualification[], allEmployees: Employee[], isInUse: boolean, isUnused: boolean): Qualification[] {
    if (!isInUse && !isUnused) {
      return [];
    }
    if (isInUse && !isUnused) {
      return this.filterQualificationsInUse(allEmployees);
    } else if (!isInUse && isUnused) {
      return this.filterQualificationsNotUsedByEmployees(allQualifications, allEmployees);
    }
    return allQualifications;
  }

}
