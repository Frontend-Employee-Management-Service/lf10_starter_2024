import {Component, computed, inject, signal, Signal, WritableSignal} from '@angular/core';
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
import {ActivatedRoute, Router, RouterLink, UrlSegment} from "@angular/router";
import {QualificationService} from "../services/qualification.service";
import {EmployeeFilterService} from "../services/employee-filter.service";

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
  private returnUrl: string;
  id!: string;
  //Filter
  keywordSignal: WritableSignal<string> = signal("");
  //Table
  tableConfiguration: TableConfiguration<Qualification>;
  listedEmployees: Signal<Employee[]> = signal([]);
  //Form
  newEmployee: Employee = new Employee();

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private employeeCache: EmployeesCacheService,
              private employeeFilter: EmployeeFilterService,
              private qualificationCache: QualificationsCacheService,
              private qualificationFilter: QualificationFilterService) {
    //TODO clean up this mess
    employeeCache.refresh();
    const temp = employeeCache.read()();
    //From route
    const currentUrl: UrlSegment[] = this.route.snapshot.url;
    this.returnUrl = currentUrl.filter((val, index, arr) => index != arr.length - 1).join("/")
    if (currentUrl[1].toString() == "edit") {
      this.id = currentUrl[2].toString();
      qualificationCache.refresh();
      const qualificationId =Number(this.id);
      const currentQualification= qualificationCache.read()()
        .find(qualification => qualification.id == qualificationId);
      if(currentQualification != undefined){
        //TODO merge main to use it
        //const checkedEmployees = this.employeeFilter.filterEmployeesByQualificationID(employeeCache.read()(), qualificationId)
      }
    }
    //Table configuration
    //TODO Question: show all the exising employees? or only those who do not belong to the qualification
    let labels: Label<Employee>[] = [
      new Label('id', 'id'),
      new Label('firstName', 'Firstname'),
      new Label('lastName', 'Lastname'),
    ];
    let selectionBehaviour: SelectionBehaviour = new SelectionBehaviour(false, this.returnUrl);
    let routing: Routing = new Routing(false);
    this.tableConfiguration = new TableConfiguration(
      this.employeeCache, labels, false, selectionBehaviour, routing);

    this.listedEmployees = computed<Employee[]>(() => {
      this.employeeCache.stateChangeSignal();
      let result: Employee[] = this.employeeCache.read()();
      const keyword = this.keywordSignal();
      result = this.employeeFilter.filterEmployeesByNames(result,keyword);
      return result;
    })
  }

  handleEventFilter(event: { value: string }) {
    this.keywordSignal.set(event.value);
  }

  updateEmployeeForm($event: Employee) {
    this.newEmployee = $event;
  }

  sendAddedEmployees() {
    //TODO update Cache
    //send the list of newly added employees to the parent component(?)
  }

  clearChecks(){
    this.employeeCache.withdrawSelected(this.returnUrl);
  }

  addEmployee() {
    this.employeeCache.insert(this.newEmployee);
    this.newEmployee = new Employee();
    this.employeeCache.notifyStateChange();
  }
}
