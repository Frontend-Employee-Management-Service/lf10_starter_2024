import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {EmployeeFormComponent} from "../components/employee-form/employee-form.component";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ButtonComponent} from "../components/button/button.component";
import {TableComponent} from "../components/table/table.component";
import {QualificationFormComponent} from "../components/qualification-form/qualification-form.component";
import {ActivatedRoute} from "@angular/router";
import {QualificationService} from "../services/qualification.service";
import {Subscription} from "rxjs";
import {Qualification} from "../models/Qualification";
import {Label} from "../components/table/label";
import {SelectionBehaviour} from "../components/table/selection-behaviour";
import {Routing} from "../components/table/routing";
import {TableConfiguration} from "../components/table/table-configuration";
import {Employee} from "../models/Employee";
import {EmployeeFilterService} from "../services/employee-filter.service";
import {EmployeesCacheService} from "../services/employees-cache.service";
import {EmployeeService} from "../services/employee.service";

@Component({
  selector: 'app-qualification',
  standalone: true,
  imports: [QualificationFormComponent, FormsModule, CommonModule, ButtonComponent, TableComponent, EmployeeFormComponent],
  templateUrl: './qualification.component.html',
  styleUrl: './qualification.component.css'
})
export class QualificationComponent implements OnInit, OnDestroy{

  private activatedRoute = inject(ActivatedRoute);
  id!: number;
  qualification!: Qualification | undefined;
  private subscription!: Subscription;
  configuration!: TableConfiguration<Qualification>;
  employees!: Employee[];
  protected readonly signal = signal;

  constructor(private qualificationService: QualificationService,
              private employeeFilter:EmployeeFilterService, private employeeCacheService:EmployeesCacheService,
              private employeeService: EmployeeService) {
  }


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.subscription = this.qualificationService.selectAll().
      subscribe((qualifications: Qualification[]) => {
        this.qualification = qualifications.find(qualification => qualification.id == this.id);
      }
    )

    this.employeeCacheService.refresh();

    this.employeeService.selectAll().subscribe((employees: Employee[]) => {
      this.employees = this.employeeFilter.filterEmployeesByQualificationId(employees, this.id);
    });

    const labels : Label <Employee> [] = [
      new Label('id', 'ID'),
      new Label('firstName', 'First Name'),
      new Label('lastName', 'Last Name'),
    ]
    const selectionBehaviour = new SelectionBehaviour(false,'');
    const routing = new Routing(false, '');

    this.configuration = new TableConfiguration<Employee>(
      this.employeeCacheService, labels, true,selectionBehaviour, routing
    )
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}

