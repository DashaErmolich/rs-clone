import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export default class AppComponent implements OnInit {
  title = 'music-app';

  ngOnInit() {
    this.getTrack();
  }

  // eslint-disable-next-line class-methods-use-this
  async getTrack(): Promise<void> {
    const response = await fetch('https://api.deezer.com/album/302128%27');
    const result = await response.json();
    // eslint-disable-next-line no-console
    console.log(result);
  }
}
