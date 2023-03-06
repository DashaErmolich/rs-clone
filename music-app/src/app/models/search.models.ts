export interface ILikedSearchResults {
  album: number[];
  artist: number[];
  playlist: number[];
  radio: number[];
}

export type LikedSearchResults = 'artist' | 'album' | 'playlist' | 'radio';
