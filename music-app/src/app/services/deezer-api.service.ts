import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/constants';
import { Endpoints } from '../enums/endpoints';
import {
  IAlbumResponse,
  IArtistsResponse,
  IAlbumsResponse,
  IArtistResponse,
  IChartResponse,
  IEditorialResponse,
  IGenreResponse,
  IGenresResponse,
  IPlayListResponse,
  IRadioResponse,
  ITrackResponse,
  ITracksByArtist,
  IPlayListsResponse,
  ITracksResponse,
} from '../models/api-response.models';

@Injectable({
  providedIn: 'root',
})
export class DeezerRestApiService {
  constructor(private http: HttpClient) {}

  getTrack(id: number): Observable<ITrackResponse> {
    return this.http.get<ITrackResponse>(`${BASE_URL}${Endpoints.track}/${id}`);
  }

  getArtist(id: number): Observable<IArtistResponse> {
    return this.http.get<IArtistResponse>(
      `${BASE_URL}${Endpoints.artist}/${id}`,
    );
  }

  getAlbum(id: number): Observable<IAlbumResponse> {
    return this.http.get<IAlbumResponse>(`${BASE_URL}${Endpoints.album}/${id}`);
  }

  getEditorial(id: number): Observable<IEditorialResponse> {
    return this.http.get<IEditorialResponse>(
      `${BASE_URL}${Endpoints.editorial}/${id}`,
    );
  }

  getSearch(
    searchValue: string,
    index: number,
    limit: number,
  ): Observable<ITracksResponse> {
    return this.http.get<ITracksResponse>(`${BASE_URL}${Endpoints.search}`, {
      params: { q: searchValue, index, limit },
    });
  }

  getSearchAlbums(
    searchValue: string,
    index: number,
    limit: number,
  ): Observable<IAlbumsResponse> {
    return this.http.get<IAlbumsResponse>(
      `${BASE_URL}${Endpoints.search}${Endpoints.album}`,
      {
        params: { q: searchValue, index, limit },
      },
    );
  }

  getSearchArtists(
    searchValue: string,
    index: number,
    limit: number,
  ): Observable<IArtistsResponse> {
    return this.http.get<IArtistsResponse>(
      `${BASE_URL}${Endpoints.search}${Endpoints.artist}`,
      {
        params: { q: searchValue, index, limit },
      },
    );
  }

  getSearchPlayLists(
    searchValue: string,
    index: number,
    limit: number,
  ): Observable<IPlayListsResponse> {
    return this.http.get<IPlayListsResponse>(
      `${BASE_URL}${Endpoints.search}${Endpoints.playlist}`,
      {
        params: { q: searchValue, index, limit },
      },
    );
  }

  getChart(): Observable<IChartResponse> {
    return this.http.get<IChartResponse>(`${BASE_URL}${Endpoints.chart}`);
  }

  getGenre(id: number): Observable<IGenreResponse> {
    return this.http.get<IGenreResponse>(`${BASE_URL}${Endpoints.genre}/${id}`);
  }

  getArtistByGenre(id: number): Observable<IArtistsResponse> {
    return this.http.get<IArtistsResponse>(
      `${BASE_URL}${Endpoints.genre}/${id}${Endpoints.artists}`,
    );
  }

  getTracksByArtist(id: number): Observable<ITracksByArtist> {
    return this.http.get<ITracksByArtist>(
      `${BASE_URL}${Endpoints.artist}/${id}/top?limit=50`,
    );
  }

  getGenres(): Observable<IGenresResponse> {
    return this.http.get<IGenresResponse>(`${BASE_URL}${Endpoints.genre}`);
  }

  getRadio(id: number): Observable<IRadioResponse> {
    return this.http.get<IRadioResponse>(`${BASE_URL}${Endpoints.radio}/${id}`);
  }

  getPlayListTracks(id: number): Observable<IPlayListResponse> {
    return this.http.get<IPlayListResponse>(
      `${BASE_URL}${Endpoints.playlist}/${id}`,
    );
  }
}
