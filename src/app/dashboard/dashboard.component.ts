import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from '../_services/dialog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(
    private userService: UserService,
    private auth: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: DialogService
  ) {}

  userLogat;
  id;
  isAdmin: number;
  isSupervizor: number;

  ngOnInit() {
    this.userLogat = this.auth.esteLogat();
    this.isAdmin = this.userLogat.isAdmin;
    this.isSupervizor = this.userLogat.isAdmin;
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      //localStorage.setItem('curentUrl', '/')
    } else {
      var urlToRedirect = localStorage.getItem('curentUrl');

      if (urlToRedirect) {
        console.log('urlToRedirect', urlToRedirect);
        //this.router.navigate([urlToRedirect]);
      }
    }
    console.log(this.userLogat)
  }

 

  goActivitate() {
    this.router.navigate(['./activitate']);
  }

  goOferte() {
    this.router.navigate(['./oferta']);
  }

  goProiecte() {
    this.router.navigate(['./contracte']);
  }

  goContacte() {
    this.router.navigate(['./contact']);
  }

  goUnitate() {
    this.router.navigate(['./companie']);
  }
  goNomenclator() {
    this.router.navigate(['./nomenclator', "tipactivitate"]);
  }
  goProducator() {
    this.router.navigate(['./producator']);
  }
  goCategorii(){
    this.router.navigate(['./categoriiproduse']);
  }

  goProduse(){
    this.router.navigate(['./produse']);
  }
 
}
