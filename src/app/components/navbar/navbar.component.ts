import { Component } from '@angular/core';

enum Domain{
  employee = 'Employee',
  qualification = 'Qualification'
}

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  standalone: true,
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  domains = Domain;
  active:Domain = this.domains.employee;
  logoutIcon:String = 'assets/logout.png';

  setActive(navbarItem: Domain){
    this.active = navbarItem;
  }

}
