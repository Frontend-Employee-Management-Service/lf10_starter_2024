import {Routes} from '@angular/router';
import {AppComponent} from "./app.component";
import {AppAuthGuard} from "./app.authguard";

export const routes: Routes = [ {path: '', component: AppComponent, canActivate: [AppAuthGuard]}];
