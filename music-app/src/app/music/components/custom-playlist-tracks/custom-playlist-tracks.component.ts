import { Component, Input } from '@angular/core';
import { TracksComponent } from '../tracks/tracks.component';

@Component({
  selector: 'app-custom-playlist-tracks',
  templateUrl: './custom-playlist-tracks.component.html',
  styleUrls: ['../tracks/tracks.component.scss'],
})
export class CustomPlaylistTracksComponent extends TracksComponent {
  @Input() customPlaylistTracks: number[] = [];

  addTrackToPlaylist(trackIndex: number): void {
    this.customPlaylistTracks.push(this.tracks[trackIndex].id!);
    console.log(trackIndex);
  }
}
