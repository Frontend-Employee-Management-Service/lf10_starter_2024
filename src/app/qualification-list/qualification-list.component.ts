import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { CheckboxComponent } from "../components/checkbox/checkbox.component";
import { TextFilterComponent } from "../components/text-filter/text-filter.component";
import { Employee } from "../models/Employee";
import { HttpClient } from "@angular/common/http";
import { EmployeeService } from "../services/employee.service";
import { EmployeesCacheService } from "../services/employees-cache.service";
import { QualificationFilterService } from "../services/qualification-filter.service";
import { Qualification } from "../models/Qualification";
import { TableConfiguration } from "../components/table/table-configuration";
import { Label } from "../components/table/label";
import { SelectionBehaviour } from "../components/table/selection-behaviour";
import { Routing } from "../components/table/routing";
import { TableComponent } from "../components/table/table.component";
import { ButtonComponent } from "../components/button/button.component";
import { QualificationsCacheService } from "../services/qualifications-cache.service";
import { RouterLink } from "@angular/router";
import { AppGlobals } from '../app.globals';

@Component({
  selector: 'app-qualification-list',
  standalone: true,
  imports: [
    CheckboxComponent,
    TextFilterComponent,
    TableComponent,
    ButtonComponent,
    RouterLink
  ],
  templateUrl: './qualification-list.component.html',
  styleUrl: './qualification-list.component.css'
})
export class QualificationListComponent {
  //Data
  listedQualifications: Signal<Qualification[]> = signal([]);
  //Filter
  private inUseIsChecked: WritableSignal<boolean> = signal(true); //By default, both checkboxes are checked (list all the entries)
  private unusedIsChecked: WritableSignal<boolean> = signal(true);
  private keywords: WritableSignal<Map<string, string>> = signal(new Map<string, string>());
  tableConfiguration: TableConfiguration<Qualification>;

  constructor(
    private employeeCache: EmployeesCacheService,
    private qualificationCache: QualificationsCacheService,
    private qualificationFilter: QualificationFilterService) {
    AppGlobals.DIRTY_URLS.clear();
    employeeCache.refresh();
    qualificationCache.refresh();
    this.listedQualifications = computed<Qualification[]>(() => {
      const filtersKeywords = this.keywords();
      const inUse = this.inUseIsChecked();
      const unused = this.unusedIsChecked();
      return this.doFilter(filtersKeywords, inUse, unused, this.qualificationCache.read()(), this.employeeCache.read()());
    });

    //Table configuration
    let labels: Label<Qualification>[] = [
      new Label('id', 'id'),
      new Label('skill', 'skill')
    ];
    let selectionBehaviour: SelectionBehaviour = new SelectionBehaviour(false, '');
    let routing: Routing = new Routing(true, "/qualification/edit");
    this.tableConfiguration = new TableConfiguration(
      this.qualificationCache,
      labels, true, selectionBehaviour, routing);
  }

  handleEventInUseCheckbox(event: { check: boolean }) {
    this.inUseIsChecked.set(event.check);
  }

  handleEventUnusedCheckbox(event: { check: boolean }) {
    this.unusedIsChecked.set(event.check);
  }

  handleEventFilterByQualification(event: { value: string }) {
    this.setFilterKeyword('qualification', event.value);
  }

  handleEventFilterByEmployee(event: { value: string }) {
    this.setFilterKeyword('employee', event.value);
  }

  setFilterKeyword(key: string, value: string) {
    const filterKeywords = this.keywords();
    if (value == null || value == "") {
      filterKeywords.delete(key)
    } else {
      filterKeywords.set(key, value);
    }
    const newMap = new Map<string, string>();
    filterKeywords.forEach((value, key) => { newMap.set(key, value); });
    this.keywords.set(newMap);
  }

  private doFilter(filtersKeywords: Map<string, string>, inUse: boolean, unused: boolean,
    allQualifications: Qualification[], allEmployees: Employee[]): Qualification[] {
    let finalResult: Qualification[] = this.qualificationFilter
      .filterByUsagesCheckboxes(allQualifications, allEmployees, inUse, unused);

    if (filtersKeywords.has("employee")) {
      const filterByEmployeesResult = this.qualificationFilter
        .filterQualificationsByEmployeeName(allEmployees, filtersKeywords.get("employee")!);
      finalResult = this.qualificationFilter.getIntersectionOfResultSets(finalResult, filterByEmployeesResult);
    }
    if (filtersKeywords.has("qualification")) {
      finalResult = this.qualificationFilter.filterColumn(finalResult, 'skill', filtersKeywords.get("qualification")!);
    }
    return finalResult;
  }

}
