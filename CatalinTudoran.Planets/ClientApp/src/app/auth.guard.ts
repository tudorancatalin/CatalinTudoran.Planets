import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./shared/services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private user: AuthService, private router: Router) { }

  canActivate() {

    if (!this.user.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
