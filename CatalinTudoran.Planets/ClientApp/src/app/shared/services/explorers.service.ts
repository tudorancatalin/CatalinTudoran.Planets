import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Captain } from "../models/captain.class";
import { Robot } from "../models/robot.class";
import { AuthService } from "./auth.service";
import { BaseService } from "./base.service";

@Injectable()
export class ExplorersService extends BaseService {
  baseUrl: string = 'http://localhost:5000/api/explorers';

  constructor(private httpClient: HttpClient,
    public authService: AuthService) {
    super(authService);
  }

  getAllCaptains() {
    return this.httpClient.get<Captain[]>(this.baseUrl + '/captains', { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getAllAvailableCaptains() {
    return this.httpClient.get<Captain[]>(this.baseUrl + '/availableCaptains', { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getAllRobots() {
    return this.httpClient.get<Robot[]>(this.baseUrl + '/robots', { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getAllAvailableRobots(explorersTeamId: number) {
    let httpParams = new HttpParams()
      .set("explorersTeamId", explorersTeamId ? explorersTeamId.toString() : "0");

    return this.httpClient.get<Captain[]>(this.baseUrl + '/availableRobots', { headers: this.headers, params: httpParams })
      .pipe(catchError(this.handleError));
  }

  createExplorer(userName: string, name: string, password: string, isCaptain: boolean): Observable<boolean> {
    let body = JSON.stringify({ userName, name, password });
    if (isCaptain) {
      return this.httpClient.post(this.baseUrl + '/captain', body, { headers: this.headers })
        .pipe(map(res => true), catchError(this.handleError));
    }
    else {
      return this.httpClient.post(this.baseUrl + '/robot', body, { headers: this.headers })
        .pipe(map(res => true), catchError(this.handleError));
    }
  }

  updateExplorer(id: number, userName: string, name: string): Observable<boolean> {
    let body = JSON.stringify({ id, userName, name });

    return this.httpClient.put(this.baseUrl + "/explorer/" + id, body, { headers: this.headers })
      .pipe(map(res => true), catchError(this.handleError));
  }

  resetPassword(id: string, password: string): Observable<boolean> {
    let body = JSON.stringify({ id, password });

    return this.httpClient.put(this.baseUrl + "/resetPassword/" + id, body, { headers: this.headers })
      .pipe(map(res => true), catchError(this.handleError));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    let body = JSON.stringify({ currentPassword, newPassword });
    let headers = this.headers;
    return this.httpClient.put(this.baseUrl + "/changePassword", body, { headers })
      .pipe(map(res => true), catchError(this.handleError));
  }

  delete(id: string) {
    return this.httpClient.delete(this.baseUrl + "/explorer/" + id, { headers: this.headers })
      .pipe(map(res => true), catchError(this.handleError));
  }
}
