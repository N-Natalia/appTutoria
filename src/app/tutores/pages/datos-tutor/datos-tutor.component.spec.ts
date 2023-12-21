import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTutorComponent } from './datos-tutor.component';

describe('DatosTutorComponent', () => {
  let component: DatosTutorComponent;
  let fixture: ComponentFixture<DatosTutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatosTutorComponent]
    });
    fixture = TestBed.createComponent(DatosTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
