import { Component, Input } from '@angular/core';

import { IGenreResponse } from '../../../models/api-response.models';
import { COLORS, DEFAULT_SRC } from '../../../constants/constants';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['../../search/search.component.scss'],
})

export class GenresComponent {
  defaultImg: string = DEFAULT_SRC;

  colors: string[] = COLORS;

  @Input() genres: Partial<IGenreResponse>[] = [];

  randomColor(i: number) {
    const index = i % this.colors.length;
    return this.colors[index];
  }
}
