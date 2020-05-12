import { ExplorersTeam } from "./explorersTeam.class";
import { Status } from "./status.class";

export class Planet {
  public id: number;
  public name: string;
  public imageUrl: string;
  public description: string;
  public status: Status;
  public explorersTeam: ExplorersTeam;

  constructor(id: number, name: string, imageUrl: string, description: string, status: Status, explorersTeam: ExplorersTeam) {
    this.id = id;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.status = status;
    this.explorersTeam = explorersTeam;
  }
}
