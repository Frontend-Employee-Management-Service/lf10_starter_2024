import { Component, inject, OnInit, Signal, computed, DoCheck, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { AdHocCache } from '../services/ad-hoc-cache';

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
  formDataEmployee: Employee | undefined= undefined;
  selectedData!: Qualification[];
  employeeSigal!: Signal<Employee>;
  configuration!: TableConfiguration<Employee>;
  subscriptions: Subscription[] = [];
  adHocCache!: AdHocCache<Qualification>;
  addSelected: boolean = true;

  constructor(
    private qualificationCache: QualificationsCacheService,
    private employeeCache : EmployeesCacheService,
    private employeeService: EmployeeService
  ) {
    this.adHocCache = new AdHocCache([]);
  }

  
  ngOnInit(): void {
    this.employeeCache.refresh();
    this.id = this.activatedRoute.snapshot.params['id'];
    this.selectedData = this.qualificationCache.withdrawSelected(this.activatedRoute.snapshot.url.join("/")); 
    this.adHocCache.setSignalFromArray(this.selectedData)

    this.computeFormContent();
    this.computeTableContent();
    this.employeeCache.notifyStateChange();
    this.configureTable();
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
      // this.adHocCache.detectStateChange();
      // let qualifications: Qualification[] = [];
      // this.adHocCache.read()().forEach(val => qualifications.push(val));
      // if(this.addSelected){
      //      this.selectedData.forEach(outer => {
      //   if(!qualifications.find(inner => inner.id == outer.id))
      //     qualifications.push(outer);
      // })
      // }
      // return qualifications;
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
    if(this.isComponentDataLoaded)
      return;
    this.employeeCache.notifyStateChange();
    const isCacheStillLoading: boolean = this.employeeCache.isLoading().has(-1);
    if(!isCacheStillLoading){
      this.isComponentDataLoaded = true;
      let qualifications: Qualification[] = [];
      if (this.id) {
        const e = this.employeeCache.select(this.id);
        qualifications =  qualifications.concat(e?.qualifications ?? []);
      }
      this.adHocCache.read()().forEach(outer => {
        if(!qualifications.find(inner=> inner.id == outer.id)){
          qualifications.push(outer);
        }

      })
      this.adHocCache.setSignalFromArray(qualifications);
    }
  }

  updateEmployeeData(data: Employee) {
    this.formDataEmployee = data;
  }

  submitDataToBackend() {
    const employee: Employee = this.formDataEmployee ?? new Employee();
    employee.id = this.employeeSigal().id;
    employee.qualifications = this.displayedQualificationsSignal();
    if(employee.id){
      this.subscriptions.push(this.employeeService.update(employee).subscribe(()=>this.employeeCache.notifyStateChange()));
    }
    else{
      this.subscriptions.push(this.employeeService.insert(employee).subscribe(()=>this.employeeCache.notifyStateChange()));
    }
  }

  ngOnDestroy(): void {
    this.displayedQualificationsSignal().forEach(val => this.qualificationCache.addToSelected(this.activatedRoute.snapshot.url.join("/"), val));
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
