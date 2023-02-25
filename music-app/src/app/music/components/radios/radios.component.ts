import { Component, Input } from '@angular/core';
import { DEFAULT_SRC } from 'src/app/constants/constants';
import { RandomColorHelper } from 'src/app/helpers/random-color-helper';
import { IRadioResponse } from 'src/app/models/api-response.models';

@Component({
  selector: 'app-radios',
  templateUrl: './radios.component.html',
  styleUrls: ['./radios.component.scss'],
})
export class RadiosComponent extends RandomColorHelper {
  defaultImg: string = DEFAULT_SRC;

  @Input() radios: Partial<IRadioResponse>[] = [];
}
