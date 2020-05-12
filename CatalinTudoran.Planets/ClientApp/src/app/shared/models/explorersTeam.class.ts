import { Captain } from "./captain.class";
import { Robot } from "./robot.class";

export class ExplorersTeam {
  public captain: Captain;
  public robots: Array<Robot>;

  constructor(captain: Captain, robots: Array<Robot>) {
    this.captain = captain;
    this.robots = robots;
  }
}
