import {Component, signal, WritableSignal} from '@angular/core';
import {CheckboxComponent} from "../components/checkbox/checkbox.component";
import {TextFilterComponent} from "../components/text-filter/text-filter.component";
import {Employee} from "../models/Employee";
import {HttpClient} from "@angular/common/http";
import {EmployeeService} from "../services/employee.service";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {QualificationFilterService} from "../services/qualification-filter.service";
import {Qualification} from "../models/Qualification";
import {TableConfiguration} from "../components/table/table-configuration";
import {Label} from "../components/table/label";
import {SelectionBehaviour} from "../components/table/selection-behaviour";
import {Routing} from "../components/table/routing";
import {TableComponent} from "../components/table/table.component";
import {ButtonComponent} from "../components/button/button.component";
import {QualificationsCacheService} from "../services/qualifications-cache.service";

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [
    CheckboxComponent,
    TextFilterComponent,
    TableComponent,
    ButtonComponent
  ],
  templateUrl: './qualification-list.component.html',
  styleUrl: './qualification-list.component.css'
})
export class QualificationListComponent {
  //Data
  allEmployees: WritableSignal<Employee[]> = signal([]);
  listedQualification: WritableSignal<Qualification[]> = signal([]);
  //Filter
  private inUseIsChecked: boolean = true; //By default, both checkboxes are checked (list all the entries)
  private unusedIsChecked: boolean = true;
  private keywords: Map<string, string> = new Map<string, string>();
  tableConfiguration: TableConfiguration<Qualification>;

  constructor(private http: HttpClient,
              private service: EmployeeService,
              private employeeCache: EmployeesCacheService,
              private qualificationCache: QualificationsCacheService,
              private qualificationFilter: QualificationFilterService) {
    employeeCache.refresh();
    this.allEmployees.set(this.employeeCache.read()());
    qualificationCache.refresh();
    this.listedQualification.set(this.qualificationCache.read()());
    //Table configuration
    let labels: Label<Qualification >[] = [
      new Label('id', 'id'),
      new Label('skill', 'skill')
    ]; //TODO
    let select: SelectionBehaviour = new SelectionBehaviour(false, '');
    let routing: Routing = new Routing(false,'');
    this.tableConfiguration = new TableConfiguration(this.qualificationCache,
      labels, true, select, routing);
  }

  handleEventInUseCheckbox(event: { check: boolean }) {
    this.inUseIsChecked = event.check;
    this.doFilter();
  }

  handleEventUnusedCheckbox(event: { check: boolean }) {
    this.unusedIsChecked = event.check;
    this.doFilter();
  }

  handleEventFilterByQualification(event: { value: string }) {
    this.setFilterKeyword('qualification', event.value);
    this.doFilter();
  }

  handleEventFilterByEmployee(event: { value: string }) {
    this.setFilterKeyword('employee', event.value);
    this.doFilter()
  }

  setFilterKeyword(key: string, value: string) {
    if (value == null || value == "") {
      this.keywords.delete(key)
      this.allEmployees.set(this.employeeCache.read()());
      this.listedQualification.set(this.qualificationCache.read()());
    } else {
      this.keywords.set(key, value);
    }
  }

  private doFilter() {
    console.log("doFilter()");
    console.log('in use:' + this.inUseIsChecked);
    console.log('Unused:' + this.unusedIsChecked);

    let finalResult: Qualification[] = this.qualificationFilter
      .filterByUsagesCheckboxes(this.qualificationCache.read()(), this.employeeCache.read()(), this.inUseIsChecked, this.unusedIsChecked);

    if (this.keywords.has("employee")) {
      const filterByEmployeesResult = this.qualificationFilter.filterQualificationsByEmployeeName(this.employeeCache.read()(), this.keywords.get("employee")!);
      finalResult = this.qualificationFilter.getIntersectionOfResultSets(finalResult, filterByEmployeesResult);
    }
    if (this.keywords.has("qualification")) {
      finalResult = this.qualificationFilter.filterColumn(finalResult, 'skill', this.keywords.get("qualification")!);
    }
    this.listedQualification.set(finalResult);
  }

}
