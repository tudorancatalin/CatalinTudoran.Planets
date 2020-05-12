import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppNavigationLinksService } from '../app-navigation/app-navigation-link.service';
import { ExplorersUpsertComponent, UpsertMode } from '../explorers-upsert/explorers-upsert.component';
import { Captain } from '../shared/models/captain.class';
import { Robot } from '../shared/models/robot.class';
import { DialogService } from '../shared/services/dialog.service';
import { ExplorersService } from '../shared/services/explorers.service';

@Component({
  selector: 'app-explorers',
  templateUrl: './explorers.component.html',
  styleUrls: ['./explorers.component.css']
})
export class ExplorersComponent implements OnInit {

  columnsToDisplay = ['name', 'userName', 'isAvailable', 'edit', 'delete', 'resetPassword'];
  captainsDataSource: MatTableDataSource<Captain>;
  robotsDataSource: MatTableDataSource<Robot>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private dialogRef: MatDialogRef<ExplorersUpsertComponent, any>;

  constructor(private explorersService: ExplorersService,
    public dialog: MatDialog,
    private navigationLinksService: AppNavigationLinksService,
    private dialogService: DialogService
  ) {
    navigationLinksService.setMenus();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadCaptains();
    this.loadRobots();
  }

  private loadCaptains() {
    this.explorersService.getAllCaptains().subscribe((captainsResult: Captain[]) => {
      this.captainsDataSource = new MatTableDataSource<Captain>(captainsResult);
      this.captainsDataSource.sort = this.sort;
    },
      errors => {
        this.dialogService.showErrorMessageBox(errors);
      });
  }

  private loadRobots() {
    this.explorersService.getAllRobots().subscribe((robotsResult: Robot[]) => {
      this.robotsDataSource = new MatTableDataSource<Robot>(robotsResult);
      this.robotsDataSource.sort = this.sort;
    },
      errors => {
        this.dialogService.showErrorMessageBox(errors);
      });
  }

  createNew(isCaptain: boolean) {
    this.openUpsertDialog(UpsertMode.create, isCaptain);
  }

  update(user: any) {
    this.openUpsertDialog(UpsertMode.update, false, user);
  }

  resetPassword(user: any) {
    this.openUpsertDialog(UpsertMode.resetPassword, false, user);
  }

  private openUpsertDialog(upsertMode: UpsertMode, isCaptain: boolean = null, user: any = null) {
    let upsertedUser = user === undefined || user === null ? null : user;

    this.dialogRef = this.dialog.open(ExplorersUpsertComponent, {
      width: '80%',
      maxWidth: '1000px',
      data: {
        user: upsertedUser,
        upsertMode: upsertMode,
        isCaptain: isCaptain
      },
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      let message = '';
      if (result === 'created') {
        message = 'Explorer has been created.';
      } else if (result === 'updated') {
        message = 'Explorer has been updated.';
      } else {
        return;
      }

      this.reloadAfterSuccessfulOperation(message);
    });
  }

  private reloadAfterSuccessfulOperation(message: string) {
    this.loadCaptains();
    this.loadRobots();
    this.dialogService.showMessageBox("Succes", message);
  }

  delete(id: string) {
    this.explorersService.delete(id).subscribe(result => {
      this.reloadAfterSuccessfulOperation('Explorer has been deleted.');
    },
      errors => {
        this.dialogService.showErrorMessageBox(errors);
      });
  };
}
