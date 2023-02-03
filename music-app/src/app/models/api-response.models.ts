export type TrackResponse = {
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
  contributors: Contributor[];
  md5_image: string;
  artist: Partial<ArtistResponse>;
  album: Partial<AlbumResponse>;
  type: string;
};

export type ArtistResponse = {
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
};

export type AlbumResponse = {
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
    data: Partial<GenreResponse>[];
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
  contributors: Contributor[];
  artist: Partial<ArtistResponse>;
  type: string;
  tracks: {
    data: Partial<TrackResponse>[];
  };
};

export type EditorialResponse = {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
};

export type SearchResponse = {
  data: Partial<TrackResponse>[];
  total: number;
  prev?: string;
  next?: string;
};

export type ChartResponse = {
  tracks: { data: Partial<TrackResponse>[]; total: number };
  albums: { data: Partial<AlbumResponse>[]; total: number };
  artists: { data: Partial<ArtistResponse>[]; total: number };
  playlists: {
    data: {
      id: number;
      title: string;
      public: boolean;
      nb_tracks: number;
      link: string;
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
      user: {
        id: number;
        name: string;
        tracklist: string;
        type: string;
      };
      type: string;
    }[];
    total: number;
  };
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
};

export type GenreResponse = {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: string;
};

export type RadioResponse = {
  id: number;
  title: string;
  description: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  md5_image: string;
  type: string;
};

type Contributor = {
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
};
