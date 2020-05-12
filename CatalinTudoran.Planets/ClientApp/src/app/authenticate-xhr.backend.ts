import { Injectable } from "@angular/core";
import { BrowserXhr, Request, Response, ResponseOptions, XHRBackend, XSRFStrategy } from '@angular/http';
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./shared/services/auth.service";


@Injectable()
export class AuthenticateXHRBackend extends XHRBackend {

  constructor(_browserXhr: BrowserXhr,
    _baseResponseOptions: ResponseOptions,
    _xsrfStrategy: XSRFStrategy,
    private authService: AuthService, ) {
    super(_browserXhr, _baseResponseOptions, _xsrfStrategy);
  }

  createConnection(request: Request) {
    let xhrConnection = super.createConnection(request);
    xhrConnection.response = xhrConnection.response
      .pipe(
        catchError((error: Response) => {
          if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {

            console.log('The authentication session expired or the user is not authorized. Force refresh of the current page.');

            localStorage.removeItem(this.authService.authTokenLocalStorageName);
            window.location.href = window.location.href + '?' + new Date().getMilliseconds();
          }
          return throwError(error);
        }));
    return xhrConnection;
  }
}
