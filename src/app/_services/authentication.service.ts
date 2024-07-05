import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { Observable } from 'rxjs/internal/Observable';
import { AppConfiguration } from './app-config.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private router: Router,
    private appcfg: AppConfiguration
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  @Output() getUserLogat: EventEmitter<any> = new EventEmitter();

  authUser = { email: '', pwd: '' }
  updateCont = { user: '', nume: '', prenume: '', email: '' }

  public get currentUserValue(): User {
    var u = this.currentUserSubject.value;
    //console.log('u', u)
    if (!u) {
      this.logout()
      this.router.navigate(['./login']);
    } else {
      var dt: Date = (u && u.dt) ? u.dt : new Date(2000, 0, 1)
      var dtcurent = new Date();
      // console.log('dt:', dt);
      // console.log('dtcurent:', dtcurent);
      let difTime = new Date(dtcurent).getTime() - new Date(dt).getTime();

      // Calculating the no. of days between
      // two dates
      let diffDays = Math.round(difTime / (1000 * 3600 * 24));
      // console.log(Difference_In_Days)
      if (diffDays > 7) {
        this.logout()
        this.router.navigate(['./login']);
      }

    }

    return u;
  }

  get PHP_API_SERVER() {
    return this.appcfg.apiUrl;
  }

  esteLogat() {
    this.getUserLogat.emit(this.currentUserValue);
    // pune un id la dashboard daca vrei sa ajungi aici, ca sa nu redirecteze la curentUrl din localstorage

    var userData = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(userData)
    return this.currentUserValue;

    //this.numeTipUser = this.utils.getTipUser(this.userLogat.s_tipuser)
  }

  login(username: string, password: string) {
    this.authUser.pwd = password;
    this.authUser.email = username;
    //console.log(this.authUser)
    return this.http
      .post<User>(
        `${this.PHP_API_SERVER}/userauth.php?op=fdbGetUserAuth`,
        this.authUser
      )
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          user.dt = new Date()
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.getUserLogat.emit(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('curentUrl');
    this.currentUserSubject.next(null);
  }

  updatecont(userModificat) {
    //console.log('userModificat', userModificat)
    return this.http.post<User>(
      `${this.PHP_API_SERVER}/userauth.php?op=fdbUpdateCont`,
      userModificat
    );
  }
}
