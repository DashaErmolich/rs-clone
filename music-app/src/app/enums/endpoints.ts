export enum Endpoints {
  track = '/track',
  tracks = '/tracks',
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
  artist = 'artist',
  album = 'album',
  playlist = 'playlist',
  radios = 'radios',
  radio = 'radio',
  userPlaylist = 'user-playlist',
}

export enum Limits {
  tracks = 25,
  artists = 10,
  albums = 10,
  playlists = 10,
}
