import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { AppNavigationLinksService } from '../app-navigation/app-navigation-link.service';
import { DialogService } from '../shared/services/dialog.service';
import { ExplorersService } from '../shared/services/explorers.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  dialogForm: FormGroup;
  errors: string;

  constructor(private fb: FormBuilder,
    private explorersService: ExplorersService,
    private appNavigationLinksService: AppNavigationLinksService,
    private dialogService: DialogService) {
    this.appNavigationLinksService.setMenus();

    let controlSet = {
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPasswordConfirmation: ['', [Validators.required, Validators.minLength(6)]]
    };

    this.dialogForm = this.fb.group(controlSet);
    this.dialogForm.validator = this.passwordMatchValidator;
  }

  passwordMatchValidator(g: FormGroup) {
    let password = g.controls.newPassword.value;
    let passwordConfirmation = g.controls.newPasswordConfirmation.value;

    let notConfirmed = password !== passwordConfirmation;
    return notConfirmed
      ? { 'passwordConfirmationError': true } : null;
  }

  ngOnInit() {
  }

  passwordNotMatch() {
    return this.dialogForm.errors && this.dialogForm.errors.passwordConfirmationError;
  }

  formInvalid() {
    return this.dialogForm.invalid;
  }

  pwdConfirmErrStateMatcher = {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      const pwdsNotMatch = form.errors && form.errors.passwordConfirmationError;
      return !!(control && (control.invalid || pwdsNotMatch) && (control.dirty || control.touched || isSubmitted));
    }
  }

  changePassword() {
    let result = this.dialogForm.value;
    this.explorersService.changePassword(result.currentPassword, result.newPassword).subscribe(result => {
      this.dialogService.showMessageBox('Succes', "The password has been successfully reset.");
    },
      errors => {
        this.dialogService.showErrorMessageBox(errors);
      });
  }

}
