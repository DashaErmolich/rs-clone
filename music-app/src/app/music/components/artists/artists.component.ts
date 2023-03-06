import { Component, Input } from '@angular/core';

import { IArtistResponse } from '../../../models/api-response.models';
import { DEFAULT_SRC } from '../../../constants/constants';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
})

export class ArtistsComponent {
  defaultImg: string = DEFAULT_SRC;

  @Input() artists: Partial<IArtistResponse>[] = [];
}
