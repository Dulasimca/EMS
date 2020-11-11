import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loginForm: FormGroup;
  pwdResetForm: FormGroup;
  isSubmitted: boolean;
  clickedReset: boolean;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showPwdNoMatchErr: boolean;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.isSubmitted = false;
    this.clickedReset = false;
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pswd: ['', Validators.required]
    });
    this.pwdResetForm = this.fb.group({
      oldPwd: ['', Validators.required],
      newPwd: ['', Validators.required],
      confirmPwd: ['', Validators.required]
    })
  }

  onSubmit() {
    this.isSubmitted = true;
    this.authService.loginInfo(this.loginForm.value);
    this.router.navigate(['home']);
  }

  onChangePassword() {

  }

  openPwdReset() {
    this.clickedReset = true;
  }

  onValidatePwd(value) {
    const pwd: string = value.toString();
    const npwd = this.newPassword;
    if (pwd !== null && pwd !== '' && npwd !== '' && npwd !== null) {
      if (pwd.length === npwd.length && pwd !== npwd) {
        this.showPwdNoMatchErr = true;
      } else if (pwd.length !== npwd.length) {
        this.showPwdNoMatchErr = true;
      } else {
        this.showPwdNoMatchErr = false;
      }

    }
  }

}


