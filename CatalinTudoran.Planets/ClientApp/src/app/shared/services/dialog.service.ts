import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppNavigationLinksService } from "../../app-navigation/app-navigation-link.service";
import { MessageBoxComponent } from "../message-box/message-box.component";
import { AuthService } from "./auth.service";
import { BaseService } from "./base.service";

@Injectable()
export class DialogService {

  constructor(public authService: AuthService,
    public appNavService: AppNavigationLinksService,
    public dialog: MatDialog,
    public router: Router) {
  }

  public showMessageBox(title: string, message: string) {
    let dialogRef = this.dialog.open(MessageBoxComponent, {
      maxWidth: '600px',
      data: { title: title, message: message, isErrorDialog: false },
      disableClose: true
    });

    return dialogRef;
  }

  public showErrorMessageBox(message: string) {
    let dialogRef = this.dialog.open(MessageBoxComponent, {
      maxWidth: '600px',
      data: { title: "Eroare", message: message, isErrorDialog: true },
      disableClose: true
    });


    dialogRef.afterClosed().subscribe(result => {
      if (message == BaseService.UnauthErrorMessage) {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        this.appNavService.setMenus();
      }
    });
  }
}
