export interface IUserModel {
  readonly email: string;
  readonly isActivated: boolean;
  readonly id: string;
  username: string;
  userIconId: number;
  userFavorites: IFavoritesModel;
  customPlaylists: ICustomPlaylistModel[]
}

interface IFavoritesModel {
  tracks: number[];
  albums: number[];
  artists: number[];
  playlists: number[];
  podcasts:number[];
}

interface ICustomPlaylistModel {
  playlistName: string;
  playlistTracks: number[];
}
