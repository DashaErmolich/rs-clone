import { Component, Input } from '@angular/core';
import { DEFAULT_SRC } from '../../../constants/constants';
import { ICustomPlaylistModel } from '../../../models/user-model.models';
import { RandomColorHelper } from '../../../helpers/random-color-helper';

@Component({
  selector: 'app-custom-playlists',
  templateUrl: './custom-playlists.component.html',
  styleUrls: ['../../pages/search/search.component.scss'],
})

export class CustomPlaylistsComponent extends RandomColorHelper {
  defaultImg: string = DEFAULT_SRC;

  @Input() customPlaylists: ICustomPlaylistModel[] = [];
}
