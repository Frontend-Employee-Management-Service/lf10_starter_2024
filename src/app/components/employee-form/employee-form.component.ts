import {Component, Output, EventEmitter, Input} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './employee-form.component.html',
  standalone: true,
  styleUrl: './employee-form.component.css'
})

export class EmployeeFormComponent {
  @Input() firstname: string = '';
  @Input() lastname: string = '';
  @Input() city: string = '';
  @Input() postcode: string = '';
  @Input() phone: string = '';


  @Output() formDataChange = new EventEmitter<{
    firstname: string;
    lastname: string;
    city: string;
    postcode: string;
    phone: string;
  }>();

  updateFormData() {
    this.formDataChange.emit({
      firstname: this.firstname,
      lastname: this.lastname,
      city: this.city,
      postcode: this.postcode,
      phone: this.phone,
    });
  }




}
