import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AppNavigationLinksService } from '../app-navigation/app-navigation-link.service';
import { UpsertMode } from '../explorers-upsert/explorers-upsert.component';
import { PlanetsUpsertComponent } from '../planets-upsert/planets-upsert.component';
import { Captain } from '../shared/models/captain.class';
import { ExplorersTeam } from '../shared/models/explorersTeam.class';
import { Planet } from '../shared/models/planet.class';
import { Robot } from '../shared/models/robot.class';
import { Status } from '../shared/models/status.class';
import { AuthService } from '../shared/services/auth.service';
import { DialogService } from '../shared/services/dialog.service';
import { PlanetsService } from '../shared/services/planets.service';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrls: ['./planets.component.css']
})
export class PlanetsComponent implements OnInit {

  planets: Planet[];
  private dialogRef: MatDialogRef<PlanetsUpsertComponent, any>;

  constructor(private planetsService: PlanetsService,
    public dialog: MatDialog,
    private navigationLinksService: AppNavigationLinksService,
    private dialogService: DialogService,
    public authService: AuthService
  ) {
    navigationLinksService.setMenus();
  }

  ngOnInit(): void {
    this.loadPlanets();
  }

  loadPlanets() {
    this.planetsService.getAllPlanets().subscribe((result: Planet[]) => {
      this.planets = result;
    });
  }

  create() {
    if (this.authService.isCaptain()) {
      this.openUpsertDialog(UpsertMode.create);
    }
  }

  update(planet: Planet) {
    if (this.authService.isLoggedIn()) {
      this.openUpsertDialog(UpsertMode.update, planet);
    }
  }

  private openUpsertDialog(upsertMode: UpsertMode, planet: Planet = null) {
    let newPlanet = new Planet(0, "", "", "", new Status(0, ""), new ExplorersTeam(new Captain(0, "", "", true), [new Robot(0, "", "", true)]));
    let upsertedPlanet = planet === undefined || planet === null ? newPlanet : planet;

    this.dialogRef = this.dialog.open(PlanetsUpsertComponent, {
      width: '80%',
      maxWidth: '1000px',
      data: {
        planet: upsertedPlanet,
        upsertMode: upsertMode
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      let message = '';
      if (result === 'created') {
        message = 'Planet has been created.';
      } else if (result === 'updated') {
        message = 'Planet has been updated.';
      } else {
        return;
      }

      this.reloadAfterSuccessfulOperation(message);
    });
  }

  private reloadAfterSuccessfulOperation(message: string) {
    this.loadPlanets();
    this.dialogService.showMessageBox("Succes", message);
  }
}
