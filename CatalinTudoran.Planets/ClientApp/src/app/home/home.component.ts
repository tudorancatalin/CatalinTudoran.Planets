import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AppNavigationLinksService } from '../app-navigation/app-navigation-link.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private isCaptain: boolean;
  public isLoggedIn: boolean;

  constructor(private appNavigationLinksService: AppNavigationLinksService,
    private authService: AuthService,
    private route: ActivatedRoute) {

    this.route.data.pipe(map(data => data.logout)).subscribe(logout => {
      if (logout === true) {
        authService.logout();
      }
      appNavigationLinksService.setMenus();
    });

    this.isCaptain = authService.isCaptain();
    this.isLoggedIn = authService.isLoggedIn();
  }

  ngOnInit() {
  }

}
