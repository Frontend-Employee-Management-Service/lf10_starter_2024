import { Component, inject, OnInit, Signal, computed, DoCheck } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeFormComponent } from "../components/employee-form/employee-form.component";
import { CommonModule } from "@angular/common";
import { Employee } from "../models/Employee";
import { EmployeesCacheService } from "../services/employees-cache.service";
import { ButtonComponent } from "../components/button/button.component";
import { TableComponent } from "../components/table/table.component";
import { TableConfiguration } from "../components/table/table-configuration";
import { Label } from "../components/table/label";
import { SelectionBehaviour } from "../components/table/selection-behaviour";
import { QualificationsCacheService } from "../services/qualifications-cache.service";
import { Qualification } from "../models/Qualification";
import { Routing } from "../components/table/routing";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeFormComponent, FormsModule, CommonModule, ButtonComponent, TableComponent, RouterLink],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit, DoCheck {
  private activatedRoute = inject(ActivatedRoute);
  id!: number;
  displayedQualificationsSignal!: Signal<Qualification[]>;
  isComponentDataLoaded: boolean = false;
  formDataEmployee: Employee | undefined= undefined;
  selectedData!: Qualification[];
  employeeSigal!: Signal<Employee>;
  configuration!: TableConfiguration<Employee>;

  constructor(
    private qualificationCache: QualificationsCacheService,
    private employeeCache : EmployeesCacheService,
    private employeeService: EmployeeService
  ) {}
  
  ngOnInit(): void {
    this.employeeCache.refresh();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.computeFormContent();
    this.computeTableContent();
    this.employeeCache.notifyStateChange();
    this.configureTable();
    this.selectedData = this.qualificationCache.withdrawSelected(this.activatedRoute.snapshot.url.join("/")); 
  }
  
  private computeFormContent() {
    this.employeeSigal = computed(() => {
      this.employeeCache.detectStateChange();
      const e = this.employeeCache.select(this.id);
      this.formDataEmployee = e;
      return e ?? new Employee();
    });
  }

  private computeTableContent() {
    this.displayedQualificationsSignal = computed(() => {
      this.employeeCache.detectStateChange();
      let qualifications: Qualification[] = [];
      if (this.id) {
        const e = this.employeeCache.select(this.id);
        qualifications =  qualifications.concat(e?.qualifications ?? []);
      }
      this.selectedData.forEach(outer => {
        if(!qualifications.find(inner => inner.id == outer.id))
          qualifications.push(outer);
      })
      return qualifications;
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
      this.qualificationCache, labels, true, selectionBehaviour, routing
    );
  }
  
  ngDoCheck(): void {
    if(this.isComponentDataLoaded)
      return;
    this.employeeCache.notifyStateChange();
    const isCacheStillLoading: boolean = this.employeeCache.isLoading().has(-1);
    if(!isCacheStillLoading)
      this.isComponentDataLoaded = true;
  }

  updateEmployeeData(data: Employee) {
    this.formDataEmployee = data;
  }

  submitDataToBackend() {
    const employee: Employee = this.formDataEmployee ?? new Employee();
    employee.id = this.employeeSigal().id;
    employee.qualifications = this.displayedQualificationsSignal();
    if(employee.id)
      this.employeeService.update(employee);
    else
      this.employeeService.insert(employee);     
  }
}
