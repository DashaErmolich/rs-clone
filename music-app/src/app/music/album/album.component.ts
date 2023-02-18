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
//   selector: 'app-album',
//   templateUrl: './album.component.html',
//   styleUrls: ['./album.component.scss'],
// })
// export class AlbumComponent extends SearchResultComponent implements OnInit {
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
//       this.artistId = Number(params['albumId']);
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
