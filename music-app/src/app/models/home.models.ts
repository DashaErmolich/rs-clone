import { IChartResponse } from './api-response.models';

export interface ICategoriesData {
  tracks: {
    title: string,
    data: IChartResponse['tracks']['data'],
  },
  albums: {
    title: string,
    data: IChartResponse['albums']['data'],
  },
  artists: {
    title: string,
    data: IChartResponse['artists']['data'],
  },
  playlists: {
    title: string,
    data: IChartResponse['playlists']['data'],
  },
  podcasts: {
    title: string,
    data: IChartResponse['podcasts']['data'],
  },
}
