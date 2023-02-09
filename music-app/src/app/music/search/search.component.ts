import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IGenreResponse,
  IPlayListResponse,
  ITrackResponse,
  IArtistResponse,
  IAlbumResponse,
} from 'src/app/models/api-response.models';
import { DeezerRestApiService } from 'src/app/services/deezer-api.service';
import { DEFAULT_SRC, COLORS } from 'src/app/constants/constants';
import { SearchType } from 'src/app/enums/endpoints';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})


