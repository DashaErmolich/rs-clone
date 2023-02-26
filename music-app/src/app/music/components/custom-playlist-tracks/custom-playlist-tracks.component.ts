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
    const isAdded = this.isAdded(trackIndex);
    if (!isAdded) {
      this.customPlaylistTracks.push(this.tracks[trackIndex].id!);
    } else {
      const indexInPlaylist = this.customPlaylistTracks
        .findIndex((trackId) => trackId === this.tracks[trackIndex].id);
      if (indexInPlaylist >= 0) {
        this.customPlaylistTracks.splice(indexInPlaylist, 1);
      }
    }
  }

  isAdded(trackIndex: number): boolean {
    return this.customPlaylistTracks.includes(this.tracks[trackIndex].id!);
  }
}
