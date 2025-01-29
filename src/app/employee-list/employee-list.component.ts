import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../models/Employee";
import {EmployeeService} from "../services/employee.service";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {TextFilterComponent} from "../text-filter/text-filter.component";

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, TextFilterComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: WritableSignal<Employee[]> = signal([]);
  employee?: Employee;
  private keywords: Map<string, string> = new Map<string, string>();

  constructor(private http: HttpClient, private service: EmployeeService, private employeeCache: EmployeesCacheService) {
    employeeCache.refresh();
    this.employees = this.employeeCache.read();
  }

  handleEvent(event: { action: string; value: string; event: string }) {
    if (!event) return;
    if (event.action === 'filterByEmployeeName') {
      this.setFilterKeyword('name', event.value);
    } else if (event.action === 'filterByQualification') {
      this.setFilterKeyword('qualification', event.value);
    } else if (event.action === 'filterAll') {
      this.setFilterKeyword('all', event.value);
    }
  }

  private setFilterKeyword(key: string, value: string) {
    if (value == null || value == "") {
      this.keywords.delete(key)
      return;
    }
    this.keywords.set(key, value);
    this.doFilter();
  }

  private doFilter() {
    //TODO replace console.log with filterService
    console.log('doFilter()');
    if (this.keywords.has("name")) {
      const key = this.keywords.get("name");
      console.log(key);
    }
    if (this.keywords.has("qualification")) {
      const key = this.keywords.get("qualification");
      console.log(key);
    }
    if (this.keywords.has("all")) {
      const key = this.keywords.get("all");
      console.log(key);
    }
  }

}
