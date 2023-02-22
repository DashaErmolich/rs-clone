import { Component, Input } from '@angular/core';

import { IPlayListResponse } from '../../../models/api-response.models';
import { DEFAULT_SRC } from '../../../constants/constants';
import { RandomColorHelper } from '../../../helpers/random-color-helper';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['../../pages/search/search.component.scss'],
})

export class PlaylistsComponent extends RandomColorHelper {
  defaultImg: string = DEFAULT_SRC;

  @Input() playlists: Partial<IPlayListResponse>[] = [];
}
