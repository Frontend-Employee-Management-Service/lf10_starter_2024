import {Component, inject, OnInit, Signal, computed, signal, WritableSignal, OnDestroy} from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import {ActivatedRoute} from "@angular/router";
import {EmployeeService} from "../services/employee.service";
import {Subscription} from "rxjs";
import {QualificationService} from "../services/qualification.service";

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeFormComponent, FormsModule, CommonModule, ButtonComponent, TableComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit, OnDestroy{
  private activatedRoute = inject(ActivatedRoute);
  id!: number;
  private subscription!: Subscription;

  formDataEmployee: WritableSignal<Employee> = signal(new Employee());

  emp!: Employee;
  qualifications!: Qualification[];
  configuration!: TableConfiguration<Employee>;

  constructor(public employeeCacheService:EmployeesCacheService, private qualificationCacheService
  :QualificationsCacheService, public employeeService: EmployeeService,
              public qualificationService: QualificationService) {
  }


  // Handle updates from the child
  updateEmployeeData(data: Employee) {
    this.formDataEmployee.set(data); // Update local state
  }

  // Handle final form submission
  submitDataToBackend() {
    if (this.formDataEmployee()){
      this.employeeService.insert(this.emp);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.subscription = this.employeeService.select(this.id).
      subscribe((employee: Employee) => {
      this.emp = employee;
    });

    this.subscription = this.qualificationService.selectAll().
        subscribe((qualifications: Qualification[]) => {
      this.qualifications = qualifications;
    });


    this.employeeCacheService.refresh();

    const labels : Label <Qualification> [] = [
      new Label('id', 'ID'),
      new Label('skill', 'Qualification'),
    ]
    const selectionBehaviour = new SelectionBehaviour(false,'');
    const routing = new Routing(false, '');

    this.configuration = new TableConfiguration<Qualification>(
      this.qualificationCacheService, labels, true,selectionBehaviour, routing
    )
  }

  protected readonly signal = signal;
}
