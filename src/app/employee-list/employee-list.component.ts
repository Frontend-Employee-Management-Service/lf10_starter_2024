import {Component, computed, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../models/Employee";
import {EmployeeService} from "../services/employee.service";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {TextFilterComponent} from "../components/text-filter/text-filter.component";
import {EmployeeFilterService} from "../services/employee-filter.service";
import { TableComponent } from "../components/table/table.component";
import { TableConfiguration } from '../components/table/table-configuration';
import { Label } from '../components/table/label';
import { SelectionBehaviour } from '../components/table/selection-behaviour';
import { Routing } from '../components/table/routing';
import { ButtonComponent } from "../components/button/button.component";
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, TextFilterComponent, TableComponent, ButtonComponent, RouterLink, RouterModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit{
  listedEmployees: Signal<Employee[]> = signal([]);
  private readonly NAME: number = 0; 
  private readonly QUALIFICATION: number = 1; 
  private readonly ALL: number = 2; 
  
  private keywords: WritableSignal<string[]> = signal(["", "", ""]);
  public tableConfiguration!: TableConfiguration<Employee>;

  constructor(private http: HttpClient, private service: EmployeeService,
              private employeeCache: EmployeesCacheService,
              private filterService: EmployeeFilterService) {
    employeeCache.refresh();

    this.listedEmployees = computed<Employee[]>(() => {
      let result: Employee[] = this.employeeCache.read()(); 
      const words = this.keywords();
      if (words[this.NAME]) {
        result = this.filterService.filterEmployeesByNames(result, words[this.NAME]);
      }
      if (words[this.QUALIFICATION] != "") {
        result = this.filterService.filterEmployeesByQualification(result, words[this.QUALIFICATION]);
      }
      if (words[this.ALL] != "") {
        result = this.filterService.filterAllEmployeeFields(result, words[this.ALL]);

      }
      return result;
    })
   
  }

  ngOnInit(): void {
    const labels: Label<Employee>[] = [
      new Label("id", "ID"),
      new Label("lastName", "Last Name"),
      new Label("firstName", "First Name"),
      new Label("street", "Street"),
      new Label("postcode", "Postcode"),
      new Label("city", "City"),
      new Label("phone", "Phone")
    ];
    const selectionBehaviour: SelectionBehaviour = new SelectionBehaviour(false, ""); 
    const routing: Routing = new Routing(true, "/employee/edit");

    this.tableConfiguration = new TableConfiguration(
      this.employeeCache,
      labels,
      true,
      selectionBehaviour,
      routing
    );
  }

  handleEventFilterByName(event: { value: string }) {
    this.setFilterKeyword(this.NAME, event.value);
  }

  handleEventFilterByQualification(event: { value: string }) {
    this.setFilterKeyword(this.QUALIFICATION, event.value);
  }

  handleEventFilterAll(event: { value: string }) {
    this.setFilterKeyword(this.ALL, event.value);
  }

  setFilterKeyword(key: number, value: string) {
    const localWords = [...this.keywords()]; // it is import to make a new array! otherwise the signal does not detect the change
    localWords[key] = value;
    this.keywords.set(localWords);
  }
}
