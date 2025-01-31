import {Component, OnInit, signal, WritableSignal} from '@angular/core';
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

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeFormComponent, FormsModule, CommonModule, ButtonComponent, TableComponent],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{
  employee!: Employee;
  configuration!: TableConfiguration<Employee>;
  qualifications: WritableSignal<Qualification[]> = signal(
    [new Qualification(1, 'Java'), new Qualification(2, 'Python'), new Qualification(3, 'C++'),
      new Qualification(4, 'C#'), new Qualification(5, 'JavaScript'), new Qualification(6, 'TypeScript'),
      new Qualification(7, 'HTML'), new Qualification(8, 'CSS'), new Qualification(9, 'SQL'),
      ]);



  constructor(private employeeCacheService:EmployeesCacheService, private qualificationCacheService
  :QualificationsCacheService) {


  }



  // Handle updates from the child
  updateEmployeeData(data: Employee) {
    this.employee = data; // Update local state
  }

  // Handle final form submission
  submitDataToBackend() {
    console.log('Submitting to backend:', this.employee);
    this.employee.qualifications = [];
    this.employeeCacheService.insert(this.employee);
    console.log(this.employeeCacheService.read()())
  }

  ngOnInit(): void {
    this.employee = new Employee();
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
}
