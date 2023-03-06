import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentTrackListComponent } from './current-track-list.component';

describe('CurrentTrackListComponent', () => {
  let component: CurrentTrackListComponent;
  let fixture: ComponentFixture<CurrentTrackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentTrackListComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurrentTrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
