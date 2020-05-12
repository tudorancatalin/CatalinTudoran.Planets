import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent {
  public message: string;
  public title: string;
  public isErrorDialog: boolean;

  constructor(public dialogRef: MatDialogRef<MessageBoxComponent>,
    @Inject(MAT_DIALOG_DATA) userData: any,
    private authService: AuthService) {
    this.title = userData.title;
    this.message = userData.message;
    this.isErrorDialog = userData.isErrorDialog ? userData.isErrorDialog : false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
