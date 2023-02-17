import { Directive } from '@angular/core';

import { UtilsService } from '../services/utils.service';
import { COLORS } from '../constants/constants';

@Directive()

export class RandomColorHelper {
  colors = this.myUtils.getShuffledArray(COLORS);

  constructor(
    private myUtils: UtilsService,
  ) {
  }

  randomColor(i: number) {
    const index = i % this.colors.length;
    return this.colors[index];
  }
}
