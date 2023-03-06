import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPlaylistTracksComponent } from './custom-playlist-tracks.component';

describe('CustomPlaylistTracksComponent', () => {
  let component: CustomPlaylistTracksComponent;
  let fixture: ComponentFixture<CustomPlaylistTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomPlaylistTracksComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomPlaylistTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
