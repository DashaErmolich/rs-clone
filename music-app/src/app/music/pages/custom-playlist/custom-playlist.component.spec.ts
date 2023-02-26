import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPlaylistComponent } from './custom-playlist.component';

describe('CustomPlaylistComponent', () => {
  let component: CustomPlaylistComponent;
  let fixture: ComponentFixture<CustomPlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomPlaylistComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CustomPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
