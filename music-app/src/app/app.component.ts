/* eslint-disable no-console */
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

  ngOnInit(): void {
    const response = this.http.get('https://api.deezer.com/album/302128%27');
    this.sub = response.subscribe((x) => {
      console.log(x);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // ngOnInit() {
  //   this.getTrack();
  // }

  // // eslint-disable-next-line class-methods-use-this
  // async getTrack(): Promise<void> {
  //   const response = await fetch('https://api.deezer.com/album/302128%27');
  //   const result = await response.json();
  //   // eslint-disable-next-line no-console
  //   console.log(result);
  // }
}
