import {Component, inject, OnInit, Signal,computed, signal, WritableSignal} from '@angular/core';
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

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeFormComponent, FormsModule, CommonModule, ButtonComponent, TableComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{
  private activatedRoute = inject(ActivatedRoute);
  id!: number;

  formDataEmployee: WritableSignal<Employee> = signal(new Employee());

  emp!: Employee;
  employee!: Signal<Employee|undefined>;
  configuration!: TableConfiguration<Employee>;
   qualifications!: Signal<Qualification[]>;

  constructor(public employeeCacheService:EmployeesCacheService, private qualificationCacheService
  :QualificationsCacheService, public employeeService: EmployeeService) {
  }


  // Handle updates from the child
  updateEmployeeData(data: Employee) {
    this.formDataEmployee.set(data); // Update local state
  }

  // Handle final form submission
  submitDataToBackend() {
    console.log('Submitting to backend:', this.formDataEmployee());
    if (this.formDataEmployee()){

      const payload =  this.formDataEmployee()!;
      payload.qualifications = this.qualifications();
      this.employeeCacheService.insert(payload);
    }
    console.log(this.employeeCacheService.read()())
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.employeeService.select(this.id).subscribe((employee: Employee) => {
      this.emp = employee;
      console.log("Employee loaded:", this.emp);
    });

    //this.employee = new Employee();
    // if (this.id!=null) {
    //   this.employeeCacheService.refresh();
    //   this.e = this.employeeCacheService.select(this.id)!;
    //   console.log("Employee loaded:", this.e);
    // }
    this.employeeCacheService.refresh();

    this.employee = computed(()=> {
      const employees = this.employeeCacheService.read()();
      const emp = employees.find((employee: Employee) => employee.id == this.id)
      console.log("Employee loaded:", emp);
      return emp;
    })

    this.qualifications = computed(()=> {
      this.employeeCacheService.read()();
      const tempQualifications =  this.employee()?.qualifications;
      console.log("Qualifications loaded:", this.employee());

      if (tempQualifications){
        return tempQualifications;
      }
      return [];
    })


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
