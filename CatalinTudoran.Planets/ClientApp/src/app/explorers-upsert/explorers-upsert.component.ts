import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExplorersService } from '../shared/services/explorers.service';

export enum UpsertMode {
  create = 1,
  update = 2,
  resetPassword = 3
}

@Component({
  selector: 'app-explorers-upsert',
  templateUrl: './explorers-upsert.component.html',
  styleUrls: ['./explorers-upsert.component.css']
})
export class ExplorersUpsertComponent {
  private user: any;
  dialogForm: FormGroup;
  upsertMode: UpsertMode;
  isCaptain: boolean;
  errors: string;

  constructor(public dialogRef: MatDialogRef<ExplorersUpsertComponent>,
    @Inject(MAT_DIALOG_DATA) userData: any,
    private fb: FormBuilder,
    private explorersService: ExplorersService) {

    this.user = userData.user;
    this.upsertMode = userData.upsertMode;
    this.isCaptain = userData.isCaptain;

    let controlSet = this.inPasswordResetMode() ? {} : {
      userName: [this.user != null ? this.user.userName : '', [Validators.required]],
      name: [this.user != null ? this.user.name : '', [Validators.required]]
    }

    controlSet["user"] = this.user;

    if (this.passwordRequired()) {
      controlSet["password"] = ['', [Validators.required, Validators.minLength(6)]];
      controlSet["passwordConfirmation"] = ['', [Validators.required, Validators.minLength(6)]];
      this.dialogForm = this.fb.group(controlSet);
      this.dialogForm.validator = this.passwordMatchValidator;
    } else {
      this.dialogForm = this.fb.group(controlSet);
    }
  }

  public inPasswordResetMode() {
    return this.upsertMode === UpsertMode.resetPassword;
  }

  public passwordRequired() {
    return this.upsertMode === UpsertMode.create
      || this.upsertMode === UpsertMode.resetPassword;
  }

  passwordMatchValidator(g: FormGroup) {
    let password = g.controls.password.value;
    let passwordConfirmation = g.controls.passwordConfirmation.value;

    let notConfirmed = password !== passwordConfirmation;
    return notConfirmed
      ? { 'passwordConfirmationError': true } : null;
  }

  pwdConfirmErrStateMatcher = {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      const pwdsNotMatch = form.errors && form.errors.passwordConfirmationError;
      return !!(control && (control.invalid || pwdsNotMatch) && (control.dirty || control.touched || isSubmitted));
    }
  }

  passwordNotMatch() {
    return this.dialogForm.errors && this.dialogForm.errors.passwordConfirmationError;
  }

  formInvalid() {
    return this.dialogForm.invalid;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public cancel() {
    this.dialogRef.close();
  }

  public save() {
    if (this.upsertMode === UpsertMode.create) {
      this.createExplorer();
    } else if (this.upsertMode === UpsertMode.update) {
      this.updateExplorer();
    } else if (this.upsertMode === UpsertMode.resetPassword) {
      this.resetPassword();
    }
  }

  private createExplorer() {
    let result = this.dialogForm.value;
    this.explorersService.createExplorer(result.userName, result.name, result.password, this.isCaptain).subscribe(
      result => {
        this.errors = "";
        this.dialogRef.close("created");
      },
      errors => this.errors = errors
    );
  }

  private updateExplorer() {
    let result = this.dialogForm.value;
    this.explorersService.updateExplorer(result.user.id, result.userName, result.name).subscribe(
      result => {
        this.errors = "";
        this.dialogRef.close("updated");
      },
      errors => this.errors = errors
    );
  }

  private resetPassword() {
    let result = this.dialogForm.value;
    this.explorersService.resetPassword(result.user.id, result.password).subscribe(
      result => {
        this.errors = "";
        this.dialogRef.close("passwordReset");
      },
      errors => this.errors = errors
    );
  }
}
