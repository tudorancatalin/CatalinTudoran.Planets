export class Captain {
  public id: number;
  public name: string;
  public userName: string;
  public isAvailable: boolean;

  constructor(id: number, name: string, userName: string, isAvailable: boolean) {
    this.id = id;
    this.name = name;
    this.userName = userName;
    this.isAvailable = isAvailable;
  }
}
