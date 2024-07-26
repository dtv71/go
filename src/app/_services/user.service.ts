import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfiguration } from './app-config.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private appcfg: AppConfiguration) {}

  // PHP_API_SERVER = "http://localhost/programator.urbis/api";
  //PHP_API_SERVER = this.utils.phpServer;

  get PHP_API_SERVER() {
    return this.appcfg.apiUrl;
  }

  getAll(searchText?, iduser?, filt?) {
    return this.http.get<User[]>(
      `${this.PHP_API_SERVER}/userauth.php?op=fdbGetAllUsers&searchText=${searchText|| ''}&iduser=${iduser || ''}&filt=${filt || ''}`
    );
  }
}
