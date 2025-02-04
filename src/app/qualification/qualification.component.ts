import { Component, computed, DoCheck, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ButtonComponent } from "../components/button/button.component";
import { TableComponent } from "../components/table/table.component";
import { QualificationFormComponent } from "../components/qualification-form/qualification-form.component";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { QualificationService } from "../services/qualification.service";
import { Subscription } from "rxjs";
import { Qualification } from "../models/Qualification";
import { Label } from "../components/table/label";
import { SelectionBehaviour } from "../components/table/selection-behaviour";
import { Routing } from "../components/table/routing";
import { TableConfiguration } from "../components/table/table-configuration";
import { Employee } from "../models/Employee";
import { EmployeeFilterService } from "../services/employee-filter.service";
import { EmployeesCacheService } from "../services/employees-cache.service";
import { EmployeeService } from "../services/employee.service";
import { QualificationsCacheService } from '../services/qualifications-cache.service';
import { AdHocCache } from '../services/ad-hoc-cache';
import { AppGlobals } from '../app.globals';

@Component({
  selector: 'app-qualification',
  standalone: true,
  imports: [QualificationFormComponent, FormsModule, CommonModule, ButtonComponent, TableComponent, RouterLink],
  templateUrl: './qualification.component.html',
  styleUrl: './qualification.component.css'
})
export class QualificationComponent implements OnInit, OnDestroy, DoCheck {
  private activatedRoute = inject(ActivatedRoute);
  id: number | undefined = undefined;
  qualificationFormData: Qualification | undefined = undefined;
  private subscriptions: Subscription[] = [];
  adHocCache!: AdHocCache<Employee>;
  tableData!: Signal<Employee[]>;
  areCachesLoaded: boolean = false;
  selectedData!: Employee[];
  qualificationSignal!: Signal<Qualification>;
  formerEmployeeCollection!: Employee[];

  constructor(
    private qualificationService: QualificationService,
    private qualificationCache: QualificationsCacheService,
    private employeeFilter: EmployeeFilterService,
    private employeeCache: EmployeesCacheService,
    private employeeService: EmployeeService) {
    this.adHocCache = new AdHocCache([]);
  }


  ngOnInit(): void {
    if(AppGlobals.UNSAVED_QUALIFICATION != null &&
      AppGlobals.UNSAVED_QUALIFICATION != "" &&
      AppGlobals.UNSAVED_QUALIFICATION != undefined ){

      let formdata = new Qualification();
      formdata.skill = AppGlobals.UNSAVED_QUALIFICATION!;
      if(this.id) formdata.id = this.id!;

      this.qualificationFormData = formdata;
    }
    this.employeeCache.refresh();
    this.qualificationCache.refresh();
    this.qualificationFormData
    this.id = this.activatedRoute.snapshot.params['id'];
    this.computeTableContent();
    this.computeFormData();
    this.selectedData = this.employeeCache.withdrawSelected(this.activatedRoute.snapshot.url.join("/"));
    this.adHocCache.setSignalFromArray(this.selectedData)
    this.qualificationCache.notifyStateChange();
  }

  private computeFormData() {
    this.qualificationSignal = computed(() => {
      this.qualificationCache.detectStateChange();
      const qualification = this.qualificationCache.select(this.id!);
      const form = this.qualificationFormData;
      //this.qualificationFormData = qualification;
      return form ?? qualification ?? new Qualification();
    });
  }

  private computeTableContent() {
    this.tableData = computed(() => {
      // this.adHocCache.detectStateChange();
      // this.qualificationCache.detectStateChange();
      // this.employeeCache.detectStateChange();
      // let employees: Employee[] = this.adHocCache.read()();
      // this.selectedData.forEach(outer => {
      //   if (!employees.find(inner => inner.id == outer.id))
      //     employees.push(outer);
      // })
      // return employees;
      return this.adHocCache.read()();
    });
  }

  ngDoCheck(): void {
    if (this.areCachesLoaded)
      return;

    this.areCachesLoaded = !this.employeeCache.isLoading().has(-1) && !this.qualificationCache.isLoading().has(-1);

    if (this.areCachesLoaded) {
      this.areCachesLoaded = true;

      let employees: Employee[] = [];
      if (this.id && !AppGlobals.DIRTY_URLS.has(this.id)) {
        const qualification: Qualification | undefined = this.qualificationCache.select(this.id!);
        employees = this.employeeCache.read()();
        if (qualification) {
          employees = this.employeeFilter.filterEmployeesByQualificationId(employees, qualification.id!);
          this.formerEmployeeCollection = employees;
        }
        AppGlobals.DIRTY_URLS.add(this.id);
      }
      this.adHocCache.read()().forEach(outer => {
        if (!employees.find(inner => inner.id == outer.id)) {
          employees.push(outer);
        }
      });
      this.adHocCache.setSignalFromArray(employees);
      this.adHocCache.notifyStateChange();
    }
  }


  configureTable(): TableConfiguration<Employee> {
    const labels: Label<Employee>[] = [
      new Label('id', 'ID'),
      new Label('firstName', 'First Name'),
      new Label('lastName', 'Last Name'),
    ];
    const selectionBehaviour = new SelectionBehaviour(false, '');
    const routing = new Routing(false, '');

    return new TableConfiguration<Employee>(
      this.adHocCache, labels, true, selectionBehaviour, routing
    );
  }

  submitDataToBackend() {
    const touchedQualification: Qualification = this.qualificationFormData ?? new Qualification();
    touchedQualification.id = this.id;
    if (touchedQualification.id) {
      this.subscriptions.push(this.qualificationService.update(touchedQualification).subscribe(() => this.qualificationCache.notifyStateChange()))
    } else {
      this.subscriptions.push(this.qualificationService.insert(touchedQualification).subscribe(() => this.qualificationCache.notifyStateChange()))
    }
    const listedEmployees: Employee[] = this.adHocCache.read()();
    listedEmployees.forEach(employee => {
      const qualifications = employee.qualifications ?? [];

      if (!qualifications.find(entry => entry.id == touchedQualification.id)) {
        employee.qualifications?.push(touchedQualification);
      } else {
        employee.qualifications = qualifications.filter(entry => entry.id != touchedQualification.id);
        employee.qualifications.push(touchedQualification);
      }
      this.subscriptions.push(this.employeeService.update(employee).subscribe(() => this.employeeCache.notifyStateChange()));
    })
    const stupidEmployees = this.formerEmployeeCollection.filter(outer => !listedEmployees.find(inner => outer.id == inner.id))
    stupidEmployees.forEach(employee => {
      const qualifications = (employee.qualifications ?? []).filter(qualification => qualification.id != touchedQualification.id);
      employee.qualifications = qualifications;
      this.subscriptions.push(this.employeeService.update(employee).subscribe(() => this.employeeCache.notifyStateChange()));
    })
    if (this.id)
      AppGlobals.DIRTY_URLS.delete(this.id);
    this.clearSessionQualification();
  }
  updateQualificationData(data: Qualification) {
    this.qualificationFormData = data;
    AppGlobals.UNSAVED_QUALIFICATION = data.skill!;
  }

  ngOnDestroy(): void {
    this.tableData().forEach(val => this.employeeCache.addToSelected(this.activatedRoute.snapshot.url.join("/"), val));
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  clearSessionQualification() : void{
    AppGlobals.UNSAVED_QUALIFICATION = "";
  }

}

