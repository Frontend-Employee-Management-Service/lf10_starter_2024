import {Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {EmployeeFormComponent} from "../components/employee-form/employee-form.component";
import {CommonModule} from "@angular/common";
import {Employee} from "../models/Employee";
import {EmployeesCacheService} from "../services/employees-cache.service";

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeFormComponent, FormsModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit{
  employee!: Employee;

  constructor(private employeeCacheService:EmployeesCacheService) {

  }

  // Handle updates from the child
  updateEmployeeData(data: Employee) {
    this.employee = data; // Update local state
  }

  // Handle final form submission
  submitDataToBackend() {
    console.log('Submitting to backend:', this.employee);
    this.employee.qualifications = [];
    this.employee.street = '123 Main St';
    this.employee.postcode = '12345';
    this.employeeCacheService.insert(this.employee);
    console.log(this.employeeCacheService.read()())
    // Perform backend API call or other actions here
  }

  ngOnInit(): void {
    this.employee = new Employee();
    this.employeeCacheService.refresh();
  }
}
