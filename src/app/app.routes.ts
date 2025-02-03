import { Routes } from '@angular/router';
import { AppAuthGuard } from "./app.authguard";
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { QualificationListComponent } from './qualification-list/qualification-list.component';
import { EmployeeComponent } from './employee/employee.component';
import { QualificationComponent } from "./qualification/qualification.component";
import { EmployeeAddQualificationComponent } from './employee-add-qualification/employee-add-qualification.component';
import { QualificationAddEmployeeComponent } from "./qualification-add-employee/qualification-add-employee.component";


export const routes: Routes = [
  { path: 'employee', title: "employees", component: EmployeeListComponent, canActivate: [AppAuthGuard] },
  { path: 'qualification', title: "qualifications", component: QualificationListComponent, canActivate: [AppAuthGuard] },
  { path: 'employee/new', title: "New employee", component: EmployeeComponent, canActivate: [AppAuthGuard] },
  { path: 'employee/edit/:id', title: "Edit employee", component: EmployeeComponent, canActivate: [AppAuthGuard] },
  { path: 'employee/new/add_qualifications', title: "newEmployee addQualifications", component: EmployeeAddQualificationComponent, canActivate: [AppAuthGuard] },
  { path: 'employee/edit/:id/add_qualifications', title: "editEmployee addQualifications", component: EmployeeAddQualificationComponent, canActivate: [AppAuthGuard] },
  { path: 'qualification/new', title: "New qualification", component: QualificationComponent, canActivate: [AppAuthGuard] },
  { path: 'qualification/edit/:id', title: "Edit qualification", component: QualificationComponent, canActivate: [AppAuthGuard] },
  { path: 'qualification/new/add_employees', title: "Edit qualification - Add employee", component: QualificationAddEmployeeComponent, canActivate: [AppAuthGuard] },
  { path: 'qualification/edit/:id/add_employees', title: "Edit qualification - Add employee", component: QualificationAddEmployeeComponent, canActivate: [AppAuthGuard] },
  { path: '', redirectTo: '/employee', pathMatch: 'full' },

];
