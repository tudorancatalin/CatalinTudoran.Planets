import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpsertMode } from '../explorers-upsert/explorers-upsert.component';
import { Captain } from '../shared/models/captain.class';
import { Robot } from '../shared/models/robot.class';
import { Status } from '../shared/models/status.class';
import { AuthService } from '../shared/services/auth.service';
import { DialogService } from '../shared/services/dialog.service';
import { ExplorersService } from '../shared/services/explorers.service';
import { PlanetsService } from '../shared/services/planets.service';

@Component({
  selector: 'app-planets-upsert',
  templateUrl: './planets-upsert.component.html',
  styleUrls: ['./planets-upsert.component.css']
})
export class PlanetsUpsertComponent implements OnInit {

  private planet: any;
  dialogForm: FormGroup;
  upsertMode: UpsertMode;
  errors: string;
  captains: Captain[];
  statuses: Status[];
  robots: Robot[];
  public sourceRobots: Array<any> = [];
  public confirmedRobots: Array<any> = [];
  isRobotsListBoxDisabled: boolean;

  public imagePath;
  imgURL: any;
  public message: string;

  constructor(public dialogRef: MatDialogRef<PlanetsUpsertComponent>,
    @Inject(MAT_DIALOG_DATA) planetData: any,
    private fb: FormBuilder,
    private explorersService: ExplorersService,
    private planetsService: PlanetsService,
    public authService: AuthService,
    public dialogService: DialogService) {

    this.planet = planetData.planet;
    this.upsertMode = planetData.upsertMode;
    this.imgURL = planetData.planet.imageUrl;

    let controlSet = {
      name: [{
        value: this.planet.name,
        disabled: !this.authService.isCaptain()
      }, [Validators.required]],

      description: [{
        value: this.planet.description,
        disabled: !this.authService.isCaptain()
      }, [Validators.required]],

      captainId: [{
        value: this.planet.explorersTeam.captain ? this.planet.explorersTeam.captain.id : 0,
        disabled: !this.authService.isCaptain()
      }],

      statusId: [{
        value: this.authService.isCaptain() ?  this.planet.status.id : '',
        disabled: !this.authService.isLoggedIn()
      }, [Validators.required]]
    }

    controlSet["planet"] = this.planet;
    this.dialogForm = this.fb.group(controlSet);
  }

  ngOnInit(): void {
    this.loadAvailableCaptains();
    this.loadStatuses();
    this.loadAvailableRobots();

    if (this.upsertMode === UpsertMode.create || this.planet.explorersTeam.captain == null) {
      this.setRobotsListBoxDisbaled();
    }

    this.dialogForm.controls.captainId.valueChanges.subscribe(captainId => {
      if (captainId == 0) {
        this.setRobotsListBoxDisbaled();
        this.robots.forEach(r => {
          this.sourceRobots.push(r.name);
        });
        this.confirmedRobots = [];
      }
      else {
        this.isRobotsListBoxDisabled = false;
      }
    });
  }  

  private setRobotsListBoxDisbaled() {
    this.isRobotsListBoxDisabled = true;
  }

  loadAvailableCaptains() {
    this.explorersService.getAllAvailableCaptains().subscribe((result: Captain[]) => {
      this.captains = result;

      if (this.upsertMode === UpsertMode.update && this.planet.explorersTeam.captain) {
        this.captains.push(this.planet.explorersTeam.captain);
      }
    });
  }

  loadStatuses() {
    this.planetsService.getPlanetStatuses().subscribe((result: Status[]) => {
      if (!this.authService.isCaptain()) {
        this.statuses = result.slice(0, 2);
      }
      else {
        this.statuses = result;
      }
    },
      errors => {
        this.dialogService.showErrorMessageBox(errors);
      });
  }

  loadAvailableRobots() {
    this.explorersService.getAllAvailableRobots(this.planet.explorersTeam.id).subscribe((result: Robot[]) => {
      this.robots = result;
      result.forEach(r => {
        this.sourceRobots.push(r.name);
      });

      if (this.upsertMode === UpsertMode.update) {
        this.planet.explorersTeam.robots.forEach(r => {
          this.sourceRobots.push(r.name);
          this.confirmedRobots.push(r.name)
        });
      }
    })
  }

  public save() {
    if (this.upsertMode === UpsertMode.create) {
      this.createPlanet();
    } else if (this.upsertMode === UpsertMode.update) {
      this.updatePlanet();
    }
  }

  createPlanet() {
    let result = this.dialogForm.value;
    let selectedRobots: Robot[] = this.robots.filter(r => this.confirmedRobots.includes(r.name));
    this.planetsService.createPlanet(result.name, this.imgURL, result.description, result.statusId ? result.statusId : 4, result.captainId, selectedRobots).subscribe(result => {
      this.errors = "";
      this.dialogRef.close("created");
    },
      errors => this.errors = errors
    );
  }

  updatePlanet() {
    let result = this.dialogForm.value;
    let selectedRobots: Robot[] = this.robots.filter(r => this.confirmedRobots.includes(r.name));
    let robotsToSetAvailable: Robot[];

    if (this.confirmedRobots.length != 0) {
      robotsToSetAvailable = this.robots.filter(r => !this.confirmedRobots.includes(r.name));
    }
    else {
      robotsToSetAvailable = this.robots.filter(r => this.sourceRobots.includes(r.name));
    }

    let lastCaptainId: string = result.planet.explorersTeam.captain ? result.planet.explorersTeam.captain.id : "";

    this.planetsService.updatePlanet(result.planet.id,
      this.authService.isCaptain() ? result.name : result.planet.name,
      this.imgURL,
      this.authService.isCaptain() ? result.description : result.planet.description,
      result.statusId,
      this.authService.isCaptain() ? result.captainId : result.planet.explorersTeam.captain.id,
      lastCaptainId,
      selectedRobots,
      robotsToSetAvailable).subscribe(result => {

      this.errors = "";
      this.dialogRef.close("updated");
    },
      errors => this.errors = errors
    );
  }

  formInvalid() {
    return this.dialogForm.invalid || !this.authService.isLoggedIn();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public cancel() {
    this.dialogRef.close();
  }

  showImage(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }

  }
}
