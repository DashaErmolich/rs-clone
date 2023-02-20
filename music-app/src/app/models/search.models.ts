export interface ILikedSearchResults {
  album: number[];
  artist: number[];
  playlist: number[];
}

export type LikedSearchResults = 'artist' | 'album' | 'playlist';
