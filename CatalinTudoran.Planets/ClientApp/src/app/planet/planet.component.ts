import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Planet } from '../shared/models/planet.class';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.css'],
  host: {
    "(click)": "onClick($event)"
  }
})
export class PlanetComponent implements OnInit {

  private robotsString: string = '';
  statusColor: string = '';
  constructor() { }
  @Input() planet: Planet;
  @Output() updatePlanet: EventEmitter<Planet> = new EventEmitter<Planet>();

  ngOnInit(): void {
    let robots = this.planet.explorersTeam.robots;

    if (this.planet.explorersTeam.robots.length != 0) {
      robots.forEach((robot, index) => {
        if (index == robots.length - 1) {
          this.robotsString += robot.name;
        }
        else {
          this.robotsString += robot.name + ',';
        }
      });
    }

    if (this.planet.status.id == 1) {
      this.statusColor = 'green';
    }
    else if (this.planet.status.id == 2) {
      this.statusColor = 'red';
    }
    else {
      this.statusColor = 'grey';
    }

  }

  onClick(e) {
    this.updatePlanet.emit(this.planet);
  }
}
