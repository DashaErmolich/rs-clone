export interface ITrackResponse {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  isrc: string;
  link: string;
  share: string;
  duration: number;
  track_position: number;
  disk_number: number;
  rank: number;
  release_date: string;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  bpm: number;
  gain: number;
  available_countries: string[];
  contributors: IContributor[];
  md5_image: string;
  artist: Partial<IArtistResponse>;
  album: Partial<IAlbumResponse>;
  type: string;
}

export interface ITracksByArtist {
  data: ITrackResponse[],
  total: number,
  next?: string,
  prev?: string,
}

export interface IArtistResponse {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  position: number;
  type: string;
}
export interface IArtistsResponse {
  data: IArtistResponse[];
  total: number;
  next?: string;
  prev?: string;
}

export interface IAlbumResponse {
  id: number;
  title: string;
  upc: string;
  link: string;
  share: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  md5_image: string;
  genre_id: number;
  genres: {
    data: Partial<IGenreResponse>[];
  };
  label: string;
  nb_tracks: number;
  duration: number;
  fans: number;
  release_date: string;
  record_type: string;
  available: boolean;
  tracklist: string;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  contributors: IContributor[];
  artist: Partial<IArtistResponse>;
  type: string;
  tracks: {
    data: Partial<ITrackResponse>[];
  };
}

export interface IAlbumsResponse {
  data: IAlbumResponse[];
  total: number;
  next?: string;
  prev?: string;
}

export interface IEditorialResponse {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
}

export interface ITracksResponse {
  data: Partial<ITrackResponse>[];
  total: number;
  prev?: string;
  next?: string;
}

export interface IChartResponse {
  tracks: { data: Partial<ITrackResponse>[]; total: number };
  albums: { data: Partial<IAlbumResponse>[]; total: number };
  artists: { data: Partial<IArtistResponse>[]; total: number };
  playlists: { data: Partial<IPlayListResponse>[]; total: number };
  podcasts: {
    data: {
      id: number;
      title: string;
      description: string;
      available: boolean;
      fans: number;
      link: string;
      share: string;
      picture: string;
      picture_small: string;
      picture_medium: string;
      picture_big: string;
      picture_xl: string;
      type: string;
    }[];
    total: number;
  };
}

export interface IPlayListResponse {
  id: number,
  title: string;
  description: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  md5_image: string;
  picture_type: string;
  creator: {
    id: number;
    name: string;
    tracklist: string;
    type: string;
  },
  type: string;
  tracks: {
    data: ITrackResponse[],
    checksum: string;
  }
}

export interface IPlayListsResponse {
  data: IPlayListResponse[];
  total: number;
  next?: string;
  prev?: string;
}

export interface IGenreResponse {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
}

export interface IGenresResponse {
  data: IGenreResponse[];
}

export interface IRadioResponse {
  id: number;
  title: string;
  description?: string;
  share?: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  md5_image: string;
  type: string;
}

export interface IRadiosResponse {
  data: IRadioResponse[];
  total: number;
  next?: string;
  prev?: string;
}

export interface ITracksByRadio {
  data: ITrackResponse[];
}

interface IContributor {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  radio: boolean;
  tracklist: string;
  type: string;
  role: string;
}
