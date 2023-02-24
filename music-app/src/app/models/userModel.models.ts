export interface IUserModel {
  username: string;
  email: string;
  isActivated: boolean;
  id: string;
  userIconId: number;
  userFavorites: IFavoritesModel;
  customPlaylists: [ICustomPlaylistModel]
}

interface IFavoritesModel {
  tracks: [number];
  albums: [number];
  artists: [number];
  playlists: [number];
  podcasts: [number];
}

interface ICustomPlaylistModel {
  playlistName: string;
  playlistTracks: [number];
}
