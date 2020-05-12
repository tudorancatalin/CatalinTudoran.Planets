import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { AppNavigationConfig } from './app-navigation-config';
import { AppNavigationLink } from './app-navigation-link';

@Injectable({
  providedIn: 'root'
})
export class AppNavigationLinksService {
  private _appNavigationConfig = new Subject<AppNavigationConfig>();
  appNavigationConfig$ = this._appNavigationConfig.asObservable();

  constructor(private authService: AuthService) { }

  set appNavigationConfig(config: AppNavigationConfig) {
    this._appNavigationConfig.next(config);
  }

  setMenus() {
    let topNavLinks = [];
    let sideBarLinks = [];

    if (this.authService.isLoggedIn()) {
      sideBarLinks.push(new AppNavigationLink("Home", "/"));

      if (this.authService.isCaptain()) {
        topNavLinks.push(new AppNavigationLink("Explorers Team", "/explorers"));
        sideBarLinks.push(new AppNavigationLink("Explorers Team", "/explorers"));
      }

      topNavLinks.push(new AppNavigationLink("Planets", "/planets"));
      sideBarLinks.push(new AppNavigationLink("Planets", "/planets"));

      topNavLinks.push(new AppNavigationLink("Profile", "/profile"));
      sideBarLinks.push(new AppNavigationLink("Profile", "/profile"));

      topNavLinks.push(new AppNavigationLink("LogOut", "/logout"));
      sideBarLinks.push(new AppNavigationLink("LogOut", "/logout"));

    } else {
      topNavLinks.push(new AppNavigationLink("Home", "/"));
      sideBarLinks.push(new AppNavigationLink("Home", "/"));

      topNavLinks.push(new AppNavigationLink("Login", "/auth/login"));
      sideBarLinks.push(new AppNavigationLink("Login", "/auth/login"));
    }

    this.appNavigationConfig = new AppNavigationConfig(topNavLinks, sideBarLinks);
  }
}
