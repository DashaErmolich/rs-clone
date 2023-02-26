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
  radio: number[];
}

export interface ICustomPlaylistModel {
  id: string
  title: string,
  creator: {
    name: string,
  },
  tracks: {
    data: number[],
  },
  nb_tracks: number,
}
