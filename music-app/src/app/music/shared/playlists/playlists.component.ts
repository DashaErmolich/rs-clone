import { Component, Input } from '@angular/core';

import { IPlayListResponse } from '../../../models/api-response.models';
import { DEFAULT_SRC } from '../../../constants/constants';
import { RandomColorHelper } from '../../../helpers/random-color-helper';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['../../search/search.component.scss'],
})

export class PlaylistsComponent extends RandomColorHelper {
  defaultImg: string = DEFAULT_SRC;

  @Input() playlists: Partial<IPlayListResponse>[] = [];
<<<<<<< HEAD
=======

  randomColor(i: number) {
    // console.log(this.playlists)
    const index = i % this.colors.length;
    return this.colors[index];
  }
>>>>>>> 124487a (feat: add search-result component)
}
