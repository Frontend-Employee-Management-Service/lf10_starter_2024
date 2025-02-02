import {Component, computed, inject, signal, Signal} from '@angular/core';
import {TextFilterComponent} from "../components/text-filter/text-filter.component";
import {EmployeeFormComponent} from "../components/employee-form/employee-form.component";
import {Employee} from "../models/Employee";
import {TableComponent} from "../components/table/table.component";
import {TableConfiguration} from "../components/table/table-configuration";
import {Qualification} from "../models/Qualification";
import {EmployeeService} from "../services/employee.service";
import {Label} from "../components/table/label";
import {SelectionBehaviour} from "../components/table/selection-behaviour";
import {Routing} from "../components/table/routing";
import {HttpClient} from "@angular/common/http";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {QualificationsCacheService} from "../services/qualifications-cache.service";
import {QualificationFilterService} from "../services/qualification-filter.service";
import {ButtonComponent} from "../components/button/button.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {QualificationService} from "../services/qualification.service";

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
  private activatedRoute = inject(ActivatedRoute);
  id!: number;
  tableConfiguration: TableConfiguration<Qualification>;
  listedEmployees: Signal<Employee[]> = signal([]);

  constructor(private http: HttpClient,
              private employeeService: EmployeeService,
              private qualificationService: QualificationService,
              private employeeCache: EmployeesCacheService,
              private qualificationCache: QualificationsCacheService,
              private qualificationFilter: QualificationFilterService,) {
    //Table configuration
    //TODO Question: show all the exising employees? or only those who do not belong to the qualification
    let labels: Label<Employee>[] = [
      new Label('id', 'id'),
      new Label('firstName', 'Firstname'),
      new Label('lastName', 'Lastname'),
    ];
    let selectionBehaviour: SelectionBehaviour = new SelectionBehaviour(false, '');
    let routing: Routing = new Routing(false, "");
    this.tableConfiguration = new TableConfiguration(
      this.employeeCache,
      labels, true, selectionBehaviour, routing);
    employeeCache.refresh();
    this.listedEmployees = computed<Employee[]>(() => {
      let result: Employee[] = this.employeeCache.read()();
      return result;
    })
  }

  handleEventFilter($event: { value: string }) {
    //TODO
  }

  insertNewEmployee($event: Employee) {
    //TODO new Employee then add the employee to the table
    //Question save the employee directly to the DB, right?
  }

  updateAdHocCache() {
    //TODO update Cache
    //send the list of newly added employees to the parent component
  }
}
