import * as moment from 'moment';
import { OnInit, Component } from '@angular/core';
import { ITrackResponse } from '../../models/api-response.models';
import { StateService } from '../../services/state.service';
import { DeezerRestApiService } from '../../services/deezer-api.service';
import { IGreetings } from '../../models/greetings.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  trackList!: Partial<ITrackResponse>[];

  greetings: IGreetings[] = [
    { message: 'home.greeting.morning', hoursStart: 4, hoursEnd: 12 },
    { message: 'home.greeting.afternoon', hoursStart: 12, hoursEnd: 17 },
    { message: 'home.greeting.evening', hoursStart: 17, hoursEnd: 21 },
    { message: 'home.greeting.night', hoursStart: 21, hoursEnd: 4 },
  ];

  constructor(
    private myState: StateService,
    private myDeezer: DeezerRestApiService,
  ) { }

  ngOnInit(): void {
    this.myDeezer.getSearch('queen', 0, 25).subscribe((response) => {
      this.trackList = response.data;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getCurrentTimeHours() {
    return moment().hours();
  }

  isTrackList(): boolean {
    return Boolean(this.trackList.length);
  }
}
