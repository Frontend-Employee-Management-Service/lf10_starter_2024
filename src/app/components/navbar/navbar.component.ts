import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';

enum Domain{
  employee = 'employee',
  qualification = 'qualification'
}

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{
  domains = Domain;

  active:Domain = this.domains.employee;
  logoutIcon:String = 'assets/logout.png';

  setActive(navbarItem: Domain){
    this.active = navbarItem;
  }

  constructor(private router: Router) {

  }


  redirectToQualification() {
  }



}
