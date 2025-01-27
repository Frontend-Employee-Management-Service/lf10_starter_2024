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
  employeeName: string = '';

  constructor(private http: HttpClient, private service: EmployeeService, private employeeCache: EmployeesCacheService) {
    employeeCache.refresh();
    this.employees = this.employeeCache.read();
  }

  handleEvent(event: TextFilterComponent) {
    if (!event) return;
    if (event.action === 'filterEmployeeName') {
      this.filterEmployeeName(event.value);
    }
  }

  private filterEmployeeName(value: string) {
    //save employee name filter's keyword

  }

  private doFilter(){
    //get all keywords from other filter. //Map?
    //call filter service for the combined filter
  }
}
