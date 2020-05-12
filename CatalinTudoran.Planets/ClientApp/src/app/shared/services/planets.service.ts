import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";
import { Planet } from "../models/planet.class";
import { Robot } from "../models/robot.class";
import { Status } from "../models/status.class";
import { AuthService } from "./auth.service";
import { BaseService } from "./base.service";

@Injectable()
export class PlanetsService extends BaseService {
  baseUrl: string = 'http://localhost:5000/api/planets';

  constructor(private httpClient: HttpClient,
    public authService: AuthService) {
    super(authService);
  }

  getAllPlanets() {
    return this.httpClient.get<Planet[]>(this.baseUrl, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  getPlanetStatuses() {
    return this.httpClient.get<Status[]>(this.baseUrl + '/statuses', { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  createPlanet(name: string, imageUrl: string, description: string, statusId: number, captainId: string, robots: Robot[]) {
    let body = JSON.stringify({ name, imageUrl, description, statusId, captainId, robots });

    return this.httpClient.post(this.baseUrl, body, { headers: this.headers })
      .pipe(map(res => true), catchError(this.handleError));
  }

  updatePlanet(id: number, name: string, imageUrl: string, description: string, statusId: number, captainId: string, lastCaptainId: string, robots: Robot[], robotsToSetAvailable: Robot[]) {
    let body = JSON.stringify({ name, imageUrl, description, statusId, captainId, lastCaptainId, robots, robotsToSetAvailable  });

    return this.httpClient.put(this.baseUrl + '/' + id, body, { headers: this.headers })
      .pipe(map(res => true), catchError(this.handleError));
  }
}
