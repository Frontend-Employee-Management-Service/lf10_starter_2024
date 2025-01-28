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
  keywords: Map<string, string> = new Map<string, string>();

  constructor(private http: HttpClient, private service: EmployeeService, private employeeCache: EmployeesCacheService) {
    employeeCache.refresh();
    this.employees = this.employeeCache.read();
  }

  handleEvent(event: { action: string; value: string; event: string }) {
    if (!event) return;
    if (event.action === 'filterEmployeeName') {
      this.filterEmployeeName(event.value);
    }
  }

  private filterEmployeeName(value: string) {
    if (value == null || value == "") {
      this.keywords.delete("name")
      return;
    }
    this.keywords.set("name", value);
    this.doFilter();
  }

  private doFilter() {
    if (this.keywords.has("name")) {
      const key = this.keywords.get("name");
      console.log(key);
    }
    //get all keywords from other filter. //Map?
    //call filter service for the combined filter
  }

  /*
  private initializeKeywords(){
    this.keywords  = new Map<string,string>();
    this.keywords.set("name","");
    this.keywords.set("qualification","");
    this.keywords.set("all","");
  }*/
}
