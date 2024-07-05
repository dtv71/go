import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { DialogService } from '../_services/dialog.service';
import {FormsModule, NgForm} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  returnUrl: string = './dashboard';
  email;
  pwd;
  error = '';
  msgErr = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private dialog: DialogService
  ) {
    // redirect to home if already logged in
    if (this.auth.currentUserValue) {
      console.log('currentUserValue', this.auth.currentUserValue);
      if (this.returnUrl) this.router.navigate([this.returnUrl]);
    }
  }

  ngOnInit() {
    // Resets the login service.
    // This is one of the events that should cause the refresh.
    this.returnUrl = './dashboard';
    this.auth.logout();
  }

  doLogin() {
    if (this.email && this.pwd) {
      this.auth
        .login(this.email, this.pwd)
        .pipe(first())
        .subscribe(
          (data) => {
            //console.log('data', data)
            //this.router.navigate([this.returnUrl]);
            window.location.reload();
          },
          (error) => {
            console.log(error);
            this.error = 'Email sau parola invalida';
          }
        );
    } else {
      this.error = 'Introduceti email si parola';
    }
  }
  resetPassword() {}
}
