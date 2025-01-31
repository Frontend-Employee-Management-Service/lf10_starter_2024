import {NgModule, Component, Signal, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {EmployeeListComponent} from "./employee-list/employee-list.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {EmployeeComponent} from "./employee/employee.component";
import {EmployeeFormComponent} from "./components/employee-form/employee-form.component";
import {RouterOutlet} from "@angular/router";
import {TableComponent} from "./components/table/table.component";
import {Label} from "./components/table/label";
import {TableConfiguration} from "./components/table/table-configuration";
import {DataCache} from "./services/data-cache";
import {SelectionBehaviour} from "./components/table/selection-behaviour";
import {Routing} from "./components/table/routing";
import {EmployeesCacheService} from "./services/employees-cache.service";
import {EmployeeService} from "./services/employee.service";
import {Cache} from "@angular/cli/lib/config/workspace-schema";

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, EmployeeListComponent, NavbarComponent, EmployeeComponent, RouterOutlet, TableComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'lf10StarterNew';
}
