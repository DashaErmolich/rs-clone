import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedPlaylistsComponent } from './created-playlists.component';

describe('CreatedPlaylistsComponent', () => {
  let component: CreatedPlaylistsComponent;
  let fixture: ComponentFixture<CreatedPlaylistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatedPlaylistsComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreatedPlaylistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
