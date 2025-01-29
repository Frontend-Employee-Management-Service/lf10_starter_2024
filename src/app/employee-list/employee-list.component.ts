import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../models/Employee";
import {EmployeeService} from "../services/employee.service";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {TextFilterComponent} from "../text-filter/text-filter.component";
import {EmployeeFilterService} from "../services/employee-filter.service";

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, TextFilterComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: WritableSignal<Employee[]> = signal([]);
  private keywords: Map<string, string> = new Map<string, string>();

  constructor(private http: HttpClient, private service: EmployeeService,
              private employeeCache: EmployeesCacheService,
              private filterService: EmployeeFilterService) {
    employeeCache.refresh();
    this.employees = this.employeeCache.read();
  }

  handleEventFilterByName(event: { value: string; event: string }) {
    if (!event) return;
    this.setFilterKeyword('name', event.value);
  }

  handleEventFilterByQualification(event: { value: string; event: string }) {
    if (!event) return;
    this.setFilterKeyword('qualification', event.value);
  }

  handleEventFilterAll(event: { value: string; event: string }) {
    if (!event) return;
    this.setFilterKeyword('all', event.value);
  }

  private setFilterKeyword(key: string, value: string){
    if (value == null || value == "") {
      this.keywords.delete(key)
      this.employeeCache.refresh();
      this.employees = this.employeeCache.read();
    } else {
      this.keywords.set(key, value);
    }
    this.doFilter();
  }

  private doFilter() {
    //TODO replace console.log with filterService
    console.log('doFilter()');

    if (this.keywords.has("name")) {
      const key = this.keywords.get("name");
      console.log(key);
      const nameFilterResult = this.filterService.filterEmployeesByNames(this.employees(), this.keywords.get("name")!);
      this.employees.set(nameFilterResult);
    }
    if (this.keywords.has("qualification")) {
      const key = this.keywords.get("qualification");
      console.log(key);
      const qualificationFilterResult = this.filterService.filterEmployeesByQualification(this.employees(), this.keywords.get("qualification")!);
      this.employees.set(qualificationFilterResult);
    }
    if (this.keywords.has("all")) {
      const key = this.keywords.get("all");
      console.log(key);
      const allColumnsFilterResult = this.filterService.filterAll(this.employees(), this.keywords.get("all")!);
      this.employees.set(allColumnsFilterResult);
    }
  }


}
