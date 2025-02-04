import { Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { TextFilterComponent } from "../components/text-filter/text-filter.component";
import { EmployeeFormComponent } from "../components/employee-form/employee-form.component";
import { Employee } from "../models/Employee";
import { TableComponent } from "../components/table/table.component";
import { TableConfiguration } from "../components/table/table-configuration";
import { Qualification } from "../models/Qualification";
import { Label } from "../components/table/label";
import { SelectionBehaviour } from "../components/table/selection-behaviour";
import { Routing } from "../components/table/routing";
import { EmployeesCacheService } from "../services/employees-cache.service";
import { QualificationsCacheService } from "../services/qualifications-cache.service";
import { ButtonComponent } from "../components/button/button.component";
import { ActivatedRoute, Router, RouterLink, UrlSegment } from "@angular/router";
import { EmployeeFilterService } from "../services/employee-filter.service";

@Component({
  selector: 'app-qualification-add-employee',
  standalone: true,
  imports: [
    TextFilterComponent,
    EmployeeFormComponent,
    TableComponent,
    ButtonComponent,
    RouterLink
  ],
  templateUrl: './qualification-add-employee.component.html',
  styleUrl: './qualification-add-employee.component.css'
})
export class QualificationAddEmployeeComponent {
  //Url
  returnUrl!: string;
  id!: string;
  //Filter
  keywordSignal: WritableSignal<string> = signal("");
  //Table
  tableConfiguration!: TableConfiguration<Qualification>;
  listedEmployees: Signal<Employee[]> = signal([]);
  //Form
  newEmployee: Employee = new Employee();

  constructor(
    private route: ActivatedRoute,
    private employeeCache: EmployeesCacheService,
    private employeeFilter: EmployeeFilterService,
    private qualificationCache: QualificationsCacheService,
  ) {

    employeeCache.refresh();
    this.extractUrl();
    this.initTableConfiguration();

    this.listedEmployees = computed<Employee[]>(() => {
      this.employeeCache.detectStateChange();
      let result: Employee[] = this.employeeCache.read()();
      const keyword = this.keywordSignal();
      result = this.employeeFilter.filterEmployeesByNames(result, keyword);
      return result;
    })
  }

  extractUrl() {
    //From route
    const currentUrl: UrlSegment[] = this.route.snapshot.url;
    this.returnUrl = currentUrl.filter((val, index, arr) => index != arr.length - 1).join("/")
    if (currentUrl[1].toString() == "edit") {
      this.id = currentUrl[2].toString();
      // this.setCheckedEmployees();
    }
  }

  setCheckedEmployees() {
    this.qualificationCache.refresh();
    const qualificationId = Number(this.id);
    const currentQualification = this.qualificationCache.read()()
      .find(qualification => qualification.id == qualificationId);
    if (currentQualification != undefined) {
      const checkedEmployees =
        this.employeeFilter.filterEmployeesByQualificationId(this.employeeCache.read()(), qualificationId);
      checkedEmployees.forEach(employee => { this.employeeCache.addToSelected(this.returnUrl, employee); });
    }
  }

  initTableConfiguration() {
    const labels: Label<Employee>[] = [
      new Label('id', 'id'),
      new Label('firstName', 'Firstname'),
      new Label('lastName', 'Lastname'),
    ];
    let selectionBehaviour: SelectionBehaviour = new SelectionBehaviour(true, this.returnUrl);
    let routing: Routing = new Routing(false);
    this.tableConfiguration = new TableConfiguration(
      this.employeeCache, labels, false, selectionBehaviour, routing);
  }

  handleEventFilter(event: { value: string }) {
    this.keywordSignal.set(event.value);
  }

  updateEmployeeForm($event: Employee) {
    this.newEmployee = $event;
  }

  addEmployee() {
    this.employeeCache.insert(this.newEmployee);
    this.newEmployee = new Employee();
    this.employeeCache.notifyStateChange();
  }
}
