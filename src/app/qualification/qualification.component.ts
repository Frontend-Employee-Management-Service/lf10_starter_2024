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

  constructor(
    private qualificationService: QualificationService,
    private qualificationCache: QualificationsCacheService,
    private employeeFilter: EmployeeFilterService,
    private employeeCache: EmployeesCacheService,
    private employeeService: EmployeeService) {
    this.adHocCache = new AdHocCache([]);
  }


  ngOnInit(): void {
    console.log(this.employeeCache.viewSelected())
    this.employeeCache.refresh();
    this.qualificationCache.refresh();
    this.qualificationFormData
    this.id = this.activatedRoute.snapshot.params['id'];
    this.computeTableContent();
    this.computeFormData();
    this.selectedData = this.employeeCache.withdrawSelected(this.activatedRoute.snapshot.url.join("/"));
    this.qualificationCache.notifyStateChange();
  }

  private computeFormData() {
    this.qualificationSignal = computed(() => {
      this.qualificationCache.detectStateChange();
      const qualification = this.qualificationCache.select(this.id!);
      this.qualificationFormData = qualification;
      return qualification ?? new Employee();
    });
  }

  private computeTableContent() {
    this.tableData = computed(() => {
      this.adHocCache.detectStateChange();
      this.qualificationCache.detectStateChange();
      this.employeeCache.detectStateChange();
      let employees: Employee[] = this.adHocCache.read()();
      this.selectedData.forEach(outer => {
        if (!employees.find(inner => inner.id == outer.id))
          employees.push(outer);
      })
      return employees;
    });
  }

  ngDoCheck(): void {
    console.log("do check")
    if (this.areCachesLoaded)
      return;

    this.areCachesLoaded = !this.employeeCache.isLoading().has(-1) && !this.qualificationCache.isLoading().has(-1);

    if (this.areCachesLoaded) {
      this.areCachesLoaded = true;
      let employees: Employee[] = [];
      if (this.id) {
        console.log(this.id)
        const qualification: Qualification | undefined = this.qualificationCache.select(this.id!);
        employees = this.employeeCache.read()();
        console.log(employees);
        console.log(qualification);
        if (qualification) {
          employees = this.employeeFilter.filterEmployeesByQualificationId(employees, qualification.id!);
        }
        console.log("filtered")
        console.log(employees)
      }
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
    const qualification: Qualification = this.qualificationFormData ?? new Qualification();
    qualification.id = this.qualificationSignal().id;
    if (qualification.id) {
      this.subscriptions.push(this.qualificationService.update(qualification).subscribe())
    } else {
      this.subscriptions.push(this.qualificationService.insert(qualification).subscribe())
    }
    // TODO persist employees with new qualifications

  }
  updateQualificationData(data: Qualification) {
    this.qualificationFormData = data;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


}

