import { NgModule , Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {EmployeeComponent} from "./employee/employee.component";
import {EmployeeFormComponent} from "./components/employee-form/employee-form.component";

@Component({
  selector: 'app-root',
  imports: [FormsModule,CommonModule, EmployeeListComponent, NavbarComponent, EmployeeComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})



export class AppComponent {
  title = 'lf10StarterNew';
}
