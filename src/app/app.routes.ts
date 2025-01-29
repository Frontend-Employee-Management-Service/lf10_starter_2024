import {Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {AppAuthGuard} from "./app.authguard";
import {EmployeeComponent} from "./employee/employee.component";

export const routes: Routes = [ {path: '', component: AppComponent, canActivate: [AppAuthGuard]
},{path: 'employee/new', component:EmployeeComponent, canActivate: [AppAuthGuard]},
  {path: 'employee/:id', component:EmployeeComponent, canActivate: [AppAuthGuard]}];
