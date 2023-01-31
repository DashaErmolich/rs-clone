import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export default class AppComponent implements OnInit, OnDestroy {
  title = 'music-app';

  sub = new Subscription();

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    const cors = 'http://localhost:8080/';
    const url = 'https://api.deezer.com/track/3135556';
    const response = this.http.get(cors + url);
    this.sub = response.subscribe((x) => {
      // eslint-disable-next-line no-console
      console.log(x);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
