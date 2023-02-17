import { Component, Input } from '@angular/core';

import { DEFAULT_SRC } from '../../../constants/constants';
import { IAlbumResponse } from '../../../models/api-response.models';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['../../search/search.component.scss'],
})

export class AlbumsComponent {
  defaultImg: string = DEFAULT_SRC;

  @Input() albums: Partial<IAlbumResponse>[] = [];
}
