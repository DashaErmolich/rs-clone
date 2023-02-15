import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IGenreResponse,
  IPlayListResponse,
  ITrackResponse,
  IArtistResponse,
  IAlbumResponse,
} from 'src/app/models/api-response.models';
import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
import { DEFAULT_SRC, COLORS } from 'src/app/constants/constants';
import { Limits, SearchType } from 'src/app/enums/endpoints';
import { Observable, Subscription } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { AudioService } from 'src/app/services/audio.service';
import { ThemeService } from 'src/app/services/theme.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  colors: string[] = COLORS;

  defaultImg: string = DEFAULT_SRC;

  isSearchPage: boolean = true;

  limitTracks: number = Limits.tracks;

  limitArtists: number = Limits.artists;

  limitAlbums: number = Limits.albums;

  limitPlaylists: number = Limits.playlists;

  index: number = 0;

  searchType: string = SearchType.tracks;

  genres: IGenreResponse[] = [];

  playlistsFromChart: Partial<IPlayListResponse>[] = [];

  loading = false;

  searchParam: string = '';

  tracks: Partial<ITrackResponse>[] = [];

  artists: Partial<IArtistResponse>[] = [];

  albums: Partial<IAlbumResponse>[] = [];

  playlists: Partial<IPlayListResponse>[] = [];

  queryParams$!: Subscription;

  genres$!: Subscription;

  playlistsFromChart$!: Subscription;

  tracks$!: Subscription;

  artists$!: Subscription;

  albums$!: Subscription;

  playlists$!: Subscription;

  playingTrackIndex$!: Subscription;

  isPlay$!: Observable<boolean>;

  isPause$!: Observable<boolean>;

  playingTrackIndex!: number;

  isPlay!: boolean;

  // currentIndex!: number;

  // currentIndex$!: Subscription;

  isEnd!: boolean;

  constructor(
    private deezerRestApiService: DeezerRestApiService,
    private route: ActivatedRoute,
    private state: StateService,
    private myAudio: AudioService,
    private themeService: ThemeService,
    private storage: LocalStorageService,
  ) {}

  theme: string = this.themeService.activeTheme;

  ngOnInit(): void {
    this.queryParams$ = this.route.queryParams.subscribe((param) => {
      this.searchParam = param['q'];
      if (this.searchParam) {
        this.checkTypeOfSearch();
      } else {
        this.loading = true;
        this.genres$ = this.deezerRestApiService.getGenres().subscribe((genres) => {
          this.genres = genres.data.filter((genre) => genre.id !== 0);
          this.loading = false;
        });
        this.playlistsFromChart$ = this.deezerRestApiService.getChart().subscribe((playlists) => {
          this.playlistsFromChart = playlists.playlists.data;
        });
        this.searchType = SearchType.tracks;
      }
    });
    this.isPlay$ = this.myAudio.isPlay$;
    this.isPause$ = this.myAudio.isPause$;
    this.isPause$.subscribe((res) => console.log('PAUSE', res));
    this.isPlay$.subscribe((res) => console.log('PLAY', res));
    this.myAudio.state$.subscribe((res) => {
      if (res.progress !== res.duration) {
        this.isEnd = false;
      } else {
        this.isEnd = true;
      }
    });

    if (this.storage.getTrackListInfo()?.currentTrackIndex) {
      this.playingTrackIndex = this.storage.getTrackListInfo()?.currentTrackIndex!;
      console.log('получили индекс из локала', this.playingTrackIndex);
    }

    // } else {
    // // this.state.playingTrackIndex$.subscribe((index) => {
    // //   this.playingTrackIndex = index!;
    // //   console.log('получили индекс из стейта', this.playingTrackIndex);
    // // });
    // // // }
    //   this.playingTrackIndex = this.playingTrackIndex === null ? 0 : this.playingTrackIndex;
    //   console.log('индекс', this.playingTrackIndex);
    // }
    // this.getTrackListInfo();
  }

  ngOnDestroy(): void {
    if (this.queryParams$) this.queryParams$.unsubscribe();
    if (this.genres$) this.genres$.unsubscribe();
    if (this.playlistsFromChart$) this.playlistsFromChart$.unsubscribe();
    if (this.tracks$) this.tracks$.unsubscribe();
    if (this.artists$) this.artists$.unsubscribe();
    if (this.albums$) this.albums$.unsubscribe();
    if (this.playlists$) this.playlists$.unsubscribe();
    // if (this.isPlay$) this.isPlay$.unsubscribe();
    if (this.playingTrackIndex$) this.playingTrackIndex$.unsubscribe();
    // if (this.currentIndex$) this.currentIndex$.unsubscribe();
  }

  renderTracks() {
    this.searchType = SearchType.tracks;
    if (this.storage.getTrackListInfo()?.trackList) {
      this.tracks = this.storage.getTrackListInfo()?.trackList!;
      console.log('получили list из локала', this.tracks);
    } else {
      this.tracks$ = this.deezerRestApiService
        .getSearch(this.searchParam, this.index, this.limitTracks)
        .subscribe((res) => {
          this.tracks = res.data;
          this.loading = false;
        });
    }

    if (!this.tracks || this.tracks.length === 0) this.loading = true;
    this.getTrackListInfo()
  }

  renderArtists() {
    this.searchType = SearchType.artists;
    if (!this.artists || this.artists.length === 0) this.loading = true;
    this.artists$ = this.deezerRestApiService
      .getSearchArtists(this.searchParam, this.index, this.limitArtists)
      .subscribe((res) => {
        this.artists = res.data;
        this.loading = false;
      });
  }

  renderAlbums() {
    this.searchType = SearchType.albums;
    if (!this.albums || this.albums.length === 0) this.loading = true;
    this.deezerRestApiService
      .getSearchAlbums(this.searchParam, this.index, this.limitAlbums)
      .subscribe((res) => {
        this.albums = res.data;
        this.loading = false;
      });
  }

  renderPlaylists() {
    this.searchType = SearchType.playlists;
    if (!this.playlists || this.playlists.length === 0) this.loading = true;
    this.playlists$ = this.deezerRestApiService
      .getSearchPlayLists(this.searchParam, this.index, this.limitPlaylists)
      .subscribe((res) => {
        this.playlists = res.data;
        this.loading = false;
      });
  }

  getMore(searchType: string) {
    if (searchType === SearchType.playlists) {
      this.limitPlaylists += Limits.playlists;
      this.renderPlaylists();
    }
    if (searchType === SearchType.tracks) {
      this.limitTracks += Limits.tracks;
      this.renderTracks();
    }
    if (searchType === SearchType.albums) {
      this.limitAlbums += Limits.albums;
      this.renderAlbums();
    }
    if (searchType === SearchType.artists) {
      this.limitArtists += Limits.artists;
      this.renderArtists();
    }
  }

  randomColor(i: number) {
    const index = i % this.colors.length;
    return this.colors[index];
  }

  checkTypeOfSearch() {
    if (this.searchType === SearchType.tracks) {
      this.renderTracks();
    }
    if (this.searchType === SearchType.albums) {
      this.renderAlbums();
    }
    if (this.searchType === SearchType.artists) {
      this.renderArtists();
    }
    if (this.searchType === SearchType.playlists) {
      this.renderPlaylists();
    }
  }

  setTracksInfo(index: number) {
    this.state.setTrackListInfo(this.tracks, this.playingTrackIndex);
    this.state.setPlayingTrackIndex(index);
    // this.getTrackListInfo();
    this.myAudio.playTrack(String(this.tracks[index].preview));
    this.isPlay = !this.isPlay;
  }

  playPause() {
    this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
    if (this.isPlay) {
      this.myAudio.pause();
    } else {
      this.myAudio.play();
    }
  }

  getTrackListInfo() {
    // const notShuffleTracks = this.tracks;
    // let shuffleTracks: Partial<ITrackResponse>[] = [];
    this.state.trackList$.subscribe((tracks) => {
      this.tracks = tracks;

      // this.state.playingTrackIndex$.subscribe((index) => {
      //   this.playingTrackIndex = Number(index);
      //   this.currentIndex = notShuffleTracks
      //     .findIndex((track) => track.id === shuffleTracks[this.playingTrackIndex].id);
      // });
    });
    this.state.playingTrackIndex$.subscribe((index) => {
      this.playingTrackIndex = index!;
      console.log('this.playingTrackIndex', this.playingTrackIndex);
    });
  }
}
//     let notShuffleTracks: any[];
//     if (this.tracks.length) {
//       notShuffleTracks = this.tracks;
//       console.log('notShuffleTracks1', notShuffleTracks);

//     } else {
//       this.deezerRestApiService
//         .getSearch(this.searchParam, this.index, this.limitTracks)
//         .subscribe((res) => {
//           notShuffleTracks = res.data;
//           console.log('notShuffleTracks2', notShuffleTracks);

//         });

//     }

//     let shuffleTracks: Partial<ITrackResponse>[] = [];
//     this.currentIndex$ = this.state.trackList$.subscribe((tracks) => {
//       if (tracks.length) {
//         shuffleTracks = tracks;
//       } else {
//         shuffleTracks = this.storage.getTrackListInfo()?.trackList!;
//       }

//       this.playingTrackIndex$ = this.state.playingTrackIndex$.subscribe((index) => {
//         this.playingTrackIndex = Number(index);
//         this.currentIndex = notShuffleTracks
//           .findIndex((track) => {

//             console.log('wwwwwwwwwww',track.id,shuffleTracks[this.playingTrackIndex].id)
//             track.id === shuffleTracks[this.playingTrackIndex].id});
//         // this.state.setCurrentPlayingTrackIndex(this.currentIndex);
//         // this.storage.setCurrentPlayingTrackIndex(this.currentIndex);
//         // console.log(this.playingTrackIndex, this.isPlay);
//         // console.log('---------------------------------');
//         //         if (this.playingTrackIndex === (this.tracks.length - 1)) {
//         //           // console.log(this.isPlay);
//         // // this.myAudio.isPlay$.subscribe(res=>console.log('result',res))
//         //           // this.currentIndex += 1;
//         //         }
//       });
//     });

//     console.log('shuffleTracks', shuffleTracks);

//     console.log('this.currentIndex', this.currentIndex);
//   }
// }

// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import {
//   IGenreResponse,
//   IPlayListResponse,
//   ITrackResponse,
//   IArtistResponse,
//   IAlbumResponse,
// } from 'src/app/models/api-response.models';
// import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
// import { DEFAULT_SRC, COLORS } from 'src/app/constants/constants';
// import { Limits, SearchType } from 'src/app/enums/endpoints';
// import { Observable, Subscription } from 'rxjs';
// import { StateService } from 'src/app/services/state.service';
// import { AudioService } from 'src/app/services/audio.service';
// import { ThemeService } from 'src/app/services/theme.service';
// import { LocalStorageService } from 'src/app/services/local-storage.service';

// @Component({
//   selector: 'app-search',
//   templateUrl: './search.component.html',
//   styleUrls: ['./search.component.scss'],
// })
// export class SearchComponent implements OnInit, OnDestroy {
//   colors: string[] = COLORS;

//   defaultImg: string = DEFAULT_SRC;

//   isSearchPage: boolean = true;

//   limitTracks: number = Limits.tracks;

//   limitArtists: number = Limits.artists;

//   limitAlbums: number = Limits.albums;

//   limitPlaylists: number = Limits.playlists;

//   index: number = 0;

//   searchType: string = SearchType.tracks;

//   genres: IGenreResponse[] = [];

//   playlistsFromChart: Partial<IPlayListResponse>[] = [];

//   loading = false;

//   searchParam: string = '';

//   tracks: Partial<ITrackResponse>[] = [];

//   artists: Partial<IArtistResponse>[] = [];

//   albums: Partial<IAlbumResponse>[] = [];

//   playlists: Partial<IPlayListResponse>[] = [];

//   queryParams$!: Subscription;

//   genres$!: Subscription;

//   playlistsFromChart$!: Subscription;

//   tracks$!: Subscription;

//   artists$!: Subscription;

//   albums$!: Subscription;

//   playlists$!: Subscription;

//   playingTrackIndex$!: Subscription;

//   isPlay$!: Observable<boolean>;

//   isPause$!: Observable<boolean>;

//   playingTrackIndex!: number;

//   isPlay!: boolean;

//   currentIndex!: number;

//   currentIndex$!: Subscription;

//   isEnd!: boolean;

//   constructor(
//     private deezerRestApiService: DeezerRestApiService,
//     private route: ActivatedRoute,
//     private state: StateService,
//     private myAudio: AudioService,
//     private themeService: ThemeService,
//     private storage: LocalStorageService,
//   ) {}

//   theme: string = this.themeService.activeTheme;

//   ngOnInit(): void {
//     this.queryParams$ = this.route.queryParams.subscribe((param) => {
//       this.searchParam = param['q'];
//       if (this.searchParam) {
//         this.checkTypeOfSearch();
//       } else {
//         this.loading = true;
//         this.genres$ = this.deezerRestApiService.getGenres().subscribe((genres) => {
//           this.genres = genres.data.filter((genre) => genre.id !== 0);
//           this.loading = false;
//         });
//         this.playlistsFromChart$ = this.deezerRestApiService.getChart().subscribe((playlists) => {
//           this.playlistsFromChart = playlists.playlists.data;
//         });
//         this.searchType = SearchType.tracks;
//       }
//     });
//     this.isPlay$ = this.myAudio.isPlay$;
//     this.isPause$ = this.myAudio.isPause$;
//     this.isPause$.subscribe((res) => console.log('PAUSE', res));
//     this.isPlay$.subscribe((res) => console.log('PLAY', res));
//     this.myAudio.state$.subscribe((res) => {
//       if (res.progress !== res.duration) {
//         this.isEnd = false;
//       } else {
//         this.isEnd = true;
//       }
//       // console.log('res.progress', res.progress);
//       // console.log('resduration', res.duration);
//     });

//     // const trackListInfo = this.storage.getCurrentPlayingTrackIndex();
//     // if (trackListInfo !== null) {
//     //   this.currentIndex = trackListInfo.currentTrackIndex;

//     // }
//     if (this.storage.getTrackListInfo()?.currentTrackIndex) {
//       this.playingTrackIndex = Number(this.storage.getTrackListInfo()?.currentTrackIndex);
//       this.getPlayingTrackIndex();
//       console.log(this.currentIndex);
//     }

//     // this.currentIndex$ = this.state.currentPlayingTrackIndex$.subscribe((res) => {
//     //   if (res) this.currentIndex = res;
//     // console.log(this.currentIndex);
//     // });
//   }

//   ngOnDestroy(): void {
//     if (this.queryParams$) this.queryParams$.unsubscribe();
//     if (this.genres$) this.genres$.unsubscribe();
//     if (this.playlistsFromChart$) this.playlistsFromChart$.unsubscribe();
//     if (this.tracks$) this.tracks$.unsubscribe();
//     if (this.artists$) this.artists$.unsubscribe();
//     if (this.albums$) this.albums$.unsubscribe();
//     if (this.playlists$) this.playlists$.unsubscribe();
//     // if (this.isPlay$) this.isPlay$.unsubscribe();
//     if (this.playingTrackIndex$) this.playingTrackIndex$.unsubscribe();
//     if (this.currentIndex$) this.currentIndex$.unsubscribe();
//   }

//   renderTracks() {
//     this.searchType = SearchType.tracks;
//     if (!this.tracks || this.tracks.length === 0) this.loading = true;
//     this.tracks$ = this.deezerRestApiService
//       .getSearch(this.searchParam, this.index, this.limitTracks)
//       .subscribe((res) => {
//         this.tracks = res.data;
//         this.loading = false;
//       });
//   }

//   renderArtists() {
//     this.searchType = SearchType.artists;
//     if (!this.artists || this.artists.length === 0) this.loading = true;
//     this.artists$ = this.deezerRestApiService
//       .getSearchArtists(this.searchParam, this.index, this.limitArtists)
//       .subscribe((res) => {
//         this.artists = res.data;
//         this.loading = false;
//       });
//   }

//   renderAlbums() {
//     this.searchType = SearchType.albums;
//     if (!this.albums || this.albums.length === 0) this.loading = true;
//     this.deezerRestApiService
//       .getSearchAlbums(this.searchParam, this.index, this.limitAlbums)
//       .subscribe((res) => {
//         this.albums = res.data;
//         this.loading = false;
//       });
//   }

//   renderPlaylists() {
//     this.searchType = SearchType.playlists;
//     if (!this.playlists || this.playlists.length === 0) this.loading = true;
//     this.playlists$ = this.deezerRestApiService
//       .getSearchPlayLists(this.searchParam, this.index, this.limitPlaylists)
//       .subscribe((res) => {
//         this.playlists = res.data;
//         this.loading = false;
//       });
//   }

//   getMore(searchType: string) {
//     if (searchType === SearchType.playlists) {
//       this.limitPlaylists += Limits.playlists;
//       this.renderPlaylists();
//     }
//     if (searchType === SearchType.tracks) {
//       this.limitTracks += Limits.tracks;
//       this.renderTracks();
//     }
//     if (searchType === SearchType.albums) {
//       this.limitAlbums += Limits.albums;
//       this.renderAlbums();
//     }
//     if (searchType === SearchType.artists) {
//       this.limitArtists += Limits.artists;
//       this.renderArtists();
//     }
//   }

//   randomColor(i: number) {
//     const index = i % this.colors.length;
//     return this.colors[index];
//   }

//   checkTypeOfSearch() {
//     if (this.searchType === SearchType.tracks) {
//       this.renderTracks();
//     }
//     if (this.searchType === SearchType.albums) {
//       this.renderAlbums();
//     }
//     if (this.searchType === SearchType.artists) {
//       this.renderArtists();
//     }
//     if (this.searchType === SearchType.playlists) {
//       this.renderPlaylists();
//     }
//   }

//   setTracksInfo(index: number) {
//     this.state.setTrackListInfo(this.tracks, this.currentIndex);
//     this.state.setPlayingTrackIndex(index);
//     this.getPlayingTrackIndex();
//     this.myAudio.playTrack(String(this.tracks[index].preview));
//     this.isPlay = !this.isPlay;
//   }

//   playPause() {
//     this.myAudio.isPlay$.subscribe((res) => { this.isPlay = res; });
//     if (this.isPlay) {
//       this.myAudio.pause();
//     } else {
//       this.myAudio.play();
//     }
//   }

//   getPlayingTrackIndex() {
//     let notShuffleTracks: any[];
//     if (this.tracks.length) {
//       notShuffleTracks = this.tracks;
//       console.log('notShuffleTracks1', notShuffleTracks);

//     } else {
//       this.deezerRestApiService
//         .getSearch(this.searchParam, this.index, this.limitTracks)
//         .subscribe((res) => {
//           notShuffleTracks = res.data;
//           console.log('notShuffleTracks2', notShuffleTracks);

//         });

//     }

//     let shuffleTracks: Partial<ITrackResponse>[] = [];
//     this.currentIndex$ = this.state.trackList$.subscribe((tracks) => {
//       if (tracks.length) {
//         shuffleTracks = tracks;
//       } else {
//         shuffleTracks = this.storage.getTrackListInfo()?.trackList!;
//       }

//       this.playingTrackIndex$ = this.state.playingTrackIndex$.subscribe((index) => {
//         this.playingTrackIndex = Number(index);
//         this.currentIndex = notShuffleTracks
//           .findIndex((track) => {

//             console.log('wwwwwwwwwww',track.id,shuffleTracks[this.playingTrackIndex].id)
//             track.id === shuffleTracks[this.playingTrackIndex].id});
//         // this.state.setCurrentPlayingTrackIndex(this.currentIndex);
//         // this.storage.setCurrentPlayingTrackIndex(this.currentIndex);
//         // console.log(this.playingTrackIndex, this.isPlay);
//         // console.log('---------------------------------');
//         //         if (this.playingTrackIndex === (this.tracks.length - 1)) {
//         //           // console.log(this.isPlay);
//         // // this.myAudio.isPlay$.subscribe(res=>console.log('result',res))
//         //           // this.currentIndex += 1;
//         //         }
//       });
//     });

//     console.log('shuffleTracks', shuffleTracks);

//     console.log('this.currentIndex', this.currentIndex);
//   }
// }
