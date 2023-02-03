import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../constants/constants';
import { Endpoints } from '../enums/endpoints';
import {
  AlbumResponse,
  ArtistResponse,
  ChartResponse,
  EditorialResponse,
  GenreResponse,
  RadioResponse,
  SearchResponse,
  TrackResponse,
} from '../models/api-response.models';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  constructor(private http: HttpClient) {}

  getTrack(id: number): Observable<TrackResponse> {
    return this.http.get<TrackResponse>(`${baseUrl}${Endpoints.track}/${id}`);
  }

  getArtist(id: number): Observable<ArtistResponse> {
    return this.http.get<ArtistResponse>(`${baseUrl}${Endpoints.artist}/${id}`);
  }

  getAlbum(id: number): Observable<AlbumResponse> {
    return this.http.get<AlbumResponse>(`${baseUrl}${Endpoints.album}/${id}`);
  }

  getEditorial(id: number): Observable<EditorialResponse> {
    return this.http.get<EditorialResponse>(
      `${baseUrl}${Endpoints.editorial}/${id}`,
    );
  }

  getSearch(
    str: string,
    index: number,
    limit: number,
  ): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${baseUrl}${Endpoints.search}`, {
      params: { q: str, index, limit },
    });
  }

  getChart(): Observable<ChartResponse> {
    return this.http.get<ChartResponse>(`${baseUrl}${Endpoints.chart}`);
  }

  getGenre(id: number): Observable<GenreResponse> {
    return this.http.get<GenreResponse>(`${baseUrl}${Endpoints.genre}/${id}`);
  }

  getRadio(id: number): Observable<RadioResponse> {
    return this.http.get<RadioResponse>(`${baseUrl}${Endpoints.radio}/${id}`);
  }
}
