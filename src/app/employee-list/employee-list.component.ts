import {Component, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../models/Employee";
import {EmployeeService} from "../services/employee.service";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {TextFilterComponent} from "../components/text-filter/text-filter.component";
import {EmployeeFilterService} from "../services/employee-filter.service";

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, TextFilterComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  listedEmployees: WritableSignal<Employee[]> = signal([]);
  allEmployees: WritableSignal<Employee[]> = signal([]);
  private keywords: Map<string, string> = new Map<string, string>();

  constructor(private http: HttpClient, private service: EmployeeService,
              private employeeCache: EmployeesCacheService,
              private filterService: EmployeeFilterService) {
    employeeCache.refresh();
    this.allEmployees.set(this.employeeCache.read()());
    this.listedEmployees.set(this.employeeCache.read()());
  }

  handleEventFilterByName(event: { value: string }) {
    this.setFilterKeyword('name', event.value);
    this.doFilter();
  }

  handleEventFilterByQualification(event: { value: string }) {
    this.setFilterKeyword('qualification', event.value);
    this.doFilter();
  }

  handleEventFilterAll(event: { value: string }) {
    this.setFilterKeyword('all', event.value);
    this.doFilter();
  }

  setFilterKeyword(key: string, value: string) {
    if (value == null || value == "") {
      this.keywords.delete(key)
      this.listedEmployees.set(this.allEmployees());
    } else {
      this.keywords.set(key, value);
    }
  }

  private doFilter() {
    console.log('doFilter()');
    if (this.keywords.has("name")) {
      const nameFilterResult = this.filterService.filterEmployeesByNames(this.listedEmployees(), this.keywords.get("name")!);
      this.listedEmployees.set(nameFilterResult);
    }
    if (this.keywords.has("qualification")) {
      const qualificationFilterResult = this.filterService.filterEmployeesByQualification(this.listedEmployees(), this.keywords.get("qualification")!);
      this.listedEmployees.set(qualificationFilterResult);
    }
    if (this.keywords.has("all")) {
      const allColumnsFilterResult = this.filterService.filterAllEmployeeFields(this.listedEmployees(), this.keywords.get("all")!);
      this.listedEmployees.set(allColumnsFilterResult);
    }
  }

}
