/* eslint-disable */
declare var require: any;
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, catchError } from 'rxjs';

// // eslint-disable-next-line import/no-extraneous-dependencies
// const DeezerPublicApi = require('deezer-public-api');

// const deezer = new DeezerPublicApi();

// // Search an artist
// deezer.search.artist('ILYSH').then((result: any) => {
//   console.log(result);
// });

// // Get info for the given artist id
// deezer.artist('58671252').then((result: any) => {
//   console.log(result);
// });

// // Get album list for the given artist id
// deezer.artist.albums('58671252').then((result: any) => {
//   console.log(result);
// });

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

  // // handleError(str: string, arr: []) {
  // //   console.log(str);
  // // }

  // ngOnInit() {
  //   const response = this.http.get('https://api.deezer.com/album/302128%27', {
  //     responseType: "jsonp",
  //   })
  // }

  // ngOnInit(): void {
  //   const response = this.http.jsonp('https://api.deezer.com/album/302128%27', 'callback').pipe(
  //     catchError(this.handleError('searchHeroes', [])) // then handle the error
  //   );
  //   this.sub = response.subscribe((x) => {
  //     console.log(x);
  //   });

  //   // console.log(this.http.jsonp('https://api.deezer.com/album/302128%27'))
  // }

  // handleError(arg0: string, arg1: never[]): (err: any, caught: import("rxjs").Observable<Object>) => import("rxjs").ObservableInput<any> {
  //   throw new Error('Method not implemented.');
  // }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

  ngOnInit() {
    this.getTrack();
  }

  // // eslint-disable-next-line class-methods-use-this
  async getTrack(): Promise<void> {
    const cors = "https://cors-anywhere.herokuapp.com/";
    const url = 'https://api.deezer.com/album/302128%27'
    const response = await fetch(cors + url, {
      headers: {
        'Content-Type': 'application/jsonp'
      }
    });
    const result = await response.json();
    // eslint-disable-next-line no-console
    console.log(result);
  }

  // name:string;
  // res: any;
  // constructor(http: HttpClient) {
  //   this.name = `Angular!`;

  //   const params = {
  //     output: 'jsonp',
  //   }

  //   http.jsonp('https://api.stackexchange.com/2.2/info?site=stackoverflow', 'callback')
  //     .subscribe(res => console.log(res));
  // }
}
