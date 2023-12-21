import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTutoradosHistorialComponent } from './datos-tutorados-historial.component';

describe('DatosTutoradosHistorialComponent', () => {
  let component: DatosTutoradosHistorialComponent;
  let fixture: ComponentFixture<DatosTutoradosHistorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatosTutoradosHistorialComponent]
    });
    fixture = TestBed.createComponent(DatosTutoradosHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
