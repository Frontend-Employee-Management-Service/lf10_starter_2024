import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';

enum Domain{
  employee = 'employee',
  qualification = 'qualification'
}

@Component({
  selector: 'app-navbar',
  imports: [
     RouterLink, RouterLinkActive, RouterModule
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{
  domains = Domain;
  private activatedRoute = inject(ActivatedRoute);


  active:Domain = this.domains.employee;
  logoutIcon:String = 'assets/logout.png';

  setActive(navbarItem: Domain){
    this.active = navbarItem;
  }


  redirectToQualification() {
  }

}
