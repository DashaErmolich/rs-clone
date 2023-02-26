import { Component, Input } from '@angular/core';

import { IGenreResponse } from '../../../models/api-response.models';
import { DEFAULT_SRC } from '../../../constants/constants';
import { RandomColorHelper } from '../../../helpers/random-color-helper';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  // styleUrls: ['../../pages/search/search.component.scss'],
})

export class GenresComponent extends RandomColorHelper {
  defaultImg: string = DEFAULT_SRC;

  @Input() genres: Partial<IGenreResponse>[] = [];
}
