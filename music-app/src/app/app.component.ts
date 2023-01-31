/* eslint-disable */
declare var require: any;
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

// eslint-disable-next-line import/no-extraneous-dependencies
const DeezerPublicApi = require('deezer-public-api');

const deezer = new DeezerPublicApi();

// Search an artist
deezer.search.artist('ILYSH').then((result: any) => {
  console.log(result);
});

// Get info for the given artist id
deezer.artist('58671252').then((result: any) => {
  console.log(result);
});

// Get album list for the given artist id
deezer.artist.albums('58671252').then((result: any) => {
  console.log(result);
});

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

  // ngOnInit(): void {
  //   const response = this.http.get('https://api.deezer.com/album/302128%27');
  //   this.sub = response.subscribe((x) => {
  //     console.log(x);
  //   });
  // }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

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
