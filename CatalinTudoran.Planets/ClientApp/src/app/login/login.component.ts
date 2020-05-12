import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AppNavigationLinksService } from '../app-navigation/app-navigation-link.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  errors: string;
  isRequesting: boolean;
  submitted: boolean = false;

  loginForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private appNavigationService: AppNavigationLinksService) {

    appNavigationService.setMenus();

    this.loginForm = this.fb.group({
      account: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit() {

    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.loginForm.value.account = param['account'];
      });
  }

  ngOnDestroy() {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  login() {
    this.submitted = true;
    this.isRequesting = true;
    this.errors = '';
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.account, this.loginForm.value.password)
        .pipe(finalize(() => this.isRequesting = false))
        .subscribe(
          result => {
            if (result) {
              let navRoute = this.authService.isCaptain() ? ['/admin/home'] : ['/home'];
              this.router.navigate(navRoute);
            }
          },
          error => this.errors = error);
    }
  }
}
