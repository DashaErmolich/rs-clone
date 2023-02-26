export interface ICustomPlayList {
  id: number
  title: string,
  creator: {
    name: string,
  },
  tracks: {
    data: number[],
  },
  nb_tracks: number,
}
