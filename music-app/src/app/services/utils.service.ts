import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  // eslint-disable-next-line class-methods-use-this
  getShuffledArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    let lastItemIndex = array.length - 1;
    let randomNum = 0;
    let tmp;

    while (lastItemIndex) {
      randomNum = Math.floor(Math.random() * (lastItemIndex + 1));
      tmp = shuffledArray[lastItemIndex];
      shuffledArray[lastItemIndex] = shuffledArray[randomNum];
      shuffledArray[randomNum] = tmp;
      lastItemIndex -= 1;
    }
    return shuffledArray;
  }
}
