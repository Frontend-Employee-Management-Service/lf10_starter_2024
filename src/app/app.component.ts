import {Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from "./components/navbar/navbar.component";
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import {EmployeeComponent} from "./employee/employee.component";
import {TableComponent} from "./components/table/table.component";

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, NavbarComponent,EmployeeComponent, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})



export class AppComponent {
  title = 'lf10StarterNew';
}
