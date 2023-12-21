import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoGeneralTutoradoComponent } from './info-general-tutorado.component';

describe('InfoGeneralTutoradoComponent', () => {
  let component: InfoGeneralTutoradoComponent;
  let fixture: ComponentFixture<InfoGeneralTutoradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoGeneralTutoradoComponent]
    });
    fixture = TestBed.createComponent(InfoGeneralTutoradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
