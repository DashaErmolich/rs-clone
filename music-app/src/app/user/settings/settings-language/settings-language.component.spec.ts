import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLanguageComponent } from './settings-language.component';

describe('SettingsLanguageComponent', () => {
  let component: SettingsLanguageComponent;
  let fixture: ComponentFixture<SettingsLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsLanguageComponent],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SettingsLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
