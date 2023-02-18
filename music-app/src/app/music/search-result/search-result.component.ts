// import { Component } from '@angular/core';
// import { Subscription } from 'rxjs';
// import { DEFAULT_SRC } from 'src/app/constants/constants';
// import {
//   IArtistResponse,
//   ITrackResponse,
// } from 'src/app/models/api-response.models';
// import { AudioService } from 'src/app/services/audio.service';
// import { StateService } from 'src/app/services/state.service';
// // import { SearchService } from 'src/app/services/search.service';

// @Component({
//   selector: 'app-search-result',
//   templateUrl: './search-result.component.html',
//   styleUrls: ['./search-result.component.scss'],
// })
// export class SearchResultComponent {
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
//     private myState: StateService,
//     private myAudio: AudioService,
//   ) {
//     this.isFirstPlay = true;

//     this.trackList$ = this.myState.trackList$.subscribe((tracks) => {
//       this.tracksOfState = tracks;
//     });

//     this.isPlay$ = this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
//     this.isPause$ = this.myAudio.isPause$.subscribe((res) => { this.isPause = res; });
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
