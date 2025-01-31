import {Routes} from '@angular/router';
import {AppAuthGuard} from "./app.authguard";
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { QualificationListComponent } from './qualification-list/qualification-list.component';


export const routes: Routes = [
  {path: 'employees', title: "employees", component: EmployeeListComponent, canActivate: [AppAuthGuard]},
  {path: 'qualifications', title: "employees", component: QualificationListComponent, canActivate: [AppAuthGuard]},
  { path: '', redirectTo: '/employees', pathMatch: 'full' },
];
