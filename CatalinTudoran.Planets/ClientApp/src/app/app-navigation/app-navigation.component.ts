import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppNavigationConfig } from './app-navigation-config';
import { AppNavigationLink } from './app-navigation-link';
import { AppNavigationLinksService } from './app-navigation-link.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.css']
})
export class AppNavigationComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  @Output() config: AppNavigationConfig;
  @Output() showSideBar: boolean;
  @ViewChild('sidenav', { static: false }) private sidenav: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver,
    private appNavigationLinksService: AppNavigationLinksService) {

    this.config = new AppNavigationConfig(new Array<AppNavigationLink>(), new Array<AppNavigationLink>());
    appNavigationLinksService.appNavigationConfig$.subscribe(config => {
      this.config = config;
      this.showSideBar = config && config.sideBarLinks && config.sideBarLinks.length > 0;
    });
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }
}
