import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfiguration {

  constructor(private http: HttpClient) {}
  apiUrl: string;
  tipContract: any[];

  ensureInit(): Promise<any> {
    return new Promise((r, e) => {
      //real code

      this.http.get('./assets/config/app.config.json').subscribe(
        (content: AppConfiguration) => {
          Object.assign(this, content);
          r(this);
        },
        (reason) => e(reason)
      );
    });
  }
}
