import { Component, Input } from '@angular/core';

import { IPlayListResponse } from '../../../models/api-response.models';
import { DEFAULT_SRC, COLORS } from '../../../constants/constants';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['../../search/search.component.scss'],
})

export class PlaylistsComponent {
  defaultImg: string = DEFAULT_SRC;

  colors: string[] = COLORS;

  @Input() playlists: Partial<IPlayListResponse>[] = [];

  randomColor(i: number) {
    const index = i % this.colors.length;
    return this.colors[index];
  }
}
