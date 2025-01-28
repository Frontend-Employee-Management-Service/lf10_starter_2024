import { Component } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import {EmployeeFormComponent} from "../components/employee-form/employee-form.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [EmployeeFormComponent, FormsModule, CommonModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  employeeData = {
    firstname: '',
    lastname: '',
    city: '',
    postcode: '',
    phone: '',
  };

  // Handle updates from the child
  updateEmployeeData(data: {
    firstname: string;
    lastname: string;
    city: string;
    postcode: string;
    phone: string;
  }) {
    this.employeeData = data; // Update local state
  }

  // Handle final form submission
  submitDataToBackend() {
    console.log('Submitting to backend:', this.employeeData);
    // Perform backend API call or other actions here
  }
}
