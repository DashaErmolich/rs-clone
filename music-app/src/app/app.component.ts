/* eslint-disable */
declare var require: any;
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, catchError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export default class AppComponent {
  title = 'music-app';
  sub = new Subscription();
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    const cors = "https://cors-anywhere.herokuapp.com/";
    const url = 'https://api.deezer.com/track/3135556';
    const response = this.http.get(cors + url);
    this.sub = response.subscribe((x) => {
      console.log(x);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
