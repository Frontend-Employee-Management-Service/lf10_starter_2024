import {Routes} from '@angular/router';
import {AppAuthGuard} from "./app.authguard";
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { QualificationListComponent } from './qualification-list/qualification-list.component';
import { EmployeeComponent } from './employee/employee.component';
import {QualificationComponent} from "./qualification/qualification.component";


export const routes: Routes = [
  {path: 'employees', title: "employees", component: EmployeeListComponent, canActivate: [AppAuthGuard]},
  {path: 'qualifications', title: "employees", component: QualificationListComponent, canActivate: [AppAuthGuard]},
  {path: 'employee/new', title: "New Employee", component: EmployeeComponent, canActivate: [AppAuthGuard]},
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
  {path: 'qualification/new', title: "New qualification", component: QualificationComponent, canActivate: [AppAuthGuard]},
  {path: 'qualification/edit/:id', title: "Edit qualification", component: QualificationComponent, canActivate: [AppAuthGuard]},
];
