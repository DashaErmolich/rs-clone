import { Component, Input } from '@angular/core';

import { IGenreResponse } from '../../../models/api-response.models';
import { COLORS, DEFAULT_SRC } from '../../../constants/constants';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['../../search/search.component.scss'],
})

export class GenresComponent {
  defaultImg: string = DEFAULT_SRC;

  colors: string[] = this.myUtils.getShuffledArray(COLORS);

  @Input() genres: Partial<IGenreResponse>[] = [];

  constructor(
    private myUtils: UtilsService,
  ) { }

  randomColor(i: number) {
    const index = i % this.colors.length;
    return this.colors[index];
  }
}
