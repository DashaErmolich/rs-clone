// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { DEFAULT_SRC } from 'src/app/constants/constants';
// import {
//   IArtistResponse,
//   ITrackResponse,
// } from 'src/app/models/api-response.models';
// import { AudioService } from 'src/app/services/audio.service';
// import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
// import { StateService } from 'src/app/services/state.service';
// import { SearchResultComponent } from '../search-result/search-result.component';
// // import { SearchService } from 'src/app/services/search.service';

// @Component({
//   selector: 'app-artist',
//   templateUrl: './artist.component.html',
//   styleUrls: ['./artist.component.scss'],
// })
// export class ArtistComponent extends SearchResultComponent implements OnInit {
//   artistId!: number;

//   searchParam!: number;

//   artist!: IArtistResponse;

//   artist$!: Subscription;

//   constructor(

//     private deezerRestApiService: DeezerRestApiService,
//     private route: ActivatedRoute,
//     myState: StateService,
//     myAudio: AudioService,

//   ) {
//     super(
//       myState,
//       myAudio,
//     );
//   }

//   ngOnInit(): void {
//     this.route.params.subscribe((params) => {
//       this.artistId = Number(params['artistId']);
//     });

//     this.artist$ = this.deezerRestApiService
//       .getArtist(this.artistId)
//       .subscribe((res) => {
//         this.artist = res;
//       });

//     this.tracks$ = this.deezerRestApiService
//       .getTracksByArtist(this.artistId)
//       .subscribe((res) => {
//         this.tracks = res.data;
//         this.loading = false;
//       });
//   }
// }





// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Observable, Subscription } from 'rxjs';
// import { DEFAULT_SRC } from 'src/app/constants/constants';
// import {
//   IArtistResponse,
//   ITrackResponse,
// } from 'src/app/models/api-response.models';
// import { AudioService } from 'src/app/services/audio.service';
// import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
// import { StateService } from 'src/app/services/state.service';
// // import { SearchService } from 'src/app/services/search.service';

// @Component({
//   selector: 'app-artist',
//   templateUrl: './artist.component.html',
//   styleUrls: ['./artist.component.scss'],
// })
// export class ArtistComponent implements OnInit {
//   artistId!: number;

//   searchParam!: number;

//   artist!: IArtistResponse;

//   artist$!: Subscription;

//   tracks: Partial<ITrackResponse>[] = [];

//   tracks$!: Subscription;

//   duration!: number;

//   loading: boolean = true;

//   defaultImg: string = DEFAULT_SRC;

//   tracksOfState: Partial<ITrackResponse>[] = [];

//   trackList$!: Subscription;

//   isPlay$!: Subscription;

//   isPlay!: boolean;

//   isPause$!: Subscription;

//   isPause!: boolean;

//   // isEnd$!: Subscription;

//   // isEnd!: boolean;

//   isFirstPlay!: boolean;

//   constructor(
//     // private searchService: SearchService,
//     private deezerRestApiService: DeezerRestApiService,
//     private route: ActivatedRoute,
//     private myState: StateService,
//     private myAudio: AudioService,
//   ) {}

//   ngOnInit(): void {
//     this.isFirstPlay = true;
//     this.route.params.subscribe((params) => {
//       this.artistId = Number(params['artistId']);
//     });

//     this.artist$ = this.deezerRestApiService
//       .getArtist(this.artistId)
//       .subscribe((res) => {
//         this.artist = res;
//       });

//     this.tracks$ = this.deezerRestApiService
//       .getTracksByArtist(this.artistId)
//       .subscribe((res) => {
//         this.tracks = res.data;
//         this.loading = false;
//       });

//     this.trackList$ = this.myState.trackList$.subscribe((tracks) => {
//       this.tracksOfState = tracks;
//     });

//     this.isPlay$ = this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
//     this.isPause$ = this.myAudio.isPause$.subscribe((res) => { this.isPause = res; });
//     // this.isEnd$ = this.myAudio.state$.subscribe((res) => {
//     //   if (res.progress !== res.duration) {
//     //     this.isEnd = false;
//     //   } else {
//     //     this.isEnd = true;
//     //   }
//     // });
//   }

//   playPause(trackIndex: number) {
//     if (this.isFirstPlay) {
//       this.myState.setTrackListInfo(this.tracks, trackIndex);
//       this.myAudio.playTrack(String(this.tracksOfState[trackIndex].preview));
//       // this.isPlay = !this.isPlay;
//       this.isFirstPlay = false;
//     }
//     this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
//     if (this.isPlay) {
//       this.myAudio.pause();
//     } else {
//       this.myAudio.play();
//     }
//   }
// }
