export enum Endpoints {
  track = '/track',
  artist = '/artist',
  album = '/album',
  editorial = '/editorial',
  search = '/search',
  chart = '/chart',
  genre = '/genre',
  radio = '/radio',
  playlist = '/playlist',
  artists = '/artists',
}

export enum SearchType {
  tracks = 'tracks',
  artists = 'artists',
  albums = 'albums',
  playlists = 'playlists',
}

export enum Limits {
  tracks = 3,
  artists = 10,
  albums = 10,
  playlists = 10,
}
