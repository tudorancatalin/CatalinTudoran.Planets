import { HttpHeaders } from "@angular/common/http";
import { AuthService } from "./auth.service";

export class RestCallHeaders {

  constructor(private authService: AuthService) {}

  public getRequestHeadersForLoggedInUserWithCustomHeaders(customHeaders: any): HttpHeaders {
    if (this.authService !== null) {
      customHeaders['Authorization'] = `Bearer ${this.authService.getAuthenticationToken()}`;
      return new HttpHeaders(customHeaders);
    };

    return new HttpHeaders(customHeaders);
  }

  public getRequestHeadersForLoggedInUser(): HttpHeaders {
    return this.getRequestHeadersForLoggedInUserWithCustomHeaders({ 'Content-Type': 'application/json' });
  }
}
