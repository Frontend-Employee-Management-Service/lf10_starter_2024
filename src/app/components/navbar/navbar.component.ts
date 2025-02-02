import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import {KeycloakService} from "keycloak-angular";

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

  active:Domain = this.domains.employee;
  logoutIcon:String = 'assets/logout.png';

  setActive(navbarItem: Domain) {
    this.active = navbarItem;
  }
  constructor(private keycloakService: KeycloakService) {
  }

  logout() {
    this.keycloakService.logout(window.location.origin) // Redirects back to your app after logout
      .then(() => console.log("Logged out successfully!"))
      .catch(err => console.error("Logout failed", err));
  }


  redirectToQualification() {
  }

}
