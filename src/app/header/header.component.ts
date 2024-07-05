import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { User } from '../_models/user';
import { AuthenticationService } from '../_services/authentication.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UtilsService } from '../_services/utils.service';
import { DialogService } from '../_services/dialog.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  constructor(
    private userService: UserService,
    private auth: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: DialogService,
  ) { }

  userLogat;
  id;
  isAdmin: number;
  isSupervizor: number

  ngOnInit() {
    this.userLogat = this.auth.esteLogat();
    this.setuserLogatdata()
    console.log(navigator.userAgent)
  }

  setuserLogatdata() {
    if (this.userLogat) {
      this.isAdmin = this.userLogat.isAdmin;
      this.isSupervizor = this.userLogat.isAdmin;
      this.id = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.id) {
        //localStorage.setItem('curentUrl', '/')
      } else {
        var urlToRedirect = localStorage.getItem('curentUrl');

        if (urlToRedirect) {
          //console.log('urlToRedirect', urlToRedirect);
          this.router.navigate([urlToRedirect]);
        }
      }
      console.log(this.userLogat)
    }
  }
  goHome() {
    this.router.navigate(['./dashboard']);
  }
  goLogin() {
  //   this.dialog.confirm({
  //     message: 'Doriti sa va delogati?', confirmBtn: 'Logout', cancelBtn: 'Stai logat'
      
  //   }).then(()=>{
  //     this.userLogat = null
  //     this.auth.logout();
  //     this.router.navigate(['./login']);
  //   })
    
   }
}

