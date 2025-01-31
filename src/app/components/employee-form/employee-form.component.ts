import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Employee} from "../../models/Employee";

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './employee-form.component.html',
  standalone: true,
  styleUrl: './employee-form.component.css'
})

export class EmployeeFormComponent implements OnInit{
  @Input() employee!: Employee;
  @Output() formDataChange = new EventEmitter<Employee>();

  ngOnInit(): void {
    // Ensure employee is always initialized
    if (!this.employee) {
      this.employee = new Employee(undefined, '', '', '', '', '', '', []);
    }
  }

  updateFormData() {
    this.formDataChange.emit(this.employee);
  }




}
