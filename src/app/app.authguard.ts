import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';

@Injectable({providedIn: 'root'})
export class AppAuthGuard extends KeycloakAuthGuard {
  constructor(
    router: Router,
    private keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    } else {
      try {
        await this.keycloak.loadUserProfile(true);
      } catch (e) {
        console.error(e);
      }
    }
    return this.authenticated;
  }
}
