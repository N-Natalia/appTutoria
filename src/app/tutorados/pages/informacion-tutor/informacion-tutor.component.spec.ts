import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionTutorComponent } from './informacion-tutor.component';

describe('InformacionTutorComponent', () => {
  let component: InformacionTutorComponent;
  let fixture: ComponentFixture<InformacionTutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformacionTutorComponent]
    });
    fixture = TestBed.createComponent(InformacionTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
