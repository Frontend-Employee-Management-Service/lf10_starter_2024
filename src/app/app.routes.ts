import {Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {AppAuthGuard} from "./app.authguard";
import {EmployeeComponent} from "./employee/employee.component";
import {QualificationComponent} from "./qualification/qualification.component";

export const routes: Routes = [ {path: '', component: AppComponent, canActivate: [AppAuthGuard]}
, {path: 'employee', component: EmployeeComponent, canActivate: [AppAuthGuard]},
  {path: 'qualification', component: QualificationComponent, canActivate: [AppAuthGuard]}];
