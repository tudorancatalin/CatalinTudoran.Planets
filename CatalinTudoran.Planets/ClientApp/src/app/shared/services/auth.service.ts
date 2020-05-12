import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { BaseService } from "./base.service";

@Injectable()
export class AuthService extends BaseService {

  baseUrl: string = 'http://localhost:5000/api';
  private loggedIn = false;
  public authTokenLocalStorageName = 'auth_token';
  public isCaptainLocalStorageName = 'is_captain';

  constructor(private httpClient: HttpClient) {
    super(null);
    this.loggedIn = !!localStorage.getItem(this.authTokenLocalStorageName);
  }

  login(userName, password) {
    return this.httpClient
      .post(
        this.baseUrl + '/auth/login', JSON.stringify({ userName, password }), { headers: this.headers })
      .pipe(
        map(res => res = JSON.parse(res.toString())),
        map(res => {
          localStorage.setItem(this.authTokenLocalStorageName, res.auth_token);
          localStorage.setItem(this.isCaptainLocalStorageName, res.isCaptain);
          this.loggedIn = true;
          return true;
        }),
        catchError(this.handleError));
  }

  logout() {
    localStorage.removeItem(this.authTokenLocalStorageName);
    this.loggedIn = false;
  }

  getAuthenticationToken() {
    return localStorage.getItem(this.authTokenLocalStorageName);
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  isCaptain() {
    return this.isLoggedIn() && (localStorage.getItem(this.isCaptainLocalStorageName) === 'true');
  }
}
