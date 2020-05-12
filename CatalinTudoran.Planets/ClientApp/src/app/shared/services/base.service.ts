import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { RestCallHeaders } from './restCallHeaders.class';

export abstract class BaseService {
  protected restCallHeaders: RestCallHeaders;
  public static UnauthErrorMessage: string = "Unauthorized access. The session may have expired. Please login again.";

  constructor(protected authService: AuthService) {
    this.restCallHeaders = new RestCallHeaders(this.authService);
  }

  get headers() {
    let headers = this.restCallHeaders.getRequestHeadersForLoggedInUser();
    return headers;
  }

  protected handleError(error: any) {
    var applicationError = error.headers.get('Application-Error');

    if (applicationError) {
      return Observable.throw(applicationError);
    }

    var modelStateErrors: string = '';
    if (error.error) {
      for (var key in error.error) {
        if (error.error[key]) {
          modelStateErrors += error.error[key] + '\n';
          console.error(key + ' ' + error.error[key]);
        }
      }
    } else if (error.status === 401) {
      modelStateErrors = BaseService.UnauthErrorMessage;
    }

    modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;
    return throwError(modelStateErrors || 'Error accessing server. Contact your system administrator.');
  }
}
