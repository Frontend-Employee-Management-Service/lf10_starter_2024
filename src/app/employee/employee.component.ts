import {Component, inject, OnInit, Signal, computed, DoCheck, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {EmployeeFormComponent} from "../components/employee-form/employee-form.component";
import {CommonModule} from "@angular/common";
import {Employee} from "../models/Employee";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {ButtonComponent} from "../components/button/button.component";
import {TableComponent} from "../components/table/table.component";
import {TableConfiguration} from "../components/table/table-configuration";
import {Label} from "../components/table/label";
import {SelectionBehaviour} from "../components/table/selection-behaviour";
import {QualificationsCacheService} from "../services/qualifications-cache.service";
import {Qualification} from "../models/Qualification";
import {Routing} from "../components/table/routing";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {EmployeeService} from '../services/employee.service';
import {Subscription} from 'rxjs';
import {AdHocCache} from '../services/ad-hoc-cache';
import {AppGlobals} from '../app.globals';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeFormComponent, FormsModule, CommonModule, ButtonComponent, TableComponent, RouterLink],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit, DoCheck, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);
  id!: number;
  displayedQualificationsSignal!: Signal<Qualification[]>;
  isComponentDataLoaded: boolean = false;
  formDataEmployee: Employee | undefined = undefined;
  selectedData!: Qualification[];
  employeeSignal!: Signal<Employee>;
  configuration!: TableConfiguration<Employee>;
  subscriptions: Subscription[] = [];
  adHocCache!: AdHocCache<Qualification>;
  addSelected: boolean = true;

  constructor(
    private qualificationCache: QualificationsCacheService,
    private employeeCache: EmployeesCacheService,
    private employeeService: EmployeeService
  ) {
    this.adHocCache = new AdHocCache([]);
  }

  ngOnInit(): void {
    this.getSessionEmployee();

    this.id = this.activatedRoute.snapshot.params['id'];
    this.employeeCache.refresh();
    this.selectedData = this.qualificationCache.withdrawSelected(this.activatedRoute.snapshot.url.join("/"));
    this.adHocCache.setSignalFromArray(this.selectedData)

    this.computeFormContent();
    this.computeTableContent();
    this.employeeCache.notifyStateChange();
    this.configureTable();
  }

  private computeFormContent() {
    this.employeeSignal = computed(() => {
      this.employeeCache.detectStateChange();
      const e = this.employeeCache.select(this.id);
      //this.formDataEmployee = e; this was the reason why the form is always reset.
      const form = this.formDataEmployee;
      return form ?? e ?? new Employee();
    });
  }

  private computeTableContent() {
    this.displayedQualificationsSignal = computed(() => {
      return this.adHocCache.read()();
    });
  }

  private configureTable() {
    const labels: Label<Qualification>[] = [
      new Label('id', 'ID'),
      new Label('skill', 'Qualification'),
    ];
    const selectionBehaviour = new SelectionBehaviour(false, '');
    const routing = new Routing(false, '');
    this.configuration = new TableConfiguration<Qualification>(
      this.adHocCache, labels, true, selectionBehaviour, routing
    );
  }

  ngDoCheck(): void {
    if (this.isComponentDataLoaded)
      return;
    this.employeeCache.notifyStateChange();
    const isCacheStillLoading: boolean = this.employeeCache.isLoading().has(-1);
    if (!isCacheStillLoading) {
      this.isComponentDataLoaded = true;
      let qualifications: Qualification[] = [];

      if (!AppGlobals.DIRTY_URLS.has(this.id)) {
        if (this.id) {
          const e = this.employeeCache.select(this.id);
          qualifications = qualifications.concat(e?.qualifications ?? []);
          AppGlobals.DIRTY_URLS.add(this.id);
        }
      }
      this.adHocCache.read()().forEach(outer => {
        if (!qualifications.find(inner => inner.id == outer.id)) {
          qualifications.push(outer);
        }

      })
      this.adHocCache.setSignalFromArray(qualifications);
    }
  }

  updateEmployeeData(data: Employee) {
    this.formDataEmployee = data;
    AppGlobals.UNSAVED_EMPLOYEE = new Map<string, string>();
    AppGlobals.UNSAVED_EMPLOYEE.set('name', data.firstName!);
    AppGlobals.UNSAVED_EMPLOYEE.set('surname', data.lastName!);
    AppGlobals.UNSAVED_EMPLOYEE.set('street', data.street!);
    AppGlobals.UNSAVED_EMPLOYEE.set('city', data.city!);
    AppGlobals.UNSAVED_EMPLOYEE.set('post', data.postcode!);
    AppGlobals.UNSAVED_EMPLOYEE.set('phone', data.phone!);
  }

  submitDataToBackend() {
    const employee: Employee = this.formDataEmployee ?? new Employee();
    employee.id = this.employeeSignal().id;
    employee.qualifications = this.displayedQualificationsSignal();
    if (employee.id) {
      this.subscriptions.push(this.employeeService.update(employee).subscribe(() => this.employeeCache.notifyStateChange()));
    }
    else {
      this.subscriptions.push(this.employeeService.insert(employee).subscribe(() => this.employeeCache.notifyStateChange()));
    }
    AppGlobals.DIRTY_URLS.delete(this.id);
    // this.qualificationCache.withdrawSelected(this.activatedRoute.snapshot.url.join("/"));
    this.clearSessionEmployee();
  }

  ngOnDestroy(): void {
    this.displayedQualificationsSignal().forEach(val => this.qualificationCache.addToSelected(this.activatedRoute.snapshot.url.join("/"), val));
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  clearSessionEmployee(): void {
    AppGlobals.UNSAVED_EMPLOYEE = new Map<string, string>();
  }

  getSessionEmployee(): void {
    if (AppGlobals.UNSAVED_EMPLOYEE && AppGlobals.UNSAVED_EMPLOYEE.size > 0) {
      this.employeeCache.notifyStateChange();
      const newEmployee = new Employee();
      newEmployee.firstName = AppGlobals.UNSAVED_EMPLOYEE.get('name')!;
      newEmployee.lastName = AppGlobals.UNSAVED_EMPLOYEE.get('surname')!;
      newEmployee.street = AppGlobals.UNSAVED_EMPLOYEE.get('street')!;
      newEmployee.city = AppGlobals.UNSAVED_EMPLOYEE.get('city')!;
      newEmployee.postcode = AppGlobals.UNSAVED_EMPLOYEE.get('post')!;
      newEmployee.phone = AppGlobals.UNSAVED_EMPLOYEE.get('phone')!;
      this.formDataEmployee = newEmployee;
    }
  }
}
